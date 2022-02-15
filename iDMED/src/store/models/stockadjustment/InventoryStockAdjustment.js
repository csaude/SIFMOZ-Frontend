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

    static async apiSave (adjustment) {
      return await this.api().post('/inventoryStockAdjustment', adjustment)
    }

    static async apiRemove (id) {
      return await this.api().delete(`/inventoryStockAdjustment/${id}`)
    }

    static async apiUpdate (adjustment) {
      return await this.api().post('/inventoryStockAdjustment', adjustment)
    }

    static async apiGetAll (offset, max) {
      return await this.api().get('/inventoryStockAdjustment?offset=' + offset + '&max=' + max)
    }
}
