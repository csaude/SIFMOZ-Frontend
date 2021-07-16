import { Model } from '@vuex-orm/core'

export default class GroupType extends Model {
  static entity = 'groupTypes'

  static fields () {
    return {
      id: this.attr(null),
      code: this.attr(''),
      description: this.attr('')

    }
  }
}
