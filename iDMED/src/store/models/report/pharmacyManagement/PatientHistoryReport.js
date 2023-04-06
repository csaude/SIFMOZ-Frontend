// import { Model } from '@vuex-orm/core'
import db from 'src/store/localbase'
import { nSQL } from 'nano-sql'
import { Model } from '@vuex-orm/core'

export default class patientHistoryReport extends Model {
    static entity = 'patientHistorys'
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
        middleNames: this.attr(''),
        lastNames: this.attr(''),
        cellphone: this.attr(''),
        tipoTarv: this.attr(''),
        pickUpDate: this.attr(''),
        nexPickUpDate: this.attr(''),
        startReason: this.attr(''),
        therapeuticalRegimen: this.attr(''),
        dispenseType: this.attr(''),
        age: this.attr(''),
        dispenseMode: this.attr(''),
        clinicalService: this.attr(''),
        clinic: this.attr(''),
        patientType: this.attr('')
      }
    }

    static localDbAdd (patientHistory) {
        return db.newDb().collection('patientHistoryReports').add(patientHistory)
      }

      static localDbUpdateAll (districts) {
        return db.newDb().collection('patientHistoryReports').set(districts)
      }

      static localDbDeleteAll () {
        return db.newDb().collection('patientHistoryReports').delete()
      }

      static localDbDeleteById (id) {
        return nSQL().onConnected(() => {
          nSQL(this.entity).query('delete').where(['id', '=', id]).exec()
          patientHistoryReport.delete(id)
      })
    }

      static localDbAddOrUpdate (targetCopy) {
        return nSQL().onConnected(() => {
          nSQL(this.entity).query('upsert',
          targetCopy
        ).exec()
        patientHistoryReport.insertOrUpdate({ data: targetCopy })
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
