import { Model } from '@vuex-orm/core'

export default class Menu extends Model {
  static entity = 'menus'

  static state () {
    return {
      fetching: false
    }
}

  static fields () {
    return {
      id: this.attr(null),
      code: this.attr(''),
      description: this.attr('')
    }
  }

  static async apiGetAll () {
    return await this.api().get('/menu')
  }
}
