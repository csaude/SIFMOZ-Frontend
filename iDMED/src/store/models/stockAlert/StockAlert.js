import { Model } from '@vuex-orm/core'
import { nSQL } from 'nano-sql'
import Drug from '../drug/Drug'
import Stock from '../stock/Stock'

export default class StockAlert extends Model {
  static entity = 'stockAlerts'

  static fields () {
    return {
      id: this.attr(null),
      drugName: this.attr(''),
      drug: this.attr(null),
      balance: this.attr(''),
      avgConsuption: this.attr(''),
      state: this.attr('')
    }
  }

  static async apiGetAlertStockMobile (clinicId, serviceCode) {
    return this.api().get(`/dashBoard/getStockAlert/${clinicId}/${serviceCode}`)
  }

  static localDbAddOrUpdate (targetCopy) {
    return nSQL().onConnected(() => {
      nSQL(this.entity).query('upsert',
      targetCopy
    ).exec()
    StockAlert.insertOrUpdate({ data: targetCopy })
  })
  }

  static localDbGetAll () {
   return nSQL(this.entity).query('select').exec().then(result => {
     StockAlert.insertOrUpdate({ data: result })
     return result
     })
 }

  static async localDbGetStockAlert () {
   const listStockAlert = []
  const drugList = await Drug.localDbGetAll()
   for (const drug of drugList) {
    const hasStock = await Drug.hasStock(drug)
    if (hasStock) {
      const stockAlert = new StockAlert()
      const balance = await Stock.localDbGetStockBalanceByDrug(drug)
      const drugQuantitySupplied = await Stock.localDbGetQuantitySuppliedByDrug(drug)
      stockAlert.balance = balance
       stockAlert.drugName = drug.name
       stockAlert.drug = drug
       stockAlert.avgConsuption = drugQuantitySupplied / 3
       if (drugQuantitySupplied === 0) {
         stockAlert.state = 'Sem Consumo'
       } else if (stockAlert.balance > (drugQuantitySupplied / 3)) {
        stockAlert.state = 'Acima do Consumo Máximo'
       } else if (stockAlert.balance > (drugQuantitySupplied / 3)) {
        stockAlert.state = 'Ruptura de Stock'
       }
       listStockAlert.push(stockAlert)
    //   return listStockAlert
  }
}
  return listStockAlert
 }
}
