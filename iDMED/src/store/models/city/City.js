import { Model } from '@vuex-orm/core'
import Province from 'src/store/models/province/Province'

export default class City extends Model {
  static entity = 'cities'

  static fields () {
    return {
      id: this.attr(null),
      description: this.attr(''),
      code: this.attr(''),
      province_id: this.attr(''),

      // Relationshiops
      provincia: this.belongsTo(Province, 'province_id')
    }
  }
}
