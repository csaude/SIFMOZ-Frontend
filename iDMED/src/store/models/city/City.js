import { Model } from '@vuex-orm/core'
import Province from 'src/store/models/province/Province'
import { v4 as uuidv4 } from 'uuid'
export default class City extends Model {
  static entity = 'cities'

  static fields () {
    return {
      id: this.uid(() => uuidv4()),
      description: this.attr(''),
      code: this.attr(''),
      province_id: this.attr(''),

      // Relationshiops
      provincia: this.belongsTo(Province, 'province_id')
    }
  }
}
