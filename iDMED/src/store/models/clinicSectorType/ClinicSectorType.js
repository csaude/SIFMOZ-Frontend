import { Model } from '@vuex-orm/core'
import ClinicSector from '../clinicSector/ClinicSector'

export default class ClinicSectorType extends Model {
  static entity = 'clinicSectorTypes'

  static fields () {
    return {
      id: this.attr(null),
      code: this.attr(''),
      description: this.attr(''),
      clinicSectorList: this.hasMany(ClinicSector, 'clinic_sector_type_id')

    }
  }

  static async apiGetAll (offset, max) {
    return await this.api().get('/clinicSectorType?offset=' + offset + '&max=' + max)
  }

  static async apiFetchById (id) {
    return await this.api().get(`/clinicSectorType/${id}`)
  }
}
