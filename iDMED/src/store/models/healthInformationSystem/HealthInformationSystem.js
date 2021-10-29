
import { Model } from '@vuex-orm/core'
import InteroperabilityAttribute from '../interoperabilityAttribute/InteroperabilityAttribute'

export default class HealthInformationSystem extends Model {
  static entity = 'healthInformationSystems'

  static fields () {
    return {
      id: this.attr(null),
      abbreviation: this.attr(''),
      description: this.attr(''),
      active: this.attr(''),

      // Relationships
      interoperabilityAttributes: this.hasMany(InteroperabilityAttribute, 'healthInformationSystem_id')
    }
  }
}
