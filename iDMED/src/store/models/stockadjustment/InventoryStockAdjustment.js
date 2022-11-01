import { StockAdjustment } from './StockAdjustmentHierarchy'
import Inventory from '../stockinventory/Inventory'
import db from 'src/store/localbase'

export class InventoryStockAdjustment extends StockAdjustment {
    static entity = 'inventoryStockAdjustments'
    static baseEntity = 'stockAdjustments'

    static fields () {
        return {
            ...super.fields(),
            id: this.attr(null),
            inventory_id: this.attr(null),
            syncStatus: this.attr(''),
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

    static localDbAdd (inventoryStockAdjustment) {
      return db.newDb().collection('inventoryStockAdjustments').add(inventoryStockAdjustment)
    }

    static localDbGetById (id) {
      return db.newDb().collection('inventoryStockAdjustments').doc({ id: id }).get()
    }

    static localDbGetAll () {
      return db.newDb().collection('inventoryStockAdjustments').get()
    }

    static localDbUpdate (inventoryStockAdjustment) {
      return db.newDb().collection('inventoryStockAdjustments').doc({ id: inventoryStockAdjustment.id }).set(inventoryStockAdjustment)
    }

    static localDbUpdateAll (inventoryStockAdjustments) {
      return db.newDb().collection('inventoryStockAdjustments').set(inventoryStockAdjustments)
    }

    static localDbDelete (inventoryStockAdjustment) {
      return db.newDb().collection('inventoryStockAdjustments').doc({ id: inventoryStockAdjustment.id }).delete()
    }

    static localDbDeleteAll () {
      return db.newDb().collection('inventoryStockAdjustments').delete()
    }
}
