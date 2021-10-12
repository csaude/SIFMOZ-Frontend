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
      therapeuticRegimens: this.hasMany(TherapeuticRegimen, 'clinical_service_id')
    }
  }

  static async apiGetAll () {
    return await this.api().get('/clinicalService')
  }

  static async apiFetchById (id) {
    return await this.api().get(`/clinicalService/${id}`)
  }
}
