import { Model } from '@vuex-orm/core'
import ClinicalServiceAttribute from '../ClinicalServiceAttribute/ClinicalServiceAttribute'

export default class ClinicalServiceAttributeType extends Model {
  static entity = 'clinicalServiceAttributeTypes'

  static fields () {
    return {
      id: this.attr(null),
      code: this.attr(''),
      description: this.attr(''),

      clinicalServiceAttributes: this.hasMany(ClinicalServiceAttribute, 'service_attr_type_id')
    }
  }

  static async apiGetAll () {
    return await this.api().get('/clinicalServiceAttributeType')
  }

  static async apiFetchById (id) {
    return await this.api().get(`/clinicalServiceAttributeType/${id}`)
  }
}
