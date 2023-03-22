import { Model } from '@vuex-orm/core'
import { nSQL } from 'nano-sql'
import Drug from '../drug/Drug'

export default class StockAlert extends Model {
  static entity = 'stockAlerts'

  static fields () {
    return {
      id: this.attr(null),
      drug: this.attr(''),
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
// drug_id from (select drug_id, entrance_id FROM stock) a

 static async localDbGetStockAlert () {
  const drugs = await Drug.localDbGetAll()
  for (const drug in drugs) {
    const total = await this.localGetConsuptionByDrug(drug)
    console.log(total)
  }
  return nSQL().onConnected(() => {
    nSQL('stocks').query('select')
 .exec().then(result => {
  console.log('Resultado: ', result)
  return result
  })
})
 }

 //  'packagedDrugStocks[quantitySupplied]'
 static async localGetConsuptionByDrug (drug) {
  return nSQL('packagedDrugs').query('select', ['id']).where(['id', '=', drug.id])
  .join({
    type: 'inner', // Supported join types are left, inner, right, cross and outer.
    table: 'packs',
    where: ['packagedDrugs.pack_id', '=', 'packs.id'] // any valid WHERE statement works here
})
/* .join({
  type: 'inner', // Supported join types are left, inner, right, cross and outer.
  table: 'packagedDrugStocks',
  where: ['packagedDrugStocks.packagedDrug_id', '=', 'packagedDrugs.id'] // any valid WHERE statement works here
}) */
  .exec().then(result => {
     console.log('ResultadoDrug: ', result)
     // Stock.insert({ data: result })
     return result
   })
 }
}
