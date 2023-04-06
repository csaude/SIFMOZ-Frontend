import { StockAdjustment } from './StockAdjustmentHierarchy'
import Inventory from '../stockinventory/Inventory'
import { v4 as uuidv4 } from 'uuid'
import { nSQL } from 'nano-sql'

export class InventoryStockAdjustment extends StockAdjustment {
    static entity = 'inventoryStockAdjustments'
    static baseEntity = 'stockAdjustments'

    static fields () {
        return {
            ...super.fields(),
            id: this.uid(() => uuidv4()),
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
      return await this.api().patch('/inventoryStockAdjustment/' + adjustment.id, adjustment)
    }

    static async apiGetAll (offset, max) {
      return await this.api().get('/inventoryStockAdjustment?offset=' + offset + '&max=' + max)
    }

    static async apiFetchById (id) {
      return await this.api().get(`/inventoryStockAdjustment/${id}`)
    }

    static localDbAddOrUpdate (targetCopy) {
      return nSQL().onConnected(() => {
        nSQL(this.entity).query('upsert',
        targetCopy
      ).exec()
      InventoryStockAdjustment.insertOrUpdate({ data: targetCopy })
    })
    }

    static async localDbGetAll () {
      return nSQL(this.entity).query('select').exec().then(result => {
        console.log(result)
        InventoryStockAdjustment.insertOrUpdate({ data: result })
        return result
        })
    }

    static localDbGetById (invStockAdj) {
     return nSQL(this.entity).query('select').where(['id', '=', invStockAdj.id]).exec().then(result => {
        console.log(result)
        return result[0]
      })
  }

  static localDbGetByInventory (inventory) {
    return nSQL(this.entity).query('select').where(['inventoryStockAdjustments[id]', '=', inventory.id]).exec().then(result => {
       return result
     })
 }

  static localDbDeleteById (invStockAdj) {
    return nSQL().onConnected(() => {
      nSQL(this.entity).query('delete').where(['id', '=', invStockAdj.id]).exec()
      InventoryStockAdjustment.delete(invStockAdj.id)
  })
}
}
