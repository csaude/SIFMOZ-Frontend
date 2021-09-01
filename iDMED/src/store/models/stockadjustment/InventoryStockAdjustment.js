import { StockAdjustment } from './StockAdjustmentHierarchy'
import Inventory from '../stockinventory/Inventory'

export class InventoryStockAdjustment extends StockAdjustment {
    static entity = 'inventoryStockAdjustments'
    static baseEntity = 'stockAdjustments'

    static fields () {
        return {
            ...super.fields(),
            id: this.attr(null),
            inventory_id: this.attr(null),
            // relationships
            inventory: this.belongsTo(Inventory, 'inventory_id')
        }
    }
}
