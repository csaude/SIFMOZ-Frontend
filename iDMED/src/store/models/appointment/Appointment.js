import { Model } from '@vuex-orm/core'
import Patient from 'src/store/models/patient/Patient'
import { v4 as uuidv4 } from 'uuid'

export default class Appointment extends Model {
  static entity = 'appointments'

  static fields () {
    return {
      id: this.uid(() => uuidv4()),
      appointmentDate: this.attr(''),
      visitDate: this.attr(''),
      patient_id: this.attr(''),
      // Relationships
      patient: this.belongsTo(Patient, 'patient_id')

    }
  }
}
