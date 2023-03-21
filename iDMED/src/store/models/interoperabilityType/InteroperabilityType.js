import { Model } from '@vuex-orm/core'
import db from 'src/store/localbase'
import { v4 as uuidv4 } from 'uuid'
import { nSQL } from 'nano-sql'

export default class InteroperabilityType extends Model {
  static entity = 'interoperabilityTypes'

  static fields () {
    return {
      id: this.uid(() => uuidv4()),
      code: this.attr(''),
      description: this.attr('')

    }
}

static async apiGetAll (offset, max) {
  return await this.api().get('/interoperabilityType?offset=' + offset + '&max=' + max)
}

static async apiFetchById (id) {
  return await this.api().get(`/interoperabilityType/${id}`)
}

static localDbAdd (interoperabilityType) {
  return nSQL(this.entity).query('upsert',
  interoperabilityType
   ).exec().then(
    InteroperabilityType.insertOrUpdate({ data: interoperabilityType })
   )
}

static localDbGetById (id) {
  return db.newDb().collection('interoperabilityTypes').doc({ id: id }).get()
}

static localDbGetAll () {
  return nSQL(this.entity).query('select').exec().then(result => {
    console.log(result)
    InteroperabilityType.insertOrUpdate({ data: result })
    })
}

static localDbUpdate (interoperabilityType) {
  return db.newDb().collection('interoperabilityTypes').doc({ id: interoperabilityType.id }).set(interoperabilityType)
}

static localDbUpdateAll (interoperabilityTypes) {
  return db.newDb().collection('interoperabilityTypes').set(interoperabilityTypes)
}

static localDbDelete (interoperabilityType) {
  return db.newDb().collection('interoperabilityTypes').doc({ id: interoperabilityType.id }).delete()
}

static localDbDeleteAll () {
  return db.newDb().collection('interoperabilityTypes').delete()
}
}
