import { Model } from '@vuex-orm/core'
import Group from '../group/Group'
import Patient from '../patient/Patient'

export default class GroupMember extends Model {
  static entity = 'members'

  static fields () {
    return {
      id: this.attr(null),
      startDate: this.attr(''),
      endDate: this.attr(''),
      group_id: this.attr(''),
      patient_id: this.attr(''),
      // Relationships
      group: this.belongsTo(Group, 'group_id'),
      patient: this.belongsTo(Patient, 'patient_id')

    }
  }
}
