import { Model } from '@vuex-orm/core'
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

      // Relationships
      prescriptionDetails: this.hasMany(TherapeuticRegimen, 'therapeutic_regimen_id'),
      regimenDrugs: this.hasMany(RegimenDrug, 'therapeutic_regimen_id')
    }
  }
}
