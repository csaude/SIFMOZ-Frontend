import { Model } from '@vuex-orm/core'
import { date } from 'quasar'
import Clinic from '../clinic/Clinic'
import { InventoryStockAdjustment } from '../stockadjustment/StockAdjustmentHierarchy'
import { v4 as uuidv4 } from 'uuid'
import { nSQL } from 'nano-sql'

export default class Inventory extends Model {
    static entity = 'inventorys'

    static fields () {
        return {
          id: this.uid(() => uuidv4()),
            startDate: this.attr(null),
            endDate: this.attr(null),
            open: this.boolean(true),
            generic: this.boolean(true),
            sequence: this.number(0),
            drugs: this.attr([]),
            syncStatus: this.attr(''),
            clinic_id: this.attr(''),
            // relationships
            clinic: this.belongsTo(Clinic, 'clinic_id'),
            adjustments: this.hasMany(InventoryStockAdjustment, 'inventory_id')
        }
    }

    getInventoryType () {
      if (this.generic) {
        return 'Geral'
      } else {
        return 'Parcial'
      }
    }

    getChipColor () {
      if (this.open) {
        return 'primary'
      } else {
        return 'negative'
      }
    }

    getFormatedStartDate () {
      return this.formatDate(this.startDate)
    }

    getFormatedEndDate () {
      return this.formatDate(this.endDate)
    }

    formatDate (dateString) {
      return date.formatDate(dateString, 'DD-MM-YYYY')
    }

    getInventoryStatus () {
      if (this.open) {
        return 'Aberto'
      } else {
        return 'Fechado'
      }
    }

    static async apiSave (inventory) {
      return await this.api().post('/inventory', inventory)
    }

    static async apiUpdate (inventory) {
      return await this.api().patch('/inventory/' + inventory.id, inventory)
    }

    static async apiClose (id) {
      return await this.api().patch(`/inventory/close/${id}`)
    }

    static async apiRemove (id) {
      return await this.api().delete(`/inventory/${id}`)
    }

    static async apiGetAllByClinicId (clinicId, offset, max) {
      return await this.api().get('/inventory/clinic/' + clinicId + '?offset=' + offset + '&max=' + max)
    }

    static async apiGetAll (offset, max) {
      return await this.api().get('/inventory?offset=' + offset + '&max=' + max)
    }

    static async apiFetchById (id) {
      return await this.api().get(`/inventory/${id}`)
    }

    static async syncInventory (inventory) {
      if (inventory.syncStatus === 'R') await this.apiSave(inventory)
      if (inventory.syncStatus === 'U') await this.apiUpdate(inventory)
    }

    static getClassName () {
      return 'Inventory'
    }

    static localDbAddOrUpdate (targetCopy) {
        nSQL(this.entity).query('upsert',
        targetCopy
      ).exec()
      Inventory.insertOrUpdate({ data: targetCopy })
    }

    static localDbGetAll () {
       nSQL(this.entity).query('select').exec().then(result => {
        console.log(result)
        Inventory.insertOrUpdate({ data: result })
        })
    }

    static localDbGetById (inventory) {
     return nSQL(this.entity).query('select').where(['id', '=', inventory.id]).exec().then(result => {
        console.log(result)
        return result[0]
      })
  }

  static localDbDeleteById (inventory) {
      nSQL(this.entity).query('delete').where(['id', '=', inventory.id]).exec()
      Inventory.delete(inventory.id)
}
}
