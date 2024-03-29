import { Model } from '@vuex-orm/core'
import Stock from '../stock/Stock'
import { v4 as uuidv4 } from 'uuid'

export default class StockLevel extends Model {
    static entity = 'stockLevels'

    static fields () {
        return {
            id: this.uid(() => uuidv4()),
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
