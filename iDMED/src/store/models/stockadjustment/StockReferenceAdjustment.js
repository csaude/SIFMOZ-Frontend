import { StockAdjustment } from './StockAdjustmentHierarchy'
import ReferedStockMoviment from '../stockrefered/ReferedStockMoviment'

export class StockReferenceAdjustment extends StockAdjustment {
    static entity = 'stockReferenceAdjustments'
    static baseEntity = 'stockAdjustments'

    static fields () {
        return {
            ...super.fields(),
            id: this.attr(null),
            reference_id: this.attr(null),
            // relationships
            reference: this.belongsTo(ReferedStockMoviment, 'reference_id')
        }
    }
}
