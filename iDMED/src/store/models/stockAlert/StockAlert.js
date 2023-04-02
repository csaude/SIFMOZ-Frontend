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

// drug_id from (select drug_id, entrance_id FROM stock) a

 static async localDbGetStockAlertBackUPP () {
  const drugs = await Drug.localDbGetAll()
  for (let i = 0; i < drugs.length; i++) {
   await this.localGetConsuptionByDrug(drugs[i])
    // console.log(total)
  }
  /* return nSQL().onConnected(() => {
    nSQL('stocks').query('select')
 .exec().then(result => {
 // console.log('Resultado: ', result)
  return result
  })
}) */
 }

 //  'packagedDrugStocks[quantitySupplied]'
 static async localGetConsuptionByDrug (drug) {
  return nSQL('stocks').query('select', ['stocks.id', 'drugs.id', 'SUM(stocks.stockMoviment) AS total'])
  .join({
    type: 'inner', // Supported join types are left, inner, right, cross and outer.
    table: 'drugs',
    where: ['stocks.drug_id', '=', 'drugs.id'] // any valid WHERE statement works here
}).groupBy({ 'drugs.id': 'asc' })
/* .join({
  type: 'inner', // Supported join types are left, inner, right, cross and outer.
  table: 'packagedDrugStocks',
  where: ['packagedDrugStocks.packagedDrug_id', '=', 'packagedDrugs.id'] // any valid WHERE statement works here
}) */
  .exec().then(result => {
     if (result.length > 0) {
      console.log('ResultadoDrug: ', result)
     // Stock.insert({ data: result })
     return result
     }
   })
 }
}
