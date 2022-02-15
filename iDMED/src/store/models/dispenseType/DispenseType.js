import { Model } from '@vuex-orm/core'

export default class DispenseType extends Model {
  static entity = 'dispenseTypes'

  static fields () {
    return {
      id: this.attr(null),
      code: this.attr(''),
      description: this.attr('')

    }
  }

  isDS () {
    return this.code === 'DS'
  }

  isDM () {
    return this.code === 'DM'
  }

  isDT () {
    return this.code === 'DT'
  }

  isDA () {
    return this.code === 'DA'
  }

  getRelatedWeeks () {
    if (this.isDM()) {
      return 4
    } else if (this.isDT()) {
      return 12
    } else if (this.isDS()) {
      return 24
    } else if (this.isDA()) {
      return 52
    }
  }

  static async apiGetAll (offset, max) {
    return await this.api().get('/dispenseType?offset=' + offset + '&max=' + max)
  }

  static async apiFetchById (id) {
    return await this.api().get(`/dispenseType/${id}`)
  }
}
