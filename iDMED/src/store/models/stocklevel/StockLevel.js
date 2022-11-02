import { Model } from '@vuex-orm/core'
import Stock from '../stock/Stock'

export default class StockLevel extends Model {
    static entity = 'stockLevels'

    static fields () {
        return {
            id: this.attr(null),
            bacth: this.attr(null),
            fullContainerRemaining: this.attr(null),
            loosePillsRemaining: this.attr(null),
            stock_id: this.attr(null),
            syncStatus: this.attr(''),
            // relationships
            stock: this.belongsTo(Stock, 'stock_id')
        }
    }
}
