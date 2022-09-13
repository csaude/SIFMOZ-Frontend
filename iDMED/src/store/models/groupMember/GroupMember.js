import { Model } from '@vuex-orm/core'
import Clinic from '../clinic/Clinic'
import Group from '../group/Group'
import GroupMemberPrescription from '../group/GroupMemberPrescription'
import Patient from '../patient/Patient'

export default class GroupMember extends Model {
  static entity = 'members'

  static fields () {
    return {
      id: this.attr(null),
      startDate: this.attr(''),
      endDate: this.attr(null),
      group_id: this.attr(''),
      patient_id: this.attr(''),
      clinic_id: this.attr(''),
      // Relationships
      group: this.belongsTo(Group, 'group_id'),
      patient: this.belongsTo(Patient, 'patient_id'),
      clinic: this.belongsTo(Clinic, 'clinic_id'),
      groupMemberPrescription: this.hasMany(GroupMemberPrescription, 'member_id')

    }
  }

  isActive () {
    return this.endDate === null
  }

  static async apiUpdate (member) {
    return await this.api().post('/groupMember', member)
  }
}
