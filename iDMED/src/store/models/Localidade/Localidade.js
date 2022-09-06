import { Model } from '@vuex-orm/core'
import PostoAdministrativo from '../PostoAdministrativo/PostoAdministrativo'
import District from '../district/District'

export default class Localidade extends Model {
  static entity = 'localidades'

  static fields () {
    return {
      id: this.attr(null),
      code: this.attr(''),
      description: this.attr(''),
      postoAdministrativo_id: this.attr(''),
      district_id: this.attr(''),

      // Relationshiops
      postoAdministrativo: this.belongsTo(PostoAdministrativo, 'postoAdministrativo_id'),
      district: this.belongsTo(District, 'district_id')
    }
  }

  static async apiGetAll (offset, max) {
    return await this.api().get('/localidade?offset=' + offset + '&max=' + max)
  }

  static async apiSave (localidade) {
    return await this.api().post('/localidade', localidade)
  }
}
