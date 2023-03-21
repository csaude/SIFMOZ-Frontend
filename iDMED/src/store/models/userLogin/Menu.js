import { Model } from '@vuex-orm/core'
// import db from 'src/store/localbase'
import { nSQL } from 'nano-sql'

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

  static localDbUpdateAll (menus) {
    return nSQL(this.entity).query('upsert',
    menus
       ).exec().then(
        Menu.insertOrUpdate({ data: menus })
       )
  }

  static localDbGetAll () {
    return nSQL(this.entity).query('select').exec().then(result => {
      console.log(result)
      Menu.insertOrUpdate({ data: result })
      })
  }
}
