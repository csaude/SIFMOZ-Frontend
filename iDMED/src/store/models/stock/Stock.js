import { Model } from '@vuex-orm/core'
import { StockAdjustment } from '../stockadjustment/StockAdjustmentHierarchy'
import StockLevel from '../stocklevel/StockLevel'
import StockEntrance from '../stockentrance/StockEntrance'
import StockCenter from '../stockcenter/StockCenter'
import Drug from '../drug/Drug'

export default class Stock extends Model {
    static entity = 'stocks'

    static fields () {
        return {
            id: this.attr(null),
            expireDate: this.attr(''),
            modified: this.attr(''),
            shelfNumber: this.attr(''),
            unitsReceived: this.attr(''),
            stockMoviment: this.attr(''),
            manufacture: this.attr(''),
            batchNumber: this.attr(''),
            hasUnitsRemaining: this.attr(''),
            stock_entrance_id: this.attr(null),
            stock_center_id: this.attr(null),
            drug_id: this.attr(null),
            enabled: this.boolean(false),
            // relationships
            adjustments: this.hasMany(StockAdjustment, 'adjusted_stock_id'),
            stockEntrance: this.belongsTo(StockEntrance, 'stock_entrance_id'),
            stockCenter: this.belongsTo(StockCenter, 'stock_center_id'),
            stockLevel: this.hasOne(StockLevel, 'stock_id'),
            drug: this.belongsTo(Drug, 'drug_id')
        }
    }

    static async apiSave (stock) {
      return await this.api().post('/stock', stock)
    }

    static async apiRemove (id) {
      return await this.api().delete(`/stock/${id}`)
    }

    static async apiUpdate (stock) {
      return await this.api().patch('/stock', stock)
    }

    getConsumeAVG () {
      return 1
    }

    getState () {
      return 'Normal'
    }
}
