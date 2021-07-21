import { Model } from '@vuex-orm/core'

export default class AdherenceScreening extends Model {
    static entity = 'adherenceScreenings'

    static fields () {
        return {
            id: this.attr(null),
            hasPatientCameCorrectDate: this.attr(''),
            daysWithoutMedicine: this.attr(''),
            patientForgotMedicine: this.attr(''),
            lateDays: this.attr(''),
            lateMotives: this.attr('')
        }
    }
}
