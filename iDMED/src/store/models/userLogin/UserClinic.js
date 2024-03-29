import { Model } from '@vuex-orm/core'

export default class UserClinics extends Model {
    static entity = 'userClinics'
     static primaryKey = ['user_id', 'clinic_id']

    static fields () {
      return {
        user_id: this.attr(null),
        clinic_id: this.attr(null)
      }
    }
  }
