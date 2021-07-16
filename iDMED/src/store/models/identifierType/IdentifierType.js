import { Model } from '@vuex-orm/core'

export default class IdentifierType extends Model {
  static entity = 'identifierTypes'

  static fields () {
    return {
      id: this.attr(null),
      code: this.attr(''),
      description: this.attr('')

    }
  }
}
