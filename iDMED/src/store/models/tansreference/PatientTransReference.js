import { Model } from '@vuex-orm/core'
import PatientTransReferenceType from './PatientTransReferenceType'
import Clinic from '../clinic/Clinic'
import Patient from '../patient/Patient'
import PatientServiceIdentifier from '../patientServiceIdentifier/PatientServiceIdentifier'

export default class PatientTransReference extends Model {
  static entity = 'patientTransReferences'

  static fields () {
    return {
      id: this.attr(null),
      syncStatus: this.attr(''),
      operationDate: this.attr(''),
      creationDate: this.attr(''),
      patientTransReferenceTypeId: this.attr(''),
      originId: this.attr(''),
      destination: this.attr(''),
      identifierId: this.attr(''),
      patientId: this.attr(''),

      // Relationshiops
      operationType: this.belongsTo(PatientTransReferenceType, 'patientTransReferenceTypeId'),
      origin: this.belongsTo(Clinic, 'originId'),
      identifier: this.belongsTo(PatientServiceIdentifier, 'identifierId'),
      patient: this.belongsTo(Patient, 'patientId')
    }
  }

  static async apiGetAll (offset, max) {
    return await this.api().get('/patientTransReference?offset=' + offset + '&max=' + max)
  }

  static async apiSave (transReference) {
    return await this.api().post('/patientTransReference', transReference)
  }

  static async apiRemove (transReference) {
    return await this.api().delete(`/patientTransReference/${transReference.id}`)
  }

  static async apiFetchById (id) {
    return await this.api().get(`/patientTransReference/${id}`)
  }
}
