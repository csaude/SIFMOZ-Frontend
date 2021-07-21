import StockAdjustment from './StockAdjustment'
import DestroyedStock from '../stockdestruction/DestroyedStock'

export default class StockDestructionAdjustment extends StockAdjustment {
    static entity = 'stockDestructionAdjustments'

    static fields () {
        return {
            ...super.fields(),
            id: this.attr(null),
            destruction_id: this.attr(null),
            // relationships
            adjustedStock: this.belongsTo(DestroyedStock, 'destruction_id')
        }
    }
}
