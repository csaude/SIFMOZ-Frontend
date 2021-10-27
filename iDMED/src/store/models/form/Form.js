import { Model } from '@vuex-orm/core'
import Drug from '../drug/Drug'

export default class Form extends Model {
  static entity = 'forms'

  static fields () {
    return {
      id: this.attr(null),
      code: this.attr(''),
      description: this.attr(''),

      // Relationships
      drugs: this.hasMany(Drug, 'form_id')
    }
  }

  static async apiGetAll () {
    return await this.api().get('/form')
  }

  static async apiFetchById (id) {
    return await this.api().get(`/form/${id}`)
  }
}
