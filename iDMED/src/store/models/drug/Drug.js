import { Model } from '@vuex-orm/core'
import Form from '../form/Form'
import PackagedDrug from '../packagedDrug/PackagedDrug'
import RegimenDrug from '../regimenDrug/RegimenDrug'
import Stock from '../stock/Stock'

export default class Drug extends Model {
  static entity = 'drugs'

  static fields () {
    return {
      id: this.attr(null),
      name: this.attr(''),
      sideTreatment: this.attr(''),
      packSize: this.attr(''),
      clinicalStage: this.attr(''),
      defaultTimes: this.attr(''),
      defaultTreatment: this.attr(''),
      form_id: this.attr(''),
      // Relationships
      form: this.belongsTo(Form, 'form_id'),
      regimen_drugs: this.hasMany(RegimenDrug, 'drug_id'),
      packaged_drugs: this.hasMany(PackagedDrug, 'drug_id'),
      stocks: this.hasMany(Stock, 'drug_id')
    }
  }
}
