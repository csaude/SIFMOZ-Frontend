import { Model } from '@vuex-orm/core'
import Doctor from '../doctor/Doctor'
import PatientVisitDetails from '../patientVisitDetails/PatientVisitDetails'
import PrescriptionDetail from '../prescriptionDetails/PrescriptionDetail'
import PrescribedDrug from '../prescriptionDrug/PrescribedDrug'

export default class Prescription extends Model {
    static entity = 'prescriptions'
    static fields () {
      return {
        id: this.attr(null),
        duration: this.attr(''),
        prescriptionDate: this.attr(''),
        expiryDate: this.attr(''),
        current: this.attr(''),
        notes: this.attr(''),
        prescriptionSeq: this.attr(''),
        modified: this.attr(''),
        doctor_id: this.attr(''),
        patientVisitDetails_id: this.attr(''),
        // Relationships
        doctor: this.belongsTo(Doctor, 'doctor_id'),
        patientVisitDetails: this.belongsTo(PatientVisitDetails, 'prescription_id'),
        prescriptionDetail: this.hasOne(PrescriptionDetail, 'prescription_id'),
        prescribedDrugs: this.hasMany(PrescribedDrug, 'prescription_id')
      }
    }
}
