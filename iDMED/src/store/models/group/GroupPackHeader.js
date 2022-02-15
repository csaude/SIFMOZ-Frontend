import { Model } from '@vuex-orm/core'
import Duration from '../Duration/Duration'
import Group from './Group'
import GroupPack from './GroupPack'

export default class GroupPackHeader extends Model {
  static entity = 'groupPackHeaders'

  static fields () {
    return {
      id: this.attr(null),
      packDate: this.attr(''),
      nextPickUpDate: this.attr(''),
      isLast: this.boolean(false),
      duration_id: this.attr(''),
      group_id: this.attr(''),
      // Relationships
      duration: this.belongsTo(Duration, 'duration_id'),
      group: this.belongsTo(Group, 'group_id'),
      groupPacks: this.hasMany(GroupPack, 'header_id')

    }
  }

  static async apiFetchById (id) {
    return await this.api().get(`/groupPackHeader/${id}`)
  }

  static async apiSave (groupPackHeader) {
    return await this.api().post('/groupPackHeader', groupPackHeader)
  }

  static async apiUpdate (groupPackHeader) {
    return await this.api().post('/groupPackHeader', groupPackHeader)
  }
}
