import { Model } from '@vuex-orm/core'
import db from 'src/store/localbase'

export default class DrugStockFileEvent extends Model {
  static entity = 'drugStockFileEvents'

  static fields () {
    return {
        id: this.attr(null),
        eventDate: this.attr(''),
        moviment: this.attr(''),
        orderNumber: this.attr(''),
        incomes: this.attr(''),
        outcomes: this.attr(''),
        posetiveAdjustment: this.attr(''),
        negativeAdjustment: this.attr(''),
        loses: this.attr(''),
        balance: this.attr(''),
        notes: this.attr(''),
        code: this.attr(''),
        stockId: this.attr('')
    }
  }

  static async apiGetDrugFileMobile (clinicId) {
    return await this.api().get(`/drugStockFile/drugfilemobile/${clinicId}`)
  }

  static localDbAdd (drugStockFileEvent) {
    return db.newDb().collection('drugStockFileEvents').add(drugStockFileEvent)
  }
}
