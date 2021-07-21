import StockAdjustment from './StockAdjustment'
import ReferedStockMoviment from '../stockrefered/ReferedStockMoviment'

export default class StockReferenceAdjustment extends StockAdjustment {
    static entity = 'stockReferenceAdjustments'

    static fields () {
        return {
            ...super.fields(),
            id: this.attr(null),
            reference_id: this.attr(null),
            // relationships
            adjustedStock: this.belongsTo(ReferedStockMoviment, 'reference_id')
        }
    }
}
