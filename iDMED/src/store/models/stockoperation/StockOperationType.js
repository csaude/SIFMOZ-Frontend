import { Model } from '@vuex-orm/core'
import { StockAdjustment } from '../stockadjustment/StockAdjustmentHierarchy'
import db from 'src/store/localbase'
import { nSQL } from 'nano-sql'

export default class StockOperationType extends Model {
  static entity = 'stockOperationTypes'

  static fields () {
    return {
      id: this.attr(null),
      code: this.attr(''),
      description: this.attr(''),
      syncStatus: this.attr(''),
      // relationships
      adjustments: this.hasMany(StockAdjustment, 'operation_id')
    }
  }

  static async apiGetAll (offset, max) {
    return await this.api().get('/stockOperationType?offset=' + offset + '&max=' + max)
  }

  static localDbAdd (stockOperationType) {
    return nSQL(this.entity).query('upsert',
    stockOperationType
     ).exec().then(
      StockOperationType.insertOrUpdate({ data: stockOperationType })
     )
  }

  static localDbGetById (id) {
    return db.newDb().collection('stockOperationTypes').doc({ id: id }).get()
  }

  static localDbGetAll () {
    return nSQL(this.entity).query('select').exec().then(result => {
      console.log(result)
      StockOperationType.insertOrUpdate({ data: result })
      })
  }

  static localDbUpdate (stockOperationType) {
    return db.newDb().collection('stockOperationTypes').doc({ id: stockOperationType.id }).set(stockOperationType)
  }

  static localDbUpdateAll (stockOperationTypes) {
    return db.newDb().collection('stockOperationTypes').set(stockOperationTypes)
  }

  static localDbDelete (stockOperationType) {
    return db.newDb().collection('stockOperationTypes').doc({ id: stockOperationType.id }).delete()
  }

  static localDbDeleteAll () {
    return db.newDb().collection('stockOperationTypes').delete()
  }
}
