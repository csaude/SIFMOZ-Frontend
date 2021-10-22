import { Model } from '@vuex-orm/core'
import Episode from '../episode/Episode'
import IdentifierType from '../identifierType/IdentifierType'
import Patient from '../patient/Patient'
import ClinicalService from '../ClinicalService/ClinicalService'

export default class PatientServiceIdentifier extends Model {
  static entity = 'identifiers'

  static fields () {
    return {
      id: this.attr(null),
      startDate: this.attr(''),
      endDate: this.attr(''),
      reopenDate: this.attr(''),
      value: this.attr(''),
      prefered: this.boolean(false),
      identifier_type_id: this.attr(''),
      service_id: this.attr(''),
      patient_id: this.attr(''),
      // Relationships
      identifierType: this.belongsTo(IdentifierType, 'identifier_type_id'),
      service: this.belongsTo(ClinicalService, 'service_id'),
      patient: this.belongsTo(Patient, 'patient_id'),
      episodes: this.hasMany(Episode, 'patientServiceIdentifier_id')

    }
  }

  hasEpisodes () {
    return this.episodes.length > 0
  }

  curEpisode () {
    let curEpisode = ''
    Object.keys(this.episodes).forEach(function (k) {
      const id = this.episodes[k]
      if (!id.closed()) {
        curEpisode = id
      }
    }.bind(this))
    return curEpisode
  }

  lastVisit () {
    if (this.episodes.length <= 0) return null
    return this.curEpisode().lastVisit()
  }

  lastEpisodeWithVisit () {
    let curEpisode = ''
    Object.keys(this.episodes).forEach(function (k) {
      const ep = this.episodes[k]
      if (ep.patientVisitDetails != null) {
        curEpisode = ep
      }
    }.bind(this))
    return curEpisode
  }

  static async apiSave (identifier) {
    return await this.api().post('/patientServiceIdentifier', identifier)
  }

  static async apiGetAllByClinicId (clinicId, offset, max) {
    return await this.api().get('/patientServiceIdentifier/clinic/' + clinicId + '?offset=' + offset + '&max=' + max)
  }
}
