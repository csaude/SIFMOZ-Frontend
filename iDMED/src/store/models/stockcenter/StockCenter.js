import { Model } from '@vuex-orm/core'
import Clinic from '../clinic/Clinic'

export default class StockCenter extends Model {
    static entity = 'stockCenters'

    static fields () {
        return {
            id: this.attr(null),
            name: this.attr(''),
            prefered: this.boolean(false),
            code: this.attr(''),
            clinic_id: this.attr(''),
            // relationships
            clinic: this.belongsTo(Clinic, 'clinic_id')
        }
    }

    static async apiGetAll () {
      return await this.api().get('/stockCenter')
    }
}
