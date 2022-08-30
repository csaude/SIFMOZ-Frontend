import { Model } from '@vuex-orm/core'
import Province from 'src/store/models/province/Province'
import PostoAdministrativo from '../PostoAdministrativo/PostoAdministrativo'

export default class District extends Model {
  static entity = 'districts'

  static fields () {
    return {
      id: this.attr(null),
      code: this.attr(''),
      description: this.attr(''),
      province_id: this.attr(''),

      // Relationshiops
      province: this.belongsTo(Province, 'province_id'),
      postosAdministrativos: this.hasMany(PostoAdministrativo, 'district_id')
    }
  }

  static async apiGetAll (offset, max) {
    return await this.api().get('/district')
  }
}
