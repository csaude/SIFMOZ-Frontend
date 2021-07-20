import { Model } from '@vuex-orm/core'
import Prescription from '../prescription/Prescription'

export default class Doctor extends Model {
    static entity = 'doctors'
    static fields () {
      return {
        id: this.attr(null),
        firstnames: this.attr(''),
        lastname: this.attr(''),
        gender: this.attr(''),
        dateofbirth: this.attr(''),
        telephone: this.attr(''),
        email: this.attr(''),
        category: this.attr(''),
        active: this.attr(''),

        // Relationships
        prescriptions: this.hasMany(Prescription, 'prescription_id')
      }
    }
}
