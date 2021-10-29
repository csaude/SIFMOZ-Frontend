import { Model } from '@vuex-orm/core'
import ClinicSector from '../clinicSector/ClinicSector'
import EpisodeType from '../episodeType/EpisodeType'
import PatientProgramIdentifier from '../patientServiceIdentifier/PatientServiceIdentifier'
import PatientVisitDetails from '../patientVisitDetails/PatientVisitDetails'
import StartStopReason from '../startStopReason/StartStopReason'

export default class Episode extends Model {
  static entity = 'episodes'

  static fields () {
    return {
      id: this.attr(null),
      startDate: this.attr(''),
      stopDate: this.attr(''),
      notes: this.attr(''),
      episodeType_id: this.attr(''),
      clinicSector_id: this.attr(''),
      patientServiceIdentifier_id: this.attr(''),
      startStopReason_id: this.attr(''),
      // Relationships
      startStopReason: this.belongsTo(StartStopReason, 'startStopReason_id'),
      episodeType: this.belongsTo(EpisodeType, 'episodeType_id'),
      clinicSector: this.belongsTo(ClinicSector, 'clinicSector_id'),
      patientServiceIdentifier: this.belongsTo(PatientProgramIdentifier, 'patientServiceIdentifier_id'),
      patientVisitDetails: this.hasMany(PatientVisitDetails, 'episode_id')
    }
  }

  closed () {
    return this.stopDate !== ''
  }

  hasVisits () {
    return this.patientVisitDetails.length > 0
  }

  lastVisit () {
    if (this.patientVisitDetails.length <= 0) return null
    let lastVisit = ''
    Object.keys(this.patientVisitDetails).forEach(function (k) {
      const id = this.patientVisitDetails[k]
      if (lastVisit === '') {
        lastVisit = id
      } else if (lastVisit.id !== '') {
        if (new Date(lastVisit.patientVisit.visitDate) < new Date(id.patientVisit.visitDate)) {
          lastVisit = id
        }
      }
    }.bind(this))
    return lastVisit
  }

  static async apiSave (episode) {
    return await this.api().post('/episode', episode)
  }

  static async apiGetAllByClinicId (clinicId, offset, max) {
    return await this.api().get('/episode/clinic/' + clinicId + '?offset=' + offset + '&max=' + max)
  }
}
