import { Model } from '@vuex-orm/core'
import { StockAdjustment } from '../stockadjustment/StockAdjustmentHierarchy'

export default class StockOperationType extends Model {
  static entity = 'stockOperationTypes'

  static fields () {
    return {
      id: this.attr(null),
      code: this.attr(''),
      description: this.attr(''),
      // relationships
      adjustments: this.hasMany(StockAdjustment, 'operation_id')
    }
  }

  static async apiGetAll (offset, max) {
    return await this.api().get('/stockOperationType?offset=' + offset + '&max=' + max)
  }
}
