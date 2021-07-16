import { Model } from '@vuex-orm/core'
import Clinic from '../clinic/Clinic'
import FacilityType from '../facilityType/FacilityType'
import Province from '../province/Province'

export default class NationalClinic extends Model {
  static entity = 'nationalClinics'

  static fields () {
    return {
      id: this.attr(null),
      code: this.attr(''),
      telephone: this.attr(''),
      facilityName: this.attr(''),
      province_id: this.attr(''),
      facilityType_id: this.attr(''),
      // Relationships
      province: this.belongsTo(Province, 'province_id'),
      facilityType: this.belongsTo(FacilityType, 'facilityType_id'),
      clinics: this.hasMany(Clinic, 'nationalClinic_id')

    }
  }
}
