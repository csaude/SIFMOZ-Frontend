import { Model } from '@vuex-orm/core'
import ClinicalService from '../ClinicalService/ClinicalService'
import ClinicalServiceAttributeType from '../ClinicalServiceAttributeType/ClinicalServiceAttributeType'

export default class ClinicalServiceAttribute extends Model {
  static entity = 'clinicalServiceAttributes'

  static fields () {
    return {
      id: this.attr(null),
      service_id: this.attr(null),
      service_attr_type_id: this.attr(null),
      // Relationships
      clinicalService: this.belongsTo(ClinicalService, 'service_id'),
      clinicalServiceAttributeType: this.belongsTo(ClinicalServiceAttributeType, 'service_attr_type_id')
    }
  }

  static async apiGetAll (offset, max) {
    return await this.api().get('/clinicalServiceAttribute?offset=' + offset + '&max=' + max)
  }

  static async apiFetchById (id) {
    return await this.api().get(`/clinicalServiceAttribute/${id}`)
  }
}
