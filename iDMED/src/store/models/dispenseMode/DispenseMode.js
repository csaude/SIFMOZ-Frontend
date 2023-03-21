import { Model } from '@vuex-orm/core'
import db from 'src/store/localbase'
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

  static localDbGetById (id) {
    return db.newDb().collection('dispenseModes').doc({ id: id }).get()
  }

  static localDbGetAll () {
    return nSQL(this.entity).query('select').exec().then(result => {
      console.log(result)
      DispenseMode.insertOrUpdate({ data: result })
      })
  }

  static localDbUpdate (dispenseMode) {
    return db.newDb().collection('dispenseModes').doc({ id: dispenseMode.id }).set(dispenseMode)
  }

  static localDbUpdateAll (dispenseModes) {
    return db.newDb().collection('dispenseModes').set(dispenseModes)
  }

  static localDbDelete (dispenseMode) {
    return db.newDb().collection('dispenseModes').doc({ id: dispenseMode.id }).delete()
  }

  static localDbDeleteAll () {
    return db.newDb().collection('dispenseModes').delete()
  }
}
