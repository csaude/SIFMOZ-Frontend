import { Model } from '@vuex-orm/core'

export default class DispenseMode extends Model {
  static entity = 'dispenseModes'

  static fields () {
    return {
      id: this.attr(null),
      code: this.attr(''),
      description: this.attr(''),
      openmrsUuid: this.attr('')
    }
  }

  static async apiGetAll () {
    return await this.api().get('/dispenseMode')
  }

  static async apiFetchById (id) {
    return await this.api().get(`/dispenseMode/${id}`)
  }
}
