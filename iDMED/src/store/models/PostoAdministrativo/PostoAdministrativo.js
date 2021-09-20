import { Model } from '@vuex-orm/core'
import District from '../district/District'
import Localidade from '../Localidade/Localidade'

export default class PostoAdministrativo extends Model {
  static entity = 'postoAdministrativos'

  static fields () {
    return {
      id: this.attr(null),
      code: this.attr(''),
      description: this.attr(''),
      district_id: this.attr(''),

      // Relationshiops
      district: this.belongsTo(District, 'district_id'),
      localidades: this.hasMany(Localidade, 'postosAdministrativo_id')
    }
  }
}
