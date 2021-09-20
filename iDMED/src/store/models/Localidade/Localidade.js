import { Model } from '@vuex-orm/core'
import PostoAdministrativo from '../PostoAdministrativo/PostoAdministrativo'

export default class Localidade extends Model {
  static entity = 'localidades'

  static fields () {
    return {
      id: this.attr(null),
      code: this.attr(''),
      description: this.attr(''),
      postosAdministrativo_id: this.attr(''),

      // Relationshiops
      province: this.belongsTo(PostoAdministrativo, 'postosAdministrativo_id')
    }
  }
}
