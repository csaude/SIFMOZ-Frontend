import { Model } from '@vuex-orm/core'

export default class InteroperabilityType extends Model {
  static entity = 'interoperabilityTypes'

  static fields () {
    return {
      id: this.attr(null),
      code: this.attr(''),
      description: this.attr('')

    }
}

static async apiGetAll () {
  return await this.api().get('/interoperabilityType')
}

static async apiFetchById (id) {
  return await this.api().get(`/interoperabilityType/${id}`)
}
}
