import { Model } from '@vuex-orm/core'

export default class RoleMenu extends Model {
    static entity = 'roleMenus'
     static primaryKey = ['role_id', 'menu_id']

    static fields () {
      return {
        role_id: this.attr(null),
        menu_id: this.attr(null)
      }
    }
  }
