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
        // Relationships
      clinic: this.belongsTo(Clinic, 'clinic_id'),
      packs: this.hasMany(Pack, 'patientVisitDetails_id'),
      episode: this.belongsTo(Episode, 'episode_id'),
      patientVisit: this.belongsTo(PatientVisit, 'patient_visit_id'),
      prescriptions: this.hasMany(Prescription, 'patientVisitDetails_id')
    }
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
}
