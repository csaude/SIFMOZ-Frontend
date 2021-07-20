import { Model } from '@vuex-orm/core'
import PatientVisitDetails from '../patientVisitDetails/PatientVisitDetails'

export default class PatientVisit extends Model {
  static entity = 'patientVisits'

  static fields () {
    return {
      id: this.attr(null),
      visitDate: this.attr(''),
      // Relationships
      patientVisitDetails: this.hasMany(PatientVisitDetails, 'patient_visit_id')
    }
  }
}
