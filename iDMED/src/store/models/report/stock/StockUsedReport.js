// import { Model } from '@vuex-orm/core'
import { Model } from '@vuex-orm/core'
import db from 'src/store/localbase'
import { v4 as uuidv4 } from 'uuid'
import { nSQL } from 'nano-sql'

export default class StockUsedReport extends Model {
    static entity = 'stockUsedReports'
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
       fnmCode: this.attr(''),
      // drugId: this.attr(''),
       drugName: this.attr(''),
       balance: this.attr(''),
       receivedStock: this.attr(0),
       stockIssued: this.attr(0),
       adjustment: this.attr(0),
       actualStock: this.attr(0)
      }
    }

    static localDbAdd (stockUsedReport) {
        return db.newDb().collection('stockUsedReports').add(stockUsedReport)
      }

      static localDbGetAll () { //
       return db.newDb().collection('stockUsedReports').get()
      }

      static localDbUpdateAll (stockUsedReport) {
        return db.newDb().collection('stockUsedReports').set(stockUsedReport)
      }

      static localDbDeleteAll () {
        return db.newDb().collection('stockUsedReports').delete()
      }

      static localDbDeleteById (id) {
        return db.newDb().collection('stockUsedReports').doc({ id: id }).delete()
      }

      static localDbAddOrUpdate (targetCopy) {
          nSQL(this.entity).query('upsert',
          targetCopy
        ).exec()
        StockUsedReport.insertOrUpdate({ data: targetCopy })
      }

      static localDbGetAllByReportId (reportId) {
        return nSQL(this.entity).query('select').where(['reportId', '=', reportId]).exec().then(result => {
          console.log(result)
          // Stock.insert({ data: result })
          return result
        })
      }
}
