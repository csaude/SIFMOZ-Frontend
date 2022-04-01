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
      localidades: this.hasMany(Localidade, 'postoAdministrativo_id')
    }
  }

  static async apiGetAll (offset, max) {
    return await this.api().get('/postoAdministrativo?offset=' + offset + '&max=' + max)
  }

  static async apiSave (postoAdministrativo) {
    return await this.api().post('/postoAdministrativo', postoAdministrativo)
  }
}
