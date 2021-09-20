import { Model } from '@vuex-orm/core'
import Appointment from '../appointment/Appointment'
import GroupMember from '../groupMember/GroupMember'
import PatientAttribute from '../patientAttribute/PatientAttribute'
import PatientProgramIdentifier from '../patientServiceIdentifier/PatientServiceIdentifier'
import Province from '../province/Province'
import District from '../district/District'
import PostoAdministrativo from '../PostoAdministrativo/PostoAdministrativo'

export default class Patient extends Model {
  static entity = 'patients'

  get fullName () {
    return `${this.firstNames} ${this.middleNames} ${this.lastNames}`
  }

  static fields () {
    return {
      id: this.attr(null),
      firstNames: this.attr(''),
      middleNames: this.attr(''),
      lastName: this.attr(''),
      gender: this.attr(''),
      dateOfBirth: this.attr(''),
      cellphone: this.attr(''),
      alternativeCellphone: this.attr(''),
      address: this.attr(''),
      addressReference: this.attr(''),
      accountstatus: this.attr(''),
      province_id: this.attr(''),
      district_id: this.attr(''),
      postoAdministrativo_id: this.attr(''),
      bairro_id: this.attr(''),

      // Relationships
      province: this.belongsTo(Province, 'province_id'),
      attributes: this.hasMany(PatientAttribute, 'patient_id'),
      identifiers: this.hasMany(PatientProgramIdentifier, 'patient_id'),
      appointments: this.hasMany(Appointment, 'patient_id'),
      members: this.hasMany(GroupMember, 'patient_id'),
      districts: this.belongsTo(District, 'district_id'),
      postoAdministrativo: this.belongsTo(PostoAdministrativo, 'postoAdministrativo_id'),
      bairro: this.belongsTo(District, 'bairro_id')

    }
  }
}
