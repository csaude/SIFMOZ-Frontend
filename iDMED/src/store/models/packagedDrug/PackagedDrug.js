import { Model } from '@vuex-orm/core'
import Drug from '../drug/Drug'
import Pack from '../packaging/Pack'

export default class PackagedDrug extends Model {
    static entity = 'packagedDrugs'
    static fields () {
      return {
        id: this.attr(null),
        quantitySupplied: this.attr(''),
        nextPickUpDate: this.attr(''),
        toContinue: this.boolean(false),
        pack_id: this.attr(''),
        drug_id: this.attr(''),
        // Relationships
        pack: this.belongsTo(Pack, 'pack_id'),
        drug: this.belongsTo(Drug, 'drug_id')
      }
    }

    static async apiGetAllByPackId (packId) {
      return await this.api().get('/packagedDrug/pack/' + packId)
    }

    static async apiGetAll () {
      return await this.api().get('/packagedDrug')
    }
}
