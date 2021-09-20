import { Model } from '@vuex-orm/core'
import ClinicalServiceAttribute from '../ClinicalServiceAttribute/ClinicalServiceAttribute'
import TherapeuticRegimen from '../therapeuticRegimen/TherapeuticRegimen'

export default class ClinicalService extends Model {
  static entity = 'clinicalServices'

  static fields () {
    return {
      id: this.attr(null),
      code: this.attr(''),
      description: this.attr(''),
      attributes: this.hasMany(ClinicalServiceAttribute, 'service_id'),
      therapeuticRegimen: this.hasMany(TherapeuticRegimen, 'clinical_service_id')
    }
  }
}
