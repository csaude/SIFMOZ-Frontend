import { Model } from '@vuex-orm/core'
import { date } from 'quasar'
import Appointment from '../appointment/Appointment'
import GroupMember from '../groupMember/GroupMember'
import PatientAttribute from '../patientAttribute/PatientAttribute'
import PatientServiceIdentifier from '../patientServiceIdentifier/PatientServiceIdentifier'
import Province from '../province/Province'
import District from '../district/District'
import Clinic from '../clinic/Clinic'
import PostoAdministrativo from '../PostoAdministrativo/PostoAdministrativo'
import Localidade from '../Localidade/Localidade'

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
      lastNames: this.attr(''),
      gender: this.attr(''),
      dateOfBirth: this.attr(''),
      cellphone: this.attr(''),
      alternativeCellphone: this.attr(''),
      address: this.attr(''),
      addressReference: this.attr(''),
      accountstatus: this.boolean(true),
      province_id: this.attr(''),
      district_id: this.attr(''),
      postoAdministrativo_id: this.attr(''),
      bairro_id: this.attr(''),
      clinic_id: this.attr(''),

      // Relationships
      province: this.belongsTo(Province, 'province_id'),
      attributes: this.hasMany(PatientAttribute, 'patient_id'),
      identifiers: this.hasMany(PatientServiceIdentifier, 'patient_id'),
      appointments: this.hasMany(Appointment, 'patient_id'),
      members: this.hasMany(GroupMember, 'patient_id'),
      district: this.belongsTo(District, 'district_id'),
      postoAdministrativo: this.belongsTo(PostoAdministrativo, 'postoAdministrativo_id'),
      bairro: this.belongsTo(Localidade, 'bairro_id'),
      clinic: this.belongsTo(Clinic, 'clinic_id')

    }
  }

  bairroName () {
    if (this.bairro === null) return ''
    return this.bairro.description
  }

  postoAdministrativoName () {
    if (this.postoAdministrativo === null) return ''
    return this.postoAdministrativo.description
  }

  preferedIdentifier () {
    if (this.identifiers.length <= 0) return null
    let preferedId = {}
    Object.keys(this.identifiers).forEach(function (k) {
      const id = this.identifiers[k]
      if (id.prefered) {
        preferedId = id
      }
    }.bind(this))
    return preferedId
  }

  preferedIdentifierValue () {
    if (this.identifiers.length <= 0) return 'Sem identificador'
    let preferedId = {}
    Object.keys(this.identifiers).forEach(function (k) {
      const id = this.identifiers[k]
      if (id.prefered) {
        preferedId = id
      }
    }.bind(this))
    return preferedId.value
  }

  age () {
    return date.getDateDiff(new Date(), new Date(this.dateOfBirth), 'years')
  }

  static async apiFetchById (id) {
    return await this.api().get(`/patient/${id}`)
  }

  static async apiSearch (patient) {
    return await this.api().post('/patient/search', patient)
  }

  static async apiSave (patient) {
    return await this.api().post('/patient', patient)
  }

  static async apiGetAllByClinicId (clinicId, offset, max) {
    return await this.api().get('/patient/clinic/' + clinicId + '?offset=' + offset + '&max=' + max)
  }
}
