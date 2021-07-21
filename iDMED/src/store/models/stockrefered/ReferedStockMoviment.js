import { Model } from '@vuex-orm/core'
import StockReferenceAdjustment from '../stockadjustment/StockReferenceAdjustment'

export default class ReferedStockMoviment extends Model {
    static entity = 'referedStockMoviments'

    static fields () {
        return {
            id: this.attr(null),
            date: this.attr(null),
            orderNumber: this.attr(''),
            origin: this.attr(''),
            quantity: this.attr(null),
            updateStatus: this.attr(''),
            // relationships
            adjustments: this.hasMany(StockReferenceAdjustment, 'reference_id')
        }
    }
}
