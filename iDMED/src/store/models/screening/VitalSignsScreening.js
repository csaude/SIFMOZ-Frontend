import { Model } from '@vuex-orm/core'
import PatientVisit from '../patientVisit/PatientVisit'

export default class VitalSignsScreening extends Model {
    static entity = 'vitalSignsScreenings'

    static fields () {
        return {
            id: this.attr(null),
            distort: this.attr(''),
            imc: this.attr(''),
            weight: this.attr(''),
            systole: this.attr(''),
            height: this.attr(''),
            patient_visit_id: this.attr(''),
            // Relationships
            visit: this.belongsTo(PatientVisit, 'patient_visit_id')
        }
    }

    static async apiGetAll () {
      return await this.api().get('/vitalSignsScreening')
    }
}
