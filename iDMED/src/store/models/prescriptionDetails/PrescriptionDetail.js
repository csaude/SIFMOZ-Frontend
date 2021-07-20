import { Model } from '@vuex-orm/core'
import Prescription from '../prescription/Prescription'
import TherapeuticRegimen from '../therapeuticRegimen/TherapeuticRegimen'
import DispenseType from '../dispenseType/DispenseType'
import TherapeuticLine from '../therapeuticLine/TherapeuticLine'

export default class PrescriptionDetail extends Model {
    static entity = 'prescriptionsDetails'
    static fields () {
      return {
        id: this.attr(null),
        reasonForUpdate: this.attr(''),
        prescription_id: this.attr(''),
        therapeutic_line_id: this.attr(''),
        therapeutic_regimen_id: this.attr(''),
        dispense_type_id: this.attr(''),
        // Relationships
        prescription: this.belongsTo(Prescription, 'prescription_id'),
        therapeutic_line: this.belongsTo(TherapeuticLine, 'therapeutic_line_id'),
        therapeutic_regimen: this.belongsTo(TherapeuticRegimen, 'therapeutic_regimen_id'),
        dispense_type: this.belongsTo(DispenseType, 'dispense_type_id')
      }
    }
}
