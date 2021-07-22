import { Model } from '@vuex-orm/core'
import PatientVisitDetails from '../patientVisitDetails/PatientVisitDetails'
import AdherenceScreening from '../screening/AdherenceScreening'
import PregnancyScreening from '../screening/PregnancyScreening'
import RAMScreening from '../screening/RAMScreening'
import TBScreening from '../screening/TBScreening'
import VitalSignsScreening from '../screening/VitalSignsScreening'

export default class PatientVisit extends Model {
  static entity = 'patientVisits'

  static fields () {
    return {
      id: this.attr(null),
      visitDate: this.attr(''),
      // Relationships
      patientVisitDetails: this.hasMany(PatientVisitDetails, 'patient_visit_id'),
      adherenceScreenings: this.hasOne(AdherenceScreening, 'patient_visit_id'),
      RAMScreenings: this.hasOne(RAMScreening, 'patient_visit_id'),
      TBScreenings: this.hasOne(TBScreening, 'patient_visit_id'),
      vitalSignsScreenings: this.hasOne(VitalSignsScreening, 'patient_visit_id'),
      pregnancyScreenings: this.hasOne(PregnancyScreening, 'patient_visit_id')
    }
  }
}
