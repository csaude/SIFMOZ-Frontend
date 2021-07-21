import StockAdjustment from './StockAdjustment'
import Inventory from '../stockinventory/Inventory'

export default class InventoryStockAdjustment extends StockAdjustment {
    static entity = 'inventoryStockAdjustments'

    static fields () {
        return {
            ...super.fields(),
            id: this.attr(null),
            inventory_id: this.attr(null),
            // relationships
            adjustedStock: this.belongsTo(Inventory, 'inventory_id')
        }
    }
}
