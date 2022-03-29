import { Model } from '@vuex-orm/core'
import { StockAdjustment } from '../stockadjustment/StockAdjustmentHierarchy'
import StockLevel from '../stocklevel/StockLevel'
import StockEntrance from '../stockentrance/StockEntrance'
import StockCenter from '../stockcenter/StockCenter'
import Drug from '../drug/Drug'
import Clinic from '../clinic/Clinic'
import { date } from 'quasar'
import PackagedDrugStock from '../packagedDrug/PackagedDrugStock'

export default class Stock extends Model {
    static entity = 'stocks'

    static fields () {
        return {
            id: this.attr(null),
            expireDate: this.attr(''),
            auxExpireDate: this.attr(''),
            modified: this.boolean(false),
            shelfNumber: this.attr(''),
            unitsReceived: this.attr(''),
            stockMoviment: this.number(0),
            manufacture: this.attr(''),
            batchNumber: this.attr(''),
            hasUnitsRemaining: this.boolean(false),
            entrance_id: this.attr(null),
            stock_center_id: this.attr(null),
            drug_id: this.attr(null),
            enabled: this.boolean(false),
            clinic_id: this.attr(''),
            // relationships
            clinic: this.belongsTo(Clinic, 'clinic_id'),
            adjustments: this.hasMany(StockAdjustment, 'adjusted_stock_id'),
            entrance: this.belongsTo(StockEntrance, 'entrance_id'),
            center: this.belongsTo(StockCenter, 'stock_center_id'),
            stockLevel: this.hasOne(StockLevel, 'stock_id'),
            drug: this.belongsTo(Drug, 'drug_id'),
            packagedDrugStocks: this.hasMany(PackagedDrugStock, 'stock_id')
        }
    }

    static async apiSave (stock) {
      return await this.api().post('/stock', stock)
    }

    static async apiRemove (id) {
      return await this.api().delete(`/stock/${id}`)
    }

    static async apiUpdate (stock) {
      return await this.api().post('/stock', stock)
    }

    static async apiGetAll (offset, max) {
      return await this.api().get('/stock?offset=' + offset + '&max=' + max)
    }

    isInUse () {
      return this.packagedDrugs.length > 0 || this.adjustments.length > 0
    }

    getFormatedExpireDate () {
      return this.formatDate(this.expireDate)
    }

    formatDate (dateString) {
      return date.formatDate(dateString, 'DD-MM-YYYY')
    }
}
