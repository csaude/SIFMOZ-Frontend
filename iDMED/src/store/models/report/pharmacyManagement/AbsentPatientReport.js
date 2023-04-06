// import { Model } from '@vuex-orm/core'
import db from 'src/store/localbase'
import { nSQL } from 'nano-sql'
import { Model } from '@vuex-orm/core'

export default class AbsentPatientReport extends Model {
    static entity = 'absentPatientReports'
    static fields () {
      return {
        id: this.attr(null),
        reportId: this.attr(''),
        periodType: this.attr(''),
        period: this.attr(''),
        year: this.attr(''),
        startDate: this.attr(''),
        endDate: this.attr(''),
        province: this.attr(''),
        district: this.attr(''),

       // fields
        nid: this.attr(''),
        firstNames: this.attr(''),
        cellphone: this.attr(''),
        // dateBackUs: this.attr(''),
        dateMissedPickUp: this.attr(''),
        dateIdentifiedAbandonment: this.attr(''),
        returnedPickUp: this.attr('')
      }
    }

    static localDbAdd (absentPatientReport) {
        return db.newDb().collection('absentPatientReports').add(absentPatientReport)
      }

      static localDbGetAll () { //
       return db.newDb().collection('absentPatientReports').get()
      }

      static localDbUpdateAll (absentPatientReports) {
        return db.newDb().collection('absentPatientReports').set(absentPatientReports)
      }

      static localDbDeleteAll () {
        return db.newDb().collection('absentPatientReports').delete()
      }

      static localDbDeleteById (id) {
        return db.newDb().collection('absentPatientReports').doc({ id: id }).delete()
      }

      static localDbAddOrUpdate (targetCopy) {
        return nSQL().onConnected(() => {
          nSQL(this.entity).query('upsert',
          targetCopy
        ).exec()
        AbsentPatientReport.insertOrUpdate({ data: targetCopy })
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
