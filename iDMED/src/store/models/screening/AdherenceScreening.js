import { Model } from '@vuex-orm/core'
import PatientVisit from '../patientVisit/PatientVisit'

export default class AdherenceScreening extends Model {
    static entity = 'adherenceScreenings'

    static fields () {
        return {
            id: this.attr(null),
            hasPatientCameCorrectDate: this.attr(''),
            daysWithoutMedicine: this.attr(''),
            patientForgotMedicine: this.attr(''),
            lateDays: this.attr(''),
            lateMotives: this.attr(''),
            patient_visit_id: this.attr(''),
            // Relationships
            visit: this.belongsTo(PatientVisit, 'patient_visit_id')
        }
    }

    static async apiGetAll (offset, max) {
      return await this.api().get('/adherenceScreening?offset=' + offset + '&max=' + max)
    }
}
