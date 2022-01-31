import { Model } from '@vuex-orm/core'
import Drug from '../drug/Drug'
import Stock from '../stock/Stock'
import PackagedDrug from './PackagedDrug'

export default class PackagedDrugStock extends Model {
    static entity = 'packagedDrugStocks'
    static fields () {
      return {
        id: this.attr(null),
        quantitySupplied: this.attr(''),
        creationDate: this.attr(''),
        packagedDrug_id: this.attr(''),
        drug_id: this.attr(''),
        stock_id: this.attr(''),
        // Relationships
        packagedDrug: this.belongsTo(PackagedDrug, 'pack_id'),
        drug: this.belongsTo(Drug, 'drug_id'),
        stock: this.belongsTo(Stock, 'stock_id')
      }
    }

    static async apiGetAllByPackId (packId) {
      return await this.api().get('/packagedDrug/pack/' + packId)
    }

    static async apiGetAll () {
      return await this.api().get('/packagedDrugStock?offset=' + 0 + '&max=' + 200)
    }
}
