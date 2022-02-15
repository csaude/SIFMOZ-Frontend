import { Model } from '@vuex-orm/core'
import PatientVisit from '../patientVisit/PatientVisit'

export default class TBScreening extends Model {
    static entity = 'TBScreenings'

    static fields () {
        return {
            id: this.attr(null),
            parentTBTreatment: this.attr(''),
            cough: this.attr(''),
            fever: this.attr(''),
            losingWeight: this.attr(''),
            treatmentTB: this.attr(''),
            treatmentTPI: this.attr(''),
           // referedToUSTB: this.attr(''),
            startTreatmentDate: this.attr(''),
            fatigueOrTirednessLastTwoWeeks: this.attr(''),
            sweating: this.attr(''),
            patient_visit_id: this.attr(''),
            // Relationships
            visit: this.belongsTo(PatientVisit, 'patient_visit_id')
        }
    }

    static async apiGetAll (offset, max) {
      return await this.api().get('/TBScreening?offset=' + offset + '&max=' + max)
    }
}
