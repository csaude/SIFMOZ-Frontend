import { Model } from '@vuex-orm/core'
import Drug from '../drug/Drug'
import Prescription from '../prescription/Prescription'

export default class PrescribedDrug extends Model {
    static entity = 'prescribedDrugs'
    static fields () {
      return {
        id: this.attr(null),
        amtPerTime: this.attr(''),
        timesPerDay: this.attr(''),
        modified: this.attr(''),
        prescription_id: this.attr(''),
        drug_id: this.attr(''),
        // Relationships
        prescription: this.belongsTo(Prescription, 'prescription_id'),
        drug: this.belongsTo(Drug, 'drug_id')
      }
    }
}
