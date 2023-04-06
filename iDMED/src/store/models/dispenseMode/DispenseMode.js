import { Model } from '@vuex-orm/core'
import { v4 as uuidv4 } from 'uuid'
import { nSQL } from 'nano-sql'

export default class DispenseMode extends Model {
  static entity = 'dispenseModes'

  static fields () {
    return {
      id: this.uid(() => uuidv4()),
      code: this.attr(''),
      description: this.attr(''),
      syncStatus: this.attr(''),
      openmrsUuid: this.attr('')
    }
  }

  static async apiGetAll () {
    return await this.api().get('/dispenseMode')
  }

  static async apiFetchById (id) {
    return await this.api().get(`/dispenseMode/${id}`)
  }

  static localDbAdd (dispenseMode) {
    return nSQL(this.entity).query('upsert',
    dispenseMode
       ).exec().then(
        DispenseMode.insertOrUpdate({ data: dispenseMode })
       )
  }

  static async localDbGetById (id) {
    return nSQL(this.entity).query('select').where(['id', '=', id]).exec().then(result => {
       return result[0]
     })
 }

  static localDbGetAll () {
    return nSQL(this.entity).query('select').exec().then(result => {
      console.log(result)
      DispenseMode.insertOrUpdate({ data: result })
      })
  }
}
