import { Model } from '@vuex-orm/core'

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
            referedToUSTB: this.attr(''),
            startTreatmentDate: this.attr(''),
            fatigueOrTirednessLastTwoWeeks: this.attr(''),
            sweating: this.attr('')
        }
    }
}
