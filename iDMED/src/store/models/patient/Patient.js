import { Model } from '@vuex-orm/core'
import Appointment from '../appointment/Appointment'
import GroupMember from '../groupMember/GroupMember'
import PatientAttribute from '../patientAttribute/PatientAttribute'
import PatientProgramIdentifier from '../patientProgramIdentifier/PatientProgramIdentifier'
import Province from '../province/Province'

export default class Patient extends Model {
  static entity = 'patients'

  static fields () {
    return {
      id: this.attr(null),
      firstnames: this.attr(''),
      lastname: this.attr(''),
      gender: this.attr(''),
      dateofbirth: this.attr(''),
      cellphone: this.attr(''),
      alternativeCellphone: this.attr(''),
      address: this.attr(''),
      otherAddress: this.attr(''),
      accountstatus: this.attr(''),
      province_id: this.attr(''),

      // Relationships
      province: this.belongsTo(Province, 'province_id'),
      attributes: this.hasMany(PatientAttribute, 'patient_id'),
      identifiers: this.hasMany(PatientProgramIdentifier, 'patient_id'),
      appointments: this.hasMany(Appointment, 'patient_id'),
      members: this.hasMany(GroupMember, 'patient_id')

    }
  }
}
