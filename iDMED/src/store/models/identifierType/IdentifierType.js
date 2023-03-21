import { Model } from '@vuex-orm/core'
import db from 'src/store/localbase'
import { v4 as uuidv4 } from 'uuid'
import { nSQL } from 'nano-sql'

export default class IdentifierType extends Model {
  static entity = 'identifierTypes'

  static fields () {
    return {
      id: this.uid(() => uuidv4()),
      syncStatus: this.attr(''),
      code: this.attr(''),
      description: this.attr(''),
      pattern: this.attr('')
    }
  }

  static async apiGetAll (offset, max) {
    return await this.api().get('/identifierType?offset=' + offset + '&max=' + max)
  }

  static async apiFetchById (id) {
    return await this.api().get(`/identifierType/${id}`)
  }

  static async apiSave (identifierType) {
    return await this.api().post('/identifierType', identifierType)
  }

  static async apiUpdate (identifierType) {
    return await this.api().patch('/identifierType/' + identifierType.id, identifierType)
  }

  static async localDbAdd (identifierType) {
    return nSQL(this.entity).query('upsert',
    identifierType
     ).exec().then(
      IdentifierType.insertOrUpdate({ data: identifierType })
     )
  }

  static localDbGetById (id) {
    return db.newDb().collection('identifierTypes').doc({ id: id }).get()
  }

  static async localDbGetAll () {
   return nSQL(this.entity).query('select').exec().then(result => {
      console.log(result)
      IdentifierType.insertOrUpdate({ data: result })
      })
  }

  static localDbUpdate (identifierType) {
    return db.newDb().collection('identifierTypes').doc({ id: identifierType.id }).set(identifierType)
  }

  static localDbUpdateAll (identifierTypes) {
    return db.newDb().collection('identifierTypes').set(identifierTypes)
  }

  static localDbDelete (identifierType) {
    return db.newDb().collection('identifierTypes').doc({ id: identifierType.id }).delete()
  }

  static localDbDeleteAll () {
    return db.newDb().collection('identifierTypes').delete()
  }
}
