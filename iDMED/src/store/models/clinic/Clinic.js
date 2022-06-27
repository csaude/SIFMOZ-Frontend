import { Model } from '@vuex-orm/core'
import ClinicSector from '../clinicSector/ClinicSector'
import District from '../district/District'
import NationalClinic from '../nationalClinic/NationalClinic'
import Patient from '../patient/Patient'
import Province from '../province/Province'
import FacilityType from '../facilityType/FacilityType'

export default class Clinic extends Model {
  static entity = 'clinics'

  static fields () {
    return {
      id: this.attr(null),
      code: this.attr(''),
      notes: this.attr(''),
      telephone: this.attr(''),
      clinicName: this.attr(''),
      mainClinic: this.attr(''),
      province_id: this.attr(''),
      district_id: this.attr(''),
      nationalClinic_id: this.attr(''),
      active: this.attr(''),
      facilityTypeId: this.attr(''),
      // Relationships
      facilityType: this.belongsTo(FacilityType, 'facilityTypeId'),
      province: this.belongsTo(Province, 'province_id'),
      district: this.belongsTo(District, 'district_id'),
      nationalClinic: this.belongsTo(NationalClinic, 'nationalClinic_id'),
      sectors: this.hasMany(ClinicSector, 'clinic_id'),
      patients: this.hasMany(Patient, 'patients')

    }
  }

  static apiFetchById (id) {
    return this.api().get(`/clinic/${id}`)
  }

  static async apiGetAll (offset, max) {
    return await this.api().get('/clinic?offset=' + offset + '&max=' + max)
  }

  static async apiSave (clinic) {
    return await this.api().post('/clinic', clinic)
  }
}
