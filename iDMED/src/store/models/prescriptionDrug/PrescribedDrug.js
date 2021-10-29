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
        modified: this.boolean(false),
        qtyPrescribed: this.number(1),
        nextPickUpDate: this.attr(''),
        toContinue: this.boolean(true),
        prescription_id: this.attr(''),
        drug_id: this.attr(''),
        form: this.attr(''),
        // Relationships
        prescription: this.belongsTo(Prescription, 'prescription_id'),
        drug: this.belongsTo(Drug, 'drug_id')
      }
    }

    get takeInstructions () {
      return `${this.amtPerTime} ${this.form} ${this.timesPerDay}`
    }
}
