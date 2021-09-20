import { Model } from '@vuex-orm/core'
import Episode from '../episode/Episode'
import IdentifierType from '../identifierType/IdentifierType'
import Patient from '../patient/Patient'
import ClinicalService from '../ClinicalService/ClinicalService'

export default class PatientServiceIdentifier extends Model {
  static entity = 'identifiers'

  static fields () {
    return {
      id: this.attr(null),
      startDate: this.attr(''),
      endDate: this.attr(''),
      reopenDate: this.attr(''),
      value: this.attr(''),
      prefered: this.attr(''),
      identifier_type_id: this.attr(''),
      clinical_service_id: this.attr(''),
      patient_id: this.attr(''),
      // Relationships
      identifierType: this.belongsTo(IdentifierType, 'identifier_type_id'),
      clinicalService: this.belongsTo(ClinicalService, 'program_id'),
      patient: this.belongsTo(Patient, 'patient_id'),
      episodes: this.hasMany(Episode, 'patientProgramIdentifier_id')

    }
  }
}
