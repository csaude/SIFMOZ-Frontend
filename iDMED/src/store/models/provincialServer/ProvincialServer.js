import { Model } from '@vuex-orm/core'

export default class ProvincialServer extends Model {
  static entity = 'provincialServers'

  static fields () {
    return {
      id: this.attr(null),
      urlPath: this.attr(''),
      code: this.attr(''),
      destination: this.attr(''),
      port: this.attr(''),
      username: this.attr(''),
      password: this.attr('')
    }
  }

  static async apiFetchById (id) {
    return await this.api().get(`/provincialServer/${id}`)
  }

  static async apiGetAll () {
    return await this.api().get('/provincialServer')
  }
}
