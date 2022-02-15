import { Model } from '@vuex-orm/core'
import Clinic from '../clinic/Clinic'

export default class ClinicSector extends Model {
  static entity = 'clinicSectors'

  static fields () {
    return {
      id: this.attr(null),
      code: this.attr(''),
      description: this.attr(''),
      active: this.attr(''),
      clinic_id: this.attr(''),
      // Relationships
      clinic: this.belongsTo(Clinic, 'clinic_id')

    }
  }

  static async apiGetAll (offset, max) {
    return await this.api().get('/clinicSector?offset=' + offset + '&max=' + max)
  }

  static async apiFetchById (id) {
    return await this.api().get(`/clinicSector/${id}`)
  }

  static async apiSave (clinicSector) {
    return await this.api().post('/clinicSector', clinicSector)
  }

  static async apiGetAllByClinicId (clinicId, offset, max) {
    return await this.api().get('/clinicSector/clinic/' + clinicId + '?offset=' + offset + '&max=' + max)
  }
}
