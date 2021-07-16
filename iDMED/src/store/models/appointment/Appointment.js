import { Model } from '@vuex-orm/core'
import Patient from 'src/store/models/patient/Patient'

export default class Appointment extends Model {
  static entity = 'appointments'

  static fields () {
    return {
      id: this.attr(null),
      appointmentDate: this.attr(''),
      visitDate: this.attr(''),
      patient_id: this.attr(''),
      // Relationships
      patient: this.belongsTo(Patient, 'patient_id')

    }
  }
}
