import { Model } from '@vuex-orm/core'
import GroupMember from '../groupMember/GroupMember'
import GroupType from '../groupType/GroupType'
import ClinicalService from '../ClinicalService/ClinicalService'
import Clinic from '../clinic/Clinic'
import GroupPackHeader from './GroupPackHeader'

export default class Group extends Model {
  static entity = 'groups'

  static fields () {
    return {
      id: this.attr(null),
      code: this.attr(''),
      name: this.attr(''),
      startDate: this.attr(''),
      endDate: this.attr(''),
      groupType_id: this.attr(''),
      clinical_service_id: this.attr(''),
      clinic_id: this.attr(''),
      // Relationships
      groupType: this.belongsTo(GroupType, 'groupType_id'),
      members: this.hasMany(GroupMember, 'group_id'),
      service: this.belongsTo(ClinicalService, 'clinical_service_id'),
      clinic: this.belongsTo(Clinic, 'clinic_id'),
      packHeaders: this.hasMany(GroupPackHeader, 'group_id')

    }
  }

  isDesintegrated () {
    return this.endDate !== null
  }

  static async apiFetchById (id) {
    return await this.api().get(`/groupInfo/${id}`)
  }

  static async apiSave (group) {
    return await this.api().post('/groupInfo', group)
  }

  static async apiUpdate (group) {
    return await this.api().post('/groupInfo', group)
  }

  static async apiGetAllByClinicId (clinicId, offset, max) {
    return await this.api().get('/groupInfo/clinic/' + clinicId + '?offset=' + offset + '&max=' + max)
  }

  static async apiValidateBeforeAdd (patientId, code) {
    return await this.api().get(`/groupInfo/validadePatient/${patientId}/${code}`)
  }
}
