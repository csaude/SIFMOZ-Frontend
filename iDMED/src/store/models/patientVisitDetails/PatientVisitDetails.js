import { Model } from '@vuex-orm/core'
import Episode from '../episode/Episode'
import Pack from '../packaging/Pack'
import Prescription from '../prescription/Prescription'
import PatientVisit from '../patientVisit/PatientVisit'
import Clinic from '../clinic/Clinic'

export default class PatientVisitDetails extends Model {
  static entity = 'patientVisitDetails'

  static fields () {
    return {
      id: this.attr(null),
      patient_visit_id: this.attr(''),
      episode_id: this.attr(''),
      clinic_id: this.attr(''),
      createPackLater: this.boolean(false),
        // Relationships
      clinic: this.belongsTo(Clinic, 'clinic_id'),
      packs: this.hasMany(Pack, 'patientVisitDetails_id'),
      episode: this.belongsTo(Episode, 'episode_id'),
      patientVisit: this.belongsTo(PatientVisit, 'patient_visit_id'),
      prescriptions: this.hasMany(Prescription, 'patientVisitDetails_id')
    }
  }

  lastPack () {
    if (this.packs.length <= 0) return null
    let lastPack = ''
    Object.keys(this.packs).forEach(function (k) {
      const id = this.packs[k]
      if (lastPack === '') {
        lastPack = id
      } else if (lastPack.id !== '') {
        if (new Date(lastPack.pickupDate) < new Date(id.pickupDate)) {
          lastPack = id
        }
      }
    }.bind(this))
    return lastPack
  }

  getPrescriptionRemainigDuration () {
    if (this.prescriptions[0] === null) return 0
    const prescriptionDuration = Number(this.prescriptions[0].duration.weeks)
    let packagedWeeks = 0
    Object.keys(this.packs).forEach(function (k) {
      const pack = this.packs[k]
      packagedWeeks = Number(packagedWeeks + pack.weeksSupply)
    }.bind(this))
    return Number((prescriptionDuration - packagedWeeks) / 4)
  }

  static async apiFetchById (id) {
    return await this.api().get(`/patientVisitDetails/${id}`)
  }

  static async apiSave (patientVisitDetail) {
    return await this.api().post('/patientVisitDetails', patientVisitDetail)
  }

  static async apiGetAllByClinicId (clinicId, offset, max) {
    return await this.api().get('/patientVisitDetails/clinic/' + clinicId + '?offset=' + offset + '&max=' + max)
  }

  static async apiGetAllByEpisodeId (episodeId, offset, max) {
    return await this.api().get('/patientVisitDetails/episode/' + episodeId + '?offset=' + offset + '&max=' + max)
  }
}
