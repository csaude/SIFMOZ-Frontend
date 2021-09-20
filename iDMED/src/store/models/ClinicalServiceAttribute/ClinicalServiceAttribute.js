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
      clinicalService: this.hasOne(ClinicalService, 'service_id'),
      clinicalServiceAttributeType: this.hasOne(ClinicalServiceAttributeType, 'service_attr_type_id')
    }
  }
}
