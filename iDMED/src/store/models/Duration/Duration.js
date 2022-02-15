import { Model } from '@vuex-orm/core'
import Prescription from '../prescription/Prescription'

export default class Duration extends Model {
  static entity = 'durations'

  static fields () {
    return {
      id: this.attr(null),
      weeks: this.attr(''),
      description: this.attr(''),
      prescriptions: this.hasMany(Prescription, 'duration_id')
    }
  }

  static async apiGetAll (offset, max) {
    return await this.api().get('/duration?offset=' + offset + '&max=' + max)
  }

  static async apiFetchById (id) {
    return await this.api().get(`/duration/${id}`)
  }
}
