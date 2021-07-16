import { Model } from '@vuex-orm/core'
import AttributeType from '../attributeType/AttributeType'
import Patient from '../patient/Patient'

export default class PatientAttribute extends Model {
  static entity = 'attributes'

  static fields () {
    return {
      id: this.attr(null),
      attributeType_id: this.attr(''),
      value: this.attr(''),
      patient_id: this.attr(''),
      // Relationships
      patient: this.belongsTo(Patient, 'patient_id'),
      attributeType: this.belongsTo(AttributeType, 'attributeType_id')

    }
  }
}
