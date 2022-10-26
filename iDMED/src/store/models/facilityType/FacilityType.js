import { Model } from '@vuex-orm/core'
import db from 'src/store/localbase'

export default class FacilityType extends Model {
  static entity = 'facilityTypes'

  static fields () {
    return {
      id: this.attr(null),
      code: this.attr(''),
      description: this.attr('')

    }
  }

  static async apiGetAll (offset, max) {
    return await this.api().get('/facilityType?offset=' + offset + '&max=' + max)
  }

  static async apiFetchById (id) {
    return await this.api().get(`/facilityType/${id}`)
  }

  static localDbAdd (facilityType) {
    return db.newDb().collection('facilityTypes').add(facilityType)
  }

  static localDbGetById (id) {
    return db.newDb().collection('facilityTypes').doc({ id: id }).get()
  }

  static localDbGetAll () {
    return db.newDb().collection('facilityTypes').get()
  }

  static localDbUpdate (facilityType) {
    return db.newDb().collection('facilityTypes').doc({ id: facilityType.id }).set(facilityType)
  }

  static localDbUpdateAll (facilityTypes) {
    return db.newDb().collection('facilityTypes').set(facilityTypes)
  }

  static localDbDelete (facilityType) {
    return db.newDb().collection('facilityTypes').doc({ id: facilityType.id }).delete()
  }

  static localDbDeleteAll () {
    return db.newDb().collection('facilityTypes').delete()
  }
}
