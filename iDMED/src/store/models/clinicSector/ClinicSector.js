import { Model } from '@vuex-orm/core'
import Clinic from '../clinic/Clinic'

export default class ClinicSector extends Model {
  static entity = 'clinicSectors'

  static fields () {
    return {
      id: this.attr(null),
      code: this.attr(''),
      description: this.attr(''),
      clinic_id: this.attr(''),
      // Relationships
      clinic: this.belongsTo(Clinic, 'clinic_id')

    }
  }
}
