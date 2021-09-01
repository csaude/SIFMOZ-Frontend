import { Model } from '@vuex-orm/core'
import { StockDestructionAdjustment } from '../stockadjustment/StockAdjustmentHierarchy'

export default class DestroyedStock extends Model {
    static entity = 'destroyedStocks'

    static fields () {
        return {
            id: this.attr(null),
            notes: this.attr(''),
            updateStatus: this.attr(''),
            // relationships
            adjustments: this.hasMany(StockDestructionAdjustment, 'destruction_id')
        }
    }
}
