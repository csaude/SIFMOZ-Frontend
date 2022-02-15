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

  static async apiGetAll (offset, max) {
    return await this.api().get('/identifierType?offset=' + offset + '&max=' + max)
  }

  static async apiFetchById (id) {
    return await this.api().get(`/identifierType/${id}`)
  }
}
