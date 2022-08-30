import { Model } from '@vuex-orm/core'

export default class SecUserRole extends Model {
    static entity = 'secUserRoles'
    // static primaryKey = ['user_id', 'role_id']

    static fields () {
      return {
        secUser: this.attr(null),
        role: this.attr(null)
      }
    }

    static async apiSave (secUserRole) {
        return await this.api().post('/secUserRole', secUserRole)
      }
  }
