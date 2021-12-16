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

    static async apiSave (stockEntrance) {
      return await this.api().post('/stockEntrance', stockEntrance)
    }

    static async apiUpdate (stockEntrance) {
      return await this.api().patch('/stockEntrance', stockEntrance)
    }

    static async apiRemove (id) {
      return await this.api().delete(`/stockEntrance/${id}`)
    }

    static async apiGetAllByClinicId (clinicId, offset, max) {
      return await this.api().get('/stockEntrance/clinic/' + clinicId + '?offset=' + offset + '&max=' + max)
    }

    static async apiFetchById (id) {
      return await this.api().get(`/stockEntrance/${id}`)
    }
}
