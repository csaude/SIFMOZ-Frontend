import { Model } from '@vuex-orm/core'
import db from 'src/store/localbase'
import { v4 as uuidv4 } from 'uuid'
import { nSQL } from 'nano-sql'

export default class DispenseType extends Model {
  static entity = 'dispenseTypes'

  static fields () {
    return {
      id: this.uid(() => uuidv4()),
      code: this.attr(''),
      syncStatus: this.attr(''),
      description: this.attr('')

    }
  }

  isDS () {
    return this.code === 'DS'
  }

  isDM () {
    return this.code === 'DM'
  }

  isDT () {
    return this.code === 'DT'
  }

  isDA () {
    return this.code === 'DA'
  }

  getRelatedWeeks () {
    if (this.isDM()) {
      return 4
    } else if (this.isDT()) {
      return 12
    } else if (this.isDS()) {
      return 24
    } else if (this.isDA()) {
      return 52
    }
  }

  static async apiGetAll (offset, max) {
    return await this.api().get('/dispenseType?offset=0&max=100')
  }

  static async apiFetchById (id) {
    return await this.api().get(`/dispenseType/${id}`)
  }

  static localDbAdd (dispenseType) {
    return nSQL(this.entity).query('upsert',
    dispenseType
     ).exec().then(
      DispenseType.insertOrUpdate({ data: dispenseType })
     )
  }

    static localDbGetAll () {
    return nSQL(this.entity).query('select').exec().then(result => {
      console.log(result)
      DispenseType.insertOrUpdate({ data: result })
      })
  }

  static async localDbGetById (id) {
    return nSQL(this.entity).query('select').where(['id', '=', id]).exec().then(result => {
       return result[0]
     })
 }
}
