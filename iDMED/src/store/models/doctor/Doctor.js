import { Model } from '@vuex-orm/core'
import Clinic from '../clinic/Clinic'
import Prescription from '../prescription/Prescription'

export default class Doctor extends Model {
    static entity = 'doctors'

    get fullName () {
      return `${this.firstnames} ${this.lastname}`
    }

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
        active: this.boolean(true),
        clinic_id: this.attr(''),

        // Relationships
        clinic: this.belongsTo(Clinic, 'clinic_id'),
        prescriptions: this.hasMany(Prescription, 'prescription_id')
      }
    }

    static async apiGetAll () {
      return await this.api().get('/doctor')
    }

    static async apiFetchById (id) {
      return await this.api().get(`/doctor/${id}`)
    }

    static async apiFetchByClinicId (clinicId) {
      return await this.api().get('/doctor/clinic/' + clinicId)
    }
}
