import { Model } from '@vuex-orm/core'

export default class Program extends Model {
  static entity = 'programs'

  static fields () {
    return {
      id: this.attr(null),
      code: this.attr(''),
      description: this.attr('')
    }
  }
}
