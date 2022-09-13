import { Model } from '@vuex-orm/core'
import ClinicalServiceAttribute from '../ClinicalServiceAttribute/ClinicalServiceAttribute'
import TherapeuticRegimen from '../therapeuticRegimen/TherapeuticRegimen'
import IdentifierType from '../identifierType/IdentifierType'
import ClinicSector from '../clinicSector/ClinicSector'
import ClinicalServiceSector from '../ClinicalServiceClinicSector/ClinicalServiceSector'
import Group from '../group/Group'
import PatientServiceIdentifier from '../patientServiceIdentifier/PatientServiceIdentifier'

export default class ClinicalService extends Model {
  static entity = 'clinicalServices'

  static fields () {
    return {
      id: this.attr(null),
      code: this.attr(''),
      description: this.attr(''),
      identifier_type_id: this.attr(''),
      active: this.attr(''),

      identifierType: this.belongsTo(IdentifierType, 'identifier_type_id'),
      attributes: this.hasMany(ClinicalServiceAttribute, 'service_id'),
      therapeuticRegimens: this.hasMany(TherapeuticRegimen, 'clinical_service_id'),
      clinicSectors: this.belongsToMany(ClinicSector, ClinicalServiceSector, 'clinical_service_id', 'clinic_sector_id'),
      groups: this.hasMany(Group, 'clinical_service_id'),
      patientServiceIdentifiers: this.hasMany(PatientServiceIdentifier, 'service_id')
    }
  }

  static async apiGetAll (offset, max) {
    return await this.api().get('/clinicalService?offset=0&max=100')
  }

  static async apiFetchById (id) {
    return await this.api().get(`/clinicalService/${id}`)
  }

  static async apiSave (clinicalService) {
    return await this.api().post('/clinicalService', clinicalService)
  }
}
