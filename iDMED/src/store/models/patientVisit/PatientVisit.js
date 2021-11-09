import { Model } from '@vuex-orm/core'
import PatientVisitDetails from '../patientVisitDetails/PatientVisitDetails'
import PregnancyScreening from '../screening/PregnancyScreening'
import RAMScreening from '../screening/RAMScreening'
import TBScreening from '../screening/TBScreening'
import AdherenceScreening from '../screening/AdherenceScreening'
import VitalSignsScreening from '../screening/VitalSignsScreening'
import Patient from '../patient/Patient'
import Clinic from '../clinic/Clinic'

export default class PatientVisit extends Model {
  static entity = 'patientVisits'

  static fields () {
    return {
      id: this.attr(null),
      visitDate: this.attr(''),
      clinic_id: this.attr(''),
      patient_id: this.attr(''),
      // Relationships
      patientVisitDetails: this.hasMany(PatientVisitDetails, 'patient_visit_id'),
      vitalSigns: this.hasMany(VitalSignsScreening, 'patient_visit_id'),
      tbScreening: this.hasMany(TBScreening, 'patient_visit_id'),
      pregnancyScreening: this.hasMany(PregnancyScreening, 'patient_visit_id'),
      adherenceScreening: this.hasMany(AdherenceScreening, 'patient_visit_id'),
      ramScreening: this.hasMany(RAMScreening, 'patient_visit_id'),
      clinic: this.belongsTo(Clinic, 'clinic_id'),
      patient: this.belongsTo(Patient, 'patient_id')
    }
  }

  static async apiFetchById (id) {
    return await this.api().get(`/patientVisit/${id}`)
  }

  static async apiSave (patientVisit) {
    return await this.api().post('/patientVisit', patientVisit)
  }

  static async apiUpdate (patientVisit) {
    return await this.api().patch('/patientVisit', patientVisit)
  }

  static async apiRemove (id) {
    return await this.api().delete(`/patientVisit/${id}`)
  }

  static async apiGetAllByPatientId (patientId) {
    return await this.api().get('/patientVisit/pcatient/' + patientId)
  }

  static async apiGetAllByClinicId (clinicId, offset, max) {
    return await this.api().get('/patientVisit/clinic/' + clinicId + '?offset=' + offset + '&max=' + max)
  }
}
