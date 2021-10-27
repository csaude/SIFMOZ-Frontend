import { Model } from '@vuex-orm/core'

export default class Duration extends Model {
  static entity = 'durations'

  static fields () {
    return {
      id: this.attr(null),
      weeks: this.attr(''),
      description: this.attr('')

    }
  }

  static async apiGetAll () {
    return await this.api().get('/duration')
  }

  static async apiFetchById (id) {
    return await this.api().get(`/duration/${id}`)
  }
}
