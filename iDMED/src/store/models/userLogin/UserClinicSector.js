import { Model } from '@vuex-orm/core'

export default class UserClinicSectors extends Model {
    static entity = 'userClinicSectors'
     static primaryKey = ['user_id', 'clinic_sector_id']

    static fields () {
      return {
        user_id: this.attr(null),
        clinic_sector_id: this.attr(null)
      }
    }
  }
