import { Model } from '@vuex-orm/core'
import Form from '../form/Form'
import PackagedDrug from '../packagedDrug/PackagedDrug'
import Stock from '../stock/Stock'
// import TherapeuticRegimen from '../therapeuticRegimen/TherapeuticRegimen'

export default class Drug extends Model {
  static entity = 'drugs'

  static fields () {
    return {
      id: this.attr(null),
      name: this.attr(''),
      fnmCode: this.attr(''),
      // sideTreatment: this.attr(''),
      packSize: this.attr(''),
      clinicalStage: this.attr(''),
      defaultTimes: this.attr(''),
      defaultTreatment: this.attr(''),
      defaultPeriodTreatment: this.attr(''),
      form_id: this.attr(''),
      // Relationships
      form: this.belongsTo(Form, 'form_id'),
     // therapeutic_regimens: this.hasMany(TherapeuticRegimen, 'drug_id'),
      packaged_drugs: this.hasMany(PackagedDrug, 'drug_id'),
      stocks: this.hasMany(Stock, 'drug_id')
    }
  }

  static async apiGetAll () {
    return await this.api().get('/drug')
  }

  static async apiFetchById (id) {
    return await this.api().get(`/drug/${id}`)
    return await this.api().get('/drugs')
  }
}
