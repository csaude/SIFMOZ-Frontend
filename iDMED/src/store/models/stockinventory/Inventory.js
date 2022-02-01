import { Model } from '@vuex-orm/core'
import { date } from 'quasar'
import Clinic from '../clinic/Clinic'
import { InventoryStockAdjustment } from '../stockadjustment/StockAdjustmentHierarchy'

export default class Inventory extends Model {
    static entity = 'inventorys'

    static fields () {
        return {
            id: this.attr(null),
            startDate: this.attr(null),
            endDate: this.attr(null),
            open: this.boolean(true),
            generic: this.boolean(true),
            sequence: this.number(0),
            drugs: this.attr([]),
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
      return await this.api().post('/inventory', inventory)
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
}
