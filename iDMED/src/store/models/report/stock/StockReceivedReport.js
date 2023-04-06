import { Model } from '@vuex-orm/core'
import db from 'src/store/localbase'
import { v4 as uuidv4 } from 'uuid'
import { nSQL } from 'nano-sql'

export default class StockReceivedReport extends Model {
    static entity = 'stockReceivedReports'
    static fields () {
      return {
        id: this.uid(() => uuidv4()),
        reportId: this.attr(''),
        periodType: this.attr(''),
        period: this.attr(''),
        year: this.attr(''),
        startDate: this.attr(''),
        endDate: this.attr(''),
        province: this.attr(''),
        district: this.attr(''),

       // fields
        orderNumber: this.attr(''),
        drugName: this.attr(''),
        expiryDate: this.attr(''),
        dateReceived: this.attr(''),
        unitsReceived: this.attr(''),
        manufacture: this.attr(''),
        batchNumber: this.attr('')
      }
    }

    static localDbAdd (stockReceivedReports) {
        return db.newDb().collection('stockReceivedReports').add(stockReceivedReports)
      }

      static localDbGetAll () { //
       return db.newDb().collection('stockReceivedReports').get()
      }

      static localDbUpdateAll (stockReceivedReports) {
        return db.newDb().collection('stockReceivedReports').set(stockReceivedReports)
      }

      static localDbDeleteAll () {
        return db.newDb().collection('stockReceivedReports').delete()
      }

      static localDbDeleteById (id) {
        return db.newDb().collection('stockReceivedReports').doc({ id: id }).delete()
      }

      static localDbAddOrUpdate (targetCopy) {
        return nSQL().onConnected(() => {
          nSQL(this.entity).query('upsert',
          targetCopy
        ).exec()
        StockReceivedReport.insertOrUpdate({ data: targetCopy })
      })
      }

      static localDbGetAllByReportId (reportId) {
        return nSQL(this.entity).query('select').where(['reportId', '=', reportId]).exec().then(result => {
          console.log(result)
          // Stock.insert({ data: result })
          return result
        })
      }
}
