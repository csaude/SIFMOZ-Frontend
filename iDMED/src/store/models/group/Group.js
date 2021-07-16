import { Model } from '@vuex-orm/core'
import GroupMember from '../groupMember/GroupMember'
import GroupType from '../groupType/GroupType'

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
      // Relationships
      groupType: this.belongsTo(GroupType, 'groupType_id'),
      members: this.hasMany(GroupMember, 'group_id')

    }
  }
}
