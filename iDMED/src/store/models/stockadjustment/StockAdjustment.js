import { Model } from '@vuex-orm/core'
import Stock from '../stock/Stock'
import StockOperationType from '../stockoperation/StockOperationType'

export default class StockAdjustment extends Model {
    static entity = 'stockAdjustments'

    static fields () {
        return {
            id: this.attr(null),
            notes: this.attr(''),
            stockTake: this.attr(null),
            adjustedValue: this.attr(null),
            finalised: this.attr(''),
            adjusted_stock_id: this.attr(null),
            operation_id: this.attr(null),
            // relationships
            adjustedStock: this.belongsTo(Stock, 'adjusted_stock_id'),
            operations: this.belongsTo(StockOperationType, 'operation_id')
        }
    }
}
