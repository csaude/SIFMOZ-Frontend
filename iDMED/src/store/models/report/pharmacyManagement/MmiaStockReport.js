// import { Model } from '@vuex-orm/core'
import { Model } from '@vuex-orm/core'
import { v4 as uuidv4 } from 'uuid'
import { nSQL } from 'nano-sql'

export default class MmiaStockReport extends Model {
    static entity = 'mmiaStockReports'
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
       unit: this.attr(''),
      // drugId: this.attr(''),
       drugName: this.attr(''),
       balance: this.attr(''),
       initialEntrance: this.attr(0),
       outcomes: this.attr(0),
       lossesAdjustments: this.attr(0),
       actualStock: this.attr(0),
       inventory: this.attr(0),
       expireDate: this.attr(0)
      }
    }

        static localDbAddOrUpdate (targetCopy) {
          nSQL(this.entity).query('upsert',
          targetCopy
        ).exec()
        MmiaStockReport.insertOrUpdate({ data: targetCopy })
      }

      static localDbGetAllByReportId (reportId) {
        return nSQL(this.entity).query('select').where(['reportId', '=', reportId]).exec().then(result => {
          console.log(result)
          // Stock.insert({ data: result })
          return result
        })
      }
}
