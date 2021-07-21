import { Model } from '@vuex-orm/core'
import Stock from '../stock/Stock'

export default class StockEntrance extends Model {
    static entity = 'stockEntrances'

    static fields () {
        return {
            id: this.attr(null),
            orderNumber: this.attr(''),
            dateReceived: this.attr(''),
            // relationships
            stocks: this.hasMany(Stock, 'stock_entrance_id')
        }
    }
}
