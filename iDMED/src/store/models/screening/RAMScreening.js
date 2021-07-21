import { Model } from '@vuex-orm/core'

export default class RAMScreening extends Model {
    static entity = 'RAMScreenings'

    static fields () {
        return {
            id: this.attr(null),
            adverseReaction: this.attr(''),
            adverseReactionMedicine: this.attr(''),
            referedToUSRam: this.attr('')
        }
    }
}
