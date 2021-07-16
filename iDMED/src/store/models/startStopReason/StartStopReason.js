import { Model } from '@vuex-orm/core'

export default class StartStopReason extends Model {
  static entity = 'startStopReasons'

  static fields () {
    return {
      id: this.attr(null),
      isStartReason: this.attr(''),
      reason: this.attr('')
    }
  }
}
