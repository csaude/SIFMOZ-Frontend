import { Model } from '@vuex-orm/core'
import PatientTransReference from './PatientTransReference'

export default class PatientTransReferenceType extends Model {
  static entity = 'patientTransReferenceTypes'

  static fields () {
    return {
      id: this.attr(null),
      code: this.attr(''),
      description: this.attr(''),
      // relationships
      patientTransReferences: this.hasMany(PatientTransReference, 'patientTransReferenceTypeId')
    }
  }

  static async apiGetAll (offset, max) {
    return await this.api().get('/patientTransReferenceType?offset=' + offset + '&max=' + max)
  }
}
