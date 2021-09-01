import { Model } from '@vuex-orm/core'
import Stock from '../stock/Stock'
import StockOperationType from '../stockoperation/StockOperationType'
import { InventoryStockAdjustment, StockDestructionAdjustment, StockReferenceAdjustment } from './StockAdjustmentHierarchy'

export class StockAdjustment extends Model {
    static entity = 'stockAdjustments'

    static types () {
        return {
            INVENTORYSTOCKADJUSTMENT: InventoryStockAdjustment,
            STOCKDESTRUCTIONADJUSTMENT: StockDestructionAdjustment,
            STOCKREFERENCEADJUSTMENT: StockReferenceAdjustment
        }
    }

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
            operation: this.belongsTo(StockOperationType, 'operation_id')
        }
    }
}
