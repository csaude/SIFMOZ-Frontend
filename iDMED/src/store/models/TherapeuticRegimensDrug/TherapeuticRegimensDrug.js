import { Model } from '@vuex-orm/core'

export default class TherapeuticRegimensDrug extends Model {
    static entity = 'therapeuticRegimensDrug'
     static primaryKey = ['therapeutic_regimen_id', 'drug_id']

    static fields () {
      return {
        drug_id: this.attr(null),
        therapeutic_regimen_id: this.attr(null)
      }
    }
  }
