import { Model } from '@vuex-orm/core'
import Clinic from '../clinic/Clinic'
import Stock from '../stock/Stock'
import { v4 as uuidv4 } from 'uuid'
import { nSQL } from 'nano-sql'

export default class StockEntrance extends Model {
    static entity = 'stockEntrances'

    static fields () {
        return {
            id: this.uid(() => uuidv4()),
            orderNumber: this.attr(''),
            dateReceived: this.attr(''),
            clinic_id: this.attr(''),
            syncStatus: this.attr(''),
            // relationships
            clinic: this.belongsTo(Clinic, 'clinic_id'),
            stocks: this.hasMany(Stock, 'entrance_id')
        }
    }

    static async apiSave (stockEntrance) {
      return await this.api().post('/stockEntrance', stockEntrance)
    }

    static async apiUpdate (stockEntrance) {
      return await this.api().patch('/stockEntrance/' + stockEntrance.id, stockEntrance)
    }

    static async apiRemove (id) {
      return await this.api().delete(`/stockEntrance/${id}`)
    }

    static async apiGetAllByClinicId (clinicId, offset, max) {
      return await this.api().get('/stockEntrance/clinic/' + clinicId + '?offset=' + offset + '&max=' + max)
    }

    static async apiFetchById (id) {
      return await this.api().get(`/stockEntrance/${id}`)
    }

    static localDbAddOrUpdate (targetCopy) {
      return nSQL().onConnected(() => {
        nSQL(this.entity).query('upsert',
        targetCopy
      ).exec()
      StockEntrance.insertOrUpdate({ data: targetCopy })
    })
    }

    static localDbGetAll () {
     nSQL().onConnected(() => {
       nSQL(this.entity).query('select').exec().then(result => {
        console.log(result)
        StockEntrance.insertOrUpdate({ data: result })
        })
      })
    }

    static localDbGetByStockEntranceId (stockEntrance) {
     return nSQL(this.entity).query('select').where(['id', '=', stockEntrance.id]).exec().then(result => {
        console.log(result)
        // StockEntrance.insert({ data: result })
        return result[0]
      })
  }

  static localDbGetToSyncronize () {
    return nSQL(this.entity).query('select').where([['stockEntrances[syncStatus]', '=', 'R'], 'OR', ['stockEntrances[syncStatus]', '=', 'U']]).exec().then(result => {
      console.log(result)
      // StockEntrance.insert({ data: result })
      return result
    })
  }

  static localDbDelete (stockEntrance) {
    return nSQL().onConnected(() => {
      nSQL(this.entity).query('delete').where(['id', '=', stockEntrance.id]).exec()
    StockEntrance.delete(stockEntrance.id)
  })
}

    static async syncStockEntrance (stockEntrance) {
      if (stockEntrance.syncStatus === 'R') await this.apiSave(stockEntrance)
      if (stockEntrance.syncStatus === 'U') await this.apiUpdate(stockEntrance)
    }

    static getClassName () {
      return 'stockEntrance'
    }
}
