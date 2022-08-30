import { Model } from '@vuex-orm/core'

export default class SystemConfigs extends Model {
  static entity = 'systemConfigs'

  static fields () {
    return {
      id: this.attr(null),
      key: this.attr(''),
      value: this.attr(''),
      description: this.attr('')
    }
  }

  static async apiFetchById (id) {
    return await this.api().get(`/systemConfigs/${id}`)
  }

  static async apiGetAll () {
    return await this.api().get('/systemConfigs')
  }

  static async apiSave (systemConfigs) {
    return await this.api().post('/systemConfigs', systemConfigs)
  }
}
