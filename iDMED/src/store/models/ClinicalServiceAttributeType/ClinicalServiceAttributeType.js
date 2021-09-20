import { Model } from '@vuex-orm/core'

export default class ClinicalServiceAttributeType extends Model {
  static entity = 'clinicalServiceAttributeTypes'

  static fields () {
    return {
      id: this.attr(null),
      code: this.attr(''),
      description: this.attr('')

    }
  }
}
