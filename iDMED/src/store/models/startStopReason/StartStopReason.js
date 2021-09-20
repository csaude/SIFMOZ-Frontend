import { Model } from '@vuex-orm/core'
import Episode from '../episode/Episode'
export default class StartStopReason extends Model {
  static entity = 'startStopReasons'

  static fields () {
    return {
      id: this.attr(null),
      isStartReason: this.attr(''),
      reason: this.attr(''),
      episode_id: this.attr(''),
      episode: this.belongsTo(Episode, 'episode_id')
    }
  }
}
