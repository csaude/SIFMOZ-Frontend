import { Model } from '@vuex-orm/core'
import db from 'src/store/localbase'
import { nSQL } from 'nano-sql'

export default class ActiveInDrugStore extends Model {
    static entity = 'activeInDrugStores'
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
        clinic: this.attr(''),
        firstNames: this.attr(''),
        middleNames: this.attr(''),
        lastNames: this.attr(''),
        age: this.attr(''),
        cellphone: this.attr(''),
        patientType: this.attr(''),
        therapeuticLine: this.attr(''),
        therapeuticRegimen: this.attr(''),
        pickupDate: this.attr(''),
        nextPickUpDate: this.attr('')
      }
    }

    static localDbAdd (activeInDrugStore) {
        return db.newDb().collection('activeInDrugStores').add(activeInDrugStore)
      }

      static localDbGetAll () { //
       return db.newDb().collection('activeInDrugStores').get()
      }

      static localDbUpdateAll (activeInDrugStore) {
        return db.newDb().collection('activeInDrugStores').set(activeInDrugStore)
      }

      static localDbDeleteAll () {
        return db.newDb().collection('activeInDrugStores').delete()
      }

      static localDbDeleteById (id) {
        return db.newDb().collection('activeInDrugStores').doc({ id: id }).delete()
      }

      static localDbAddOrUpdate (targetCopy) {
        return nSQL().onConnected(() => {
          nSQL(this.entity).query('upsert', targetCopy).exec()
        ActiveInDrugStore.insertOrUpdate({ data: targetCopy })
      })
      }

      static localDbGetAllByReportId (reportId) {
        return nSQL(this.entity).query('select').where(['reportId', '=', reportId]).exec().then(async result => {
          if (result !== undefined) {
            return result
          }
          return null
        })
      }
}
