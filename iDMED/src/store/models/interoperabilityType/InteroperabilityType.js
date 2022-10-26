import { Model } from '@vuex-orm/core'
import db from 'src/store/localbase'

export default class InteroperabilityType extends Model {
  static entity = 'interoperabilityTypes'

  static fields () {
    return {
      id: this.attr(null),
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
  return db.newDb().collection('interoperabilityTypes').add(interoperabilityType)
}

static localDbGetById (id) {
  return db.newDb().collection('interoperabilityTypes').doc({ id: id }).get()
}

static localDbGetAll () {
  return db.newDb().collection('interoperabilityTypes').get()
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
