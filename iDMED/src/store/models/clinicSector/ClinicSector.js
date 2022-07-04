import { Model } from '@vuex-orm/core'
import Clinic from '../clinic/Clinic'
import ClinicSectorType from '../clinicSectorType/ClinicSectorType'

export default class ClinicSector extends Model {
  static entity = 'clinicSectors'

  static fields () {
    return {
      id: this.attr(null),
      code: this.attr(''),
      description: this.attr(''),
      active: this.attr(''),
      uuid: this.attr(''),
      clinic_id: this.attr(''),
      clinic_sector_type_id: this.attr(''),
      // Relationships
      clinic: this.belongsTo(Clinic, 'clinic_id'),
      clinicSectorType: this.belongsTo(ClinicSectorType, 'clinic_sector_type_id')

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
