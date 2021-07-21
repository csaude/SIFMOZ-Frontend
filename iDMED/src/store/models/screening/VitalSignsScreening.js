import { Model } from '@vuex-orm/core'

export default class VitalSignsScreening extends Model {
    static entity = 'vitalSignsScreenings'

    static fields () {
        return {
            id: this.attr(null),
            distort: this.attr(''),
            imc: this.attr(''),
            weight: this.attr(''),
            systole: this.attr(''),
            height: this.attr('')
        }
    }
}
