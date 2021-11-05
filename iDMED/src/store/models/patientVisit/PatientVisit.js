import { Model } from '@vuex-orm/core'
import Clinic from '../clinic/Clinic'
import PatientVisitDetails from '../patientVisitDetails/PatientVisitDetails'

export default class PatientVisit extends Model {
  static entity = 'patientVisits'

  static fields () {
    return {
      id: this.attr(null),
      visitDate: this.attr(''),
      clinic_id: this.attr(''),
        // Relationships
      clinic: this.belongsTo(Clinic, 'clinic_id'),
      patientVisitDetails: this.hasMany(PatientVisitDetails, 'patient_visit_id')
    }
  }

  static async apiFetchById (id) {
    return await this.api().get(`/patientVisit/${id}`)
  }

  static async apiSave (patientVisit) {
    return await this.api().post('/patientVisit', patientVisit)
  }

  static async apiGetAllByClinicId (clinicId, offset, max) {
    return await this.api().get('/patientVisit/clinic/' + clinicId + '?offset=' + offset + '&max=' + max)
  }
}
