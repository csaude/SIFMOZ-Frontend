import { Model } from '@vuex-orm/core'
import Province from 'src/store/models/province/Province'

export default class Country extends Model {
  static entity = 'countries'

  static fields () {
    return {
      id: this.attr(null),
      description: this.attr(''),
      nacionality: this.attr(''),
      code: this.attr(''),

      // Relationshiops
      provinces: this.hasMany(Province, 'country_id')
    }
  }
}
