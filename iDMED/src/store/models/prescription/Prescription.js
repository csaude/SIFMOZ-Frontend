import { Model } from '@vuex-orm/core'
import Clinic from '../clinic/Clinic'
import Doctor from '../doctor/Doctor'
import Duration from '../Duration/Duration'
import PatientVisitDetails from '../patientVisitDetails/PatientVisitDetails'
import PrescriptionDetail from '../prescriptionDetails/PrescriptionDetail'
import PrescribedDrug from '../prescriptionDrug/PrescribedDrug'

export default class Prescription extends Model {
    static entity = 'prescriptions'
    static fields () {
      return {
        id: this.attr(null),
        duration_id: this.attr(''),
        prescriptionDate: this.attr(''),
        expiryDate: this.attr(''),
        current: this.boolean(true),
        notes: this.attr(''),
        prescriptionSeq: this.attr(''),
        modified: this.boolean(false),
        patientType: this.attr(''),
        patientStatus: this.attr(''),
        doctor_id: this.attr(''),
        patientVisitDetails_id: this.attr(''),
        clinic_id: this.attr(''),
        // Relationships
        clinic: this.belongsTo(Clinic, 'clinic_id'),
        doctor: this.belongsTo(Doctor, 'doctor_id'),
        patientVisitDetails: this.belongsTo(PatientVisitDetails, 'patientVisitDetails_id'),
        prescriptionDetail: this.hasOne(PrescriptionDetail, 'prescription_id'),
        duration: this.hasOne(Duration, 'duration_id'),
        prescribedDrugs: this.hasMany(PrescribedDrug, 'prescription_id')
      }
    }

    static async apiSave (prescription) {
      return await this.api().post('/prescription', prescription)
    }
}
