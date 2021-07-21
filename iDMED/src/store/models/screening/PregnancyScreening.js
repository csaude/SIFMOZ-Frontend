import { Model } from '@vuex-orm/core'

export default class PregnancyScreening extends Model {
    static entity = 'pregnancyScreenings'

    static fields () {
        return {
            id: this.attr(null),
            pregnant: this.attr(''),
            menstruationLastTwoMonths: this.attr(''),
            childDeliveryPrevision: this.attr('')
        }
    }
}
