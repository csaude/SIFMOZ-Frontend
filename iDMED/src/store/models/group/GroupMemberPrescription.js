import { Model } from '@vuex-orm/core'
import GroupMember from '../groupMember/GroupMember'
import Prescription from '../prescription/Prescription'

export default class GroupMemberPrescription extends Model {
  static entity = 'groupMemberPrescriptions'

  static fields () {
    return {
      id: this.attr(null),
      prescription_id: this.attr(''),
      member_id: this.attr(''),
      used: this.boolean(false),
      // Relationships
      member: this.belongsTo(GroupMember, 'member_id'),
      prescription: this.belongsTo(Prescription, 'prescription_id')
    }
  }

  static async apiFetchById (id) {
    return await this.api().get(`/groupMemberPrescription/${id}`)
  }

  static async apiFetchByMemberId (id) {
    return await this.api().get(`/groupMemberPrescription/member/${id}`)
  }

  static async apiSave (groupMemberPrescription) {
    return await this.api().post('/groupMemberPrescription', groupMemberPrescription)
  }

  static async apiUpdate (groupMemberPrescription) {
    return await this.api().post('/groupMemberPrescription', groupMemberPrescription)
  }
}
