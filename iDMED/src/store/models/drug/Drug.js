import { Model } from '@vuex-orm/core'

export default class Drug extends Model {
  static entity = 'drugs'

  static fields () {
    return {
      id: this.attr(null),
      name: this.attr(''),
      sideTreatment: this.attr(''),
      packSize: this.attr(''),
      clinicalStage: this.attr('')
      // Relationships

    }
  }
}
