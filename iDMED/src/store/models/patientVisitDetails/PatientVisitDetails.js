import { Model } from '@vuex-orm/core'
import Episode from '../episode/Episode'
import Pack from '../packaging/Pack'
import Prescription from '../prescription/Prescription'
import PatientVisit from '../patientVisit/PatientVisit'

export default class PatientVisitDetails extends Model {
  static entity = 'patientVisitDetails'

  static fields () {
    return {
      id: this.attr(null),
      patient_visit_id: this.attr(''),
      episode_id: this.attr(''),
      // Relationships
      packs: this.hasMany(Pack, 'patientVisitDetails_id'),
      episode: this.belongsTo(Episode, 'episode_id'),
      patientVisit: this.belongsTo(PatientVisit, 'patient_visit_id'),
      prescriptions: this.hasMany(Prescription, 'patientVisitDetails_id')
    }
  }

  static async apiFetchById (id) {
    return await this.api().get(`/patientVisitDetail/${id}`)
  }

  static async apiSave (patientVisitDetail) {
    return await this.api().post('/patientVisitDetail', patientVisitDetail)
  }
}
