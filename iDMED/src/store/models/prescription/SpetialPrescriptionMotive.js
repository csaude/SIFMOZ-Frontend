import { Model } from '@vuex-orm/core'

export default class SpetialPrescriptionMotive extends Model {
  static entity = 'spetialPrescriptionMotives'

  static fields () {
    return {
      id: this.attr(null),
      code: this.attr(''),
      description: this.attr('')

    }
  }

  static async apiGetAll (offset, max) {
    return await this.api().get('/spetialPrescriptionMotive?offset=' + offset + '&max=' + max)
  }

  static async apiFetchById (id) {
    return await this.api().get(`/spetialPrescriptionMotive/${id}`)
  }
}
