import { Model } from '@vuex-orm/core'
import Clinic from '../clinic/Clinic'
import { StockDestructionAdjustment } from '../stockadjustment/StockAdjustmentHierarchy'
import db from 'src/store/localbase'
import { v4 as uuidv4 } from 'uuid'
import { nSQL } from 'nano-sql'

export default class DestroyedStock extends Model {
    static entity = 'destroyedStocks'

    static fields () {
        return {
            id: this.uid(() => uuidv4()),
            notes: this.attr(''),
            date: this.attr(null),
            updateStatus: this.attr('P'),
            clinic_id: this.attr(''),
            syncStatus: this.attr(''),
            // relationships
            clinic: this.belongsTo(Clinic, 'clinic_id'),
            adjustments: this.hasMany(StockDestructionAdjustment, 'destruction_id')
        }
    }

    static async apiSave (destroyedStock) {
      return await this.api().post('/destroyedStock', destroyedStock)
    }

    static async apiRemove (id) {
      return await this.api().delete(`/destroyedStock/${id}`)
    }

    static async apiUpdate (destroyedStock) {
      return await this.api().patch('/destroyedStock', destroyedStock)
    }

    static async apiGetAll (offset, max) {
      return await this.api().get('/destroyedStock?offset=' + offset + '&max=' + max)
    }

    static localDbAdd (destroyedStock) {
      return nSQL(this.entity).query('upsert',
      destroyedStock
       ).exec().then(
        DestroyedStock.insertOrUpdate({ data: destroyedStock })
       )
    }

    static localDbGetById (id) {
      return db.newDb().collection('destroyedStocks').doc({ id: id }).get()
    }

    static localDbGetAll () {
      return nSQL(this.entity).query('select').exec().then(result => {
        console.log(result)
        DestroyedStock.insertOrUpdate({ data: result })
        })
    }

    static localDbUpdate (destroyedStock) {
      return db.newDb().collection('destroyedStocks').doc({ id: destroyedStock.id }).set(destroyedStock)
    }

    static localDbUpdateAll (destroyedStocks) {
      return db.newDb().collection('destroyedStocks').set(destroyedStocks)
    }

    static localDbDelete (destroyedStock) {
      return db.newDb().collection('destroyedStocks').doc({ id: destroyedStock.id }).delete()
    }

    static localDbDeleteAll () {
      return db.newDb().collection('destroyedStocks').delete()
    }

    static async syncDestroyedStock (destroyedStock) {
      if (destroyedStock.syncStatus === 'R') await this.apiSave(destroyedStock)
      if (destroyedStock.syncStatus === 'U') await this.apiUpdate(destroyedStock)
    }
}
