import { Model } from '@vuex-orm/core'
import Menu from 'src/store/models/userLogin/Menu'
import RoleMenu from './RoleMenu'

export default class Role extends Model {
  static entity = 'roles'

  static state () {
    return {
      fetching: false
    }
}

  static fields () {
    return {
      id: this.attr(null),
     authority: this.attr(''),
     description: this.attr(''),
     name: this.attr(''),
     active: this.attr(''),
     syncStatus: this.attr(''),
    // menus: this.hasMany(Menu, 'role_id'),
     menus: this.belongsToMany(Menu, RoleMenu, 'role_id', 'menu_id')
    }
  }

  static async apiGetAll () {
    return await this.api().get('/role')
  }

  static async apiSave (role) {
    return await this.api().post('/role', role)
  }

  static async apiUpdate (role) {
    return await this.api().put('/role/', role)
  }
}
