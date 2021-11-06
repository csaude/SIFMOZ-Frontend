import { Model } from '@vuex-orm/core'
import PatientVisit from '../patientVisit/PatientVisit'

export default class RAMScreening extends Model {
    static entity = 'RAMScreenings'

    static fields () {
        return {
            id: this.attr(null),
            adverseReaction: this.attr(''),
            adverseReactionMedicine: this.attr(''),
          //  referedToUSRam: this.attr(''),
            patient_visit_id: this.attr(''),
            // Relationships
            patient_visit: this.belongsTo(PatientVisit, 'patient_visit_id')
        }
    }
}
