import { StockAdjustment } from './StockAdjustmentHierarchy'
import DestroyedStock from '../stockdestruction/DestroyedStock'

export class StockDestructionAdjustment extends StockAdjustment {
    static entity = 'stockDestructionAdjustments'
    static baseEntity = 'stockAdjustments'

    static fields () {
        return {
            ...super.fields(),
            id: this.attr(null),
            destruction_id: this.attr(null),
            // relationships
            destruction: this.belongsTo(DestroyedStock, 'destruction_id')
        }
    }
}
