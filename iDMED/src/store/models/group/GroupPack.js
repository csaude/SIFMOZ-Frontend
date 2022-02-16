import { Model } from '@vuex-orm/core'
import Pack from '../packaging/Pack'
import GroupPackHeader from './GroupPackHeader'

export default class GroupPack extends Model {
  static entity = 'groupPacks'

  static fields () {
    return {
      id: this.attr(null),
      pack_id: this.attr(''),
      header_id: this.attr(''),
      // Relationships
      pack: this.belongsTo(Pack, 'pack_id'),
      header: this.belongsTo(GroupPackHeader, 'header_id')

    }
  }

  static async apiFetchById (id) {
    return await this.api().get(`/groupPack/${id}`)
  }

  static async apiSave (groupPack) {
    return await this.api().post('/groupPack', groupPack)
  }

  static async apiUpdate (groupPack) {
    return await this.api().post('/groupPack', groupPack)
  }
}
