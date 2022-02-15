import { Model } from '@vuex-orm/core'

export default class EpisodeType extends Model {
  static entity = 'episodeTypes'

  static fields () {
    return {
      id: this.attr(null),
      code: this.attr(''),
      description: this.attr('')

    }
  }

  static async apiGetAll (offset, max) {
    return await this.api().get('/episodeType?offset=' + offset + '&max=' + max)
  }

  static async apiFetchById (id) {
    return await this.api().get(`/episodeType/${id}`)
  }
}
