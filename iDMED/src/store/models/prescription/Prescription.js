import { Model } from '@vuex-orm/core'
import Doctor from '../doctor/Doctor'
import Episode from '../episode/Episode'
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
        episode_id: this.attr(''),
        // Relationships
        doctor: this.belongsTo(Doctor, 'doctor_id'),
        episode: this.belongsTo(Episode, 'episode_id'),
        prescription_detail: this.hasOne(PrescriptionDetail, 'prescription_id'),
        prescribed_drugs: this.hasMany(PrescribedDrug, 'prescription_id')
      }
    }
}
