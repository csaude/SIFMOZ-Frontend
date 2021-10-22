import { Model } from '@vuex-orm/core'
import Drug from '../drug/Drug'
import TherapeuticRegimen from '../therapeuticRegimen/TherapeuticRegimen'

export default class RegimenDrug extends Model {
  static entity = 'regimenDrugs'

  static fields () {
    return {
      id: this.attr(null),
      // amPerTime: this.attr(''),
      // timesPerDay: this.attr(''),
     // modified: this.attr(''),
   //   notes: this.attr(''),
      drug_id: this.attr(''),
      therapeutic_regimen_id: this.attr(''),

      // Relationships
      drug: this.belongsTo(Drug, 'drug_id'),
      therapeutic_regimen: this.belongsTo(TherapeuticRegimen, 'therapeutic_regimen_id')

    }
  }
}
