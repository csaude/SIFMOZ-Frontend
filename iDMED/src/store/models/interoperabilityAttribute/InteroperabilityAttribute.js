import { Model } from '@vuex-orm/core'
import HealthInformationSystem from '../healthInformationSystem/HealthInformationSystem'
import InteroperabilityType from '../interoperabilityType/InteroperabilityType'

export default class InteroperabilityAttribute extends Model {
  static entity = 'interoperabilityAttributes'

  static fields () {
    return {
      id: this.attr(null),
      value: this.attr(''),
      interoperabilityType_id: this.attr(''),
      healthInformationSystem_id: this.attr(''),

      // Relationships
      healthInformationSystem: this.belongsTo(HealthInformationSystem, 'healthInformationSystem_id'),
      interoperabilityType: this.belongsTo(InteroperabilityType, 'interoperabilityType_id')
    }
  }
}
