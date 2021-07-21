import { Model } from '@vuex-orm/core'
import Stock from '../stock/Stock'

export default class StockCenter extends Model {
    static entity = 'stockCenters'

    static fields () {
        return {
            id: this.attr(null),
            name: this.attr(''),
            prefered: this.attr(''),
            code: this.attr(''),
            // relationships
            stocks: this.hasMany(Stock, 'stock_center_id')
        }
    }
}
