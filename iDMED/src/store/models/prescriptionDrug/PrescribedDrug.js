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

    static async apiGetAllByPrescriptionId (prescriptionId) {
      return await this.api().get('/prescribedDrug/prescription/' + prescriptionId)
    }

    static async apiGetAll () {
      return await this.api().get('/prescribedDrug')
    }

    getQtyPrescribed (drugsDuration) {
      if (drugsDuration === null || drugsDuration === '') return 0
      let qty = 0
      if (this.form.toLowerCase() === 'dia') {
        qty = Math.round(Number((this.amtPerTime * this.timesPerDay * (drugsDuration.weeks * 7)) / this.drug.packSize))
      }

      this.qtyPrescribed = qty
      return qty
    }
}
