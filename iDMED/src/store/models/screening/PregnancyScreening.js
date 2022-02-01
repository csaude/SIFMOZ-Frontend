import { Model } from '@vuex-orm/core'
import PatientVisit from '../patientVisit/PatientVisit'

export default class PregnancyScreening extends Model {
    static entity = 'pregnancyScreenings'

    static fields () {
        return {
            id: this.attr(null),
            pregnant: this.attr(''),
            menstruationLastTwoMonths: this.attr(''),
            lastMenstruation: this.attr(''),
            patient_visit_id: this.attr(''),
            // Relationships
            visit: this.belongsTo(PatientVisit, 'patient_visit_id')
        }
    }

    static async apiGetAll () {
      return await this.api().get('/pregnancyScreening')
    }

    static async apiGetAllByPatientVisitId (patientVisitId, offset, max) {
        return await this.api().get('/pregnancyScreening/patientVisit/' + patientVisitId + '?offset=' + offset + '&max=' + max)
    }
}
