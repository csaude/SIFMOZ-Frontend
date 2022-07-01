import { Model } from '@vuex-orm/core'
import Episode from '../episode/Episode'
export default class StartStopReason extends Model {
  static entity = 'startStopReasons'

  static fields () {
    return {
      id: this.attr(null),
      isStartReason: this.boolean(false),
      reason: this.attr(''),
      episode: this.hasMany(Episode, 'startStopReason_id'),
      code: this.attr('')
    }
  }

  static async apiGetAll (offset, max) {
    return await this.api().get('/startStopReason?offset=' + offset + '&max=' + max)
  }

  static isTranferReason () {
    return this.code === 'TRANSFERIDO_PARA'
  }

  static async apiFetchById (id) {
    return await this.api().get(`/startStopReason/${id}`)
  }
}
