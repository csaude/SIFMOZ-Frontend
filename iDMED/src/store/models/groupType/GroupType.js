import { Model } from '@vuex-orm/core'
import Group from '../group/Group'

export default class GroupType extends Model {
  static entity = 'groupTypes'

  static fields () {
    return {
      id: this.attr(null),
      code: this.attr(''),
      description: this.attr(''),
      groups: this.hasMany(Group, 'groupType_id')
    }
  }

  static async apiGetAll () {
    return await this.api().get('/groupType')
  }
}
