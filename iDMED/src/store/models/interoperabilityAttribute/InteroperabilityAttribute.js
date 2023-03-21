import { Model } from '@vuex-orm/core'
import HealthInformationSystem from '../healthInformationSystem/HealthInformationSystem'
import InteroperabilityType from '../interoperabilityType/InteroperabilityType'
import db from 'src/store/localbase'
import { v4 as uuidv4 } from 'uuid'
import { nSQL } from 'nano-sql'

export default class InteroperabilityAttribute extends Model {
  static entity = 'interoperabilityAttributes'

  static fields () {
    return {
      id: this.uid(() => uuidv4()),
      value: this.attr(''),
      interoperabilityType_id: this.attr(''),
      healthInformationSystem_id: this.attr(''),

      // Relationships
      healthInformationSystem: this.belongsTo(HealthInformationSystem, 'healthInformationSystem_id'),
      interoperabilityType: this.belongsTo(InteroperabilityType, 'interoperabilityType_id')
    }
  }

  static async apiGetAll (offset, max) {
    return await this.api().get('/interoperabilityAttribute?offset=' + offset + '&max=' + max)
  }

  static localDbAdd (interoperabilityAttribute) {
    return nSQL(this.entity).query('upsert',
    interoperabilityAttribute
     ).exec().then(
      InteroperabilityAttribute.insertOrUpdate({ data: interoperabilityAttribute })
     )
  }

  static localDbGetById (id) {
    return db.newDb().collection('interoperabilityAttributes').doc({ id: id }).get()
  }

  static localDbGetAll () {
    return nSQL(this.entity).query('select').exec().then(result => {
      console.log(result)
      InteroperabilityAttribute.insertOrUpdate({ data: result })
      })
  }

  static localDbUpdate (interoperabilityAttribute) {
    return db.newDb().collection('interoperabilityAttributes').doc({ id: interoperabilityAttribute.id }).set(interoperabilityAttribute)
  }

  static localDbUpdateAll (interoperabilityAttributes) {
    return db.newDb().collection('interoperabilityAttributes').set(interoperabilityAttributes)
  }

  static localDbDelete (interoperabilityAttribute) {
    return db.newDb().collection('interoperabilityAttributes').doc({ id: interoperabilityAttribute.id }).delete()
  }

  static localDbDeleteAll () {
    return db.newDb().collection('interoperabilityAttributes').delete()
  }
}
