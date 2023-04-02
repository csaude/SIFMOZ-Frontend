import { Model } from '@vuex-orm/core'
import db from 'src/store/localbase'
import { nSQL } from 'nano-sql'
import Stock from '../stock/Stock'

export default class DrugFile extends Model {
  static entity = 'drugFiles'

  static fields () {
    return {
      id: this.attr(null),
      drugId: this.attr(null),
      drug: this.attr(''),
      drugFileSummary: this.attr(''),
     drugFileSummaryBatch: this.attr('')
    }
  }

  static async apiGetDrugFileMobile (clinicId) {
    return await this.api().get(`/drugStockFile/drugfilemobile/${clinicId}`)
  }

  static localDbAdd (drugFile) {
    return db.newDb().collection('drugFile').add(drugFile)
  }

  static localDbUpdate (drugFile) {
    return db.newDb().collection('drugFile').doc({ id: drugFile.id }).set(drugFile)
  }

  static localDbAddOrUpdate (targetCopy) {
    return nSQL().onConnected(() => {
      nSQL(this.entity).query('upsert',
      targetCopy
    ).exec()
    DrugFile.insertOrUpdate({ data: targetCopy })
  })
  }

  static localDbGetAll () {
   return nSQL(this.entity).query('select').exec().then(result => {
    DrugFile.insertOrUpdate({ data: result })
     return result
     })
 }

  static calculateBalance (records) {
    let balance = 0
    records.forEach(item => {
      const current = parseInt(item.incomes) - parseInt(item.outcomes) + parseInt(item.posetiveAdjustment) - parseInt(item.negativeAdjustment) - parseInt(item.loses)
      balance = current + parseInt(balance)
      item.balance = balance
    })
  return records
}

 static async getDrugFileSummary (drug) {
  let list = []
 const entrances = await Stock.getEntrancesDrugFile(drug)
 entrances.forEach(item => {
  list.push(item)
 })
 const packs = await Stock.getPacksDrugFile(drug)
 packs.forEach(item => {
  list.push(item)
 })
 const adjustments = await Stock.getAdjustmentsDrugFile(drug)
 adjustments.forEach(item => {
  list.push(item)
 })

 const destructions = await Stock.getDestructionsDrugFile(drug)
 destructions.forEach(item => {
  list.push(item)
 })

 const inventoryAdjustments = await Stock.getInventoryAdjustmentsDrugFile(drug)
 inventoryAdjustments.forEach(item => {
  list.push(item)
 })

 list = list.sort((a, b) => {
  const d1 = new Date(a.eventDate)
  const d2 = new Date(b.eventDate)
  return d2 - d1
})
return this.calculateBalance(list, 0)
 }

 static async getDrugFileSummaryBatch (stockId) {
  let list = []
  const entrances = await Stock.getEntrancesDrugFileBatch(stockId)
  entrances.forEach(item => {
   list.push(item)
  })
  const packs = await Stock.getPacksDrugFileBatch(stockId)
  packs.forEach(item => {
   list.push(item)
  })

  const adjustments = await Stock.getAdjustmentsDrugFileBatch(stockId)
 adjustments.forEach(item => {
  list.push(item)
 })

 const destructions = await Stock.getDestructionsDrugFileBatch(stockId)
 destructions.forEach(item => {
  list.push(item)
 })

 const inventoryAdjustments = await Stock.getInventoryAdjustmentsDrugFileBatch(stockId)
 inventoryAdjustments.forEach(item => {
  list.push(item)
 })
 list = list.sort((a, b) => {
  const d1 = new Date(a.eventDate)
  const d2 = new Date(b.eventDate)
  return d2 - d1
})
 return this.calculateBalance(list, 0)
 }
}
