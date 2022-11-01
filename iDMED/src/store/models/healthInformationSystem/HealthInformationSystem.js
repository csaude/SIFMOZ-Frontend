
import { Model } from '@vuex-orm/core'
import InteroperabilityAttribute from '../interoperabilityAttribute/InteroperabilityAttribute'
import db from 'src/store/localbase'

export default class HealthInformationSystem extends Model {
  static entity = 'healthInformationSystems'

  static fields () {
    return {
      id: this.attr(null),
      abbreviation: this.attr(''),
      syncStatus: this.attr(''),
      description: this.attr(''),
      active: this.attr(''),

      // Relationships
      interoperabilityAttributes: this.hasMany(InteroperabilityAttribute, 'healthInformationSystem_id')
    }
  }

  static async apiFetchById (id) {
    return await this.api().get(`/healthInformationSystem/${id}`)
  }

  static async apiGetAll (offset, max) {
    return await this.api().get('/healthInformationSystem?offset=' + offset + '&max=' + max)
  }

  static async apiSave (his) {
    return await this.api().post('/healthInformationSystem', his)
  }

  static localDbAdd (healthInformationSystem) {
    return db.newDb().collection('healthInformationSystems').add(healthInformationSystem)
  }

  static localDbGetById (id) {
    return db.newDb().collection('healthInformationSystems').doc({ id: id }).get()
  }

  static localDbGetAll () {
    return db.newDb().collection('healthInformationSystems').get()
  }

  static localDbUpdate (healthInformationSystem) {
    return db.newDb().collection('healthInformationSystems').doc({ id: healthInformationSystem.id }).set(healthInformationSystem)
  }

  static localDbUpdateAll (healthInformationSystems) {
    return db.newDb().collection('healthInformationSystems').set(healthInformationSystems)
  }

  static localDbDelete (healthInformationSystem) {
    return db.newDb().collection('healthInformationSystems').doc({ id: healthInformationSystem.id }).delete()
  }

  static localDbDeleteAll () {
    return db.newDb().collection('healthInformationSystems').delete()
  }
}
