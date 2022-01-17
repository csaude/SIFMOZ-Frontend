import { Model } from '@vuex-orm/core'
import Clinic from '../clinic/Clinic'
import Stock from '../stock/Stock'

export default class StockEntrance extends Model {
    static entity = 'stockEntrances'

    static fields () {
        return {
            id: this.attr(null),
            orderNumber: this.attr(''),
            dateReceived: this.attr(''),
            clinic_id: this.attr(''),
            // relationships
            clinic: this.belongsTo(Clinic, 'clinic_id'),
            stocks: this.hasMany(Stock, 'entrance_id')
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
