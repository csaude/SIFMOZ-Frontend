import { Model } from '@vuex-orm/core'

export default class ProgramAttributeType extends Model {
  static entity = 'programAttributeTypes'

  static fields () {
    return {
      id: this.attr(null),
      code: this.attr(''),
      description: this.attr('')

    }
  }
}
