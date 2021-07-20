import { Model } from '@vuex-orm/core'

export default class DispenseType extends Model {
  static entity = 'dispenseTypes'

  static fields () {
    return {
      id: this.attr(null),
      code: this.attr(''),
      description: this.attr('')

    }
  }
}
