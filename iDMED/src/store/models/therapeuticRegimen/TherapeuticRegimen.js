import { Model } from '@vuex-orm/core'
import ClinicalService from '../ClinicalService/ClinicalService'
import PrescriptionDetail from '../prescriptionDetails/PrescriptionDetail'
import RegimenDrug from '../regimenDrug/RegimenDrug'

export default class TherapeuticRegimen extends Model {
  static entity = 'therapeuticRegimens'

  static fields () {
    return {
      id: this.attr(null),
      regimenScheme: this.attr(''),
      active: this.attr(''),
      code: this.attr(''),
      pedhiatric: this.attr(''),
      description: this.attr(''),
      clinical_service_id: this.attr(''),

      // Relationships
      prescriptionDetails: this.hasMany(PrescriptionDetail, 'therapeutic_regimen_id'),
      regimenDrugs: this.hasMany(RegimenDrug, 'therapeutic_regimen_id'),
      clinicalService: this.belongsTo(ClinicalService, 'clinical_service_id')
    }
  }
}
