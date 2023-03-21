import { Model } from '@vuex-orm/core'
import ClinicalServiceAttribute from '../ClinicalServiceAttribute/ClinicalServiceAttribute'
// import TherapeuticRegimen from '../therapeuticRegimen/TherapeuticRegimen'
import IdentifierType from '../identifierType/IdentifierType'
import ClinicSector from '../clinicSector/ClinicSector'
import ClinicalServiceSector from '../ClinicalServiceClinicSector/ClinicalServiceSector'
// import Group from '../group/Group'
// import PatientServiceIdentifier from '../patientServiceIdentifier/PatientServiceIdentifier'
import db from 'src/store/localbase'
import { v4 as uuidv4 } from 'uuid'
import Drug from '../drug/Drug'
import { nSQL } from 'nano-sql'

export default class ClinicalService extends Model {
  static entity = 'clinicalServices'

  static fields () {
    return {
      id: this.uid(() => uuidv4()),
      code: this.attr(''),
      description: this.attr(''),
      identifier_type_id: this.attr(''),
      active: this.attr(''),
      syncStatus: this.attr(''),
     // therapeuticRegimens: this.attr(''),

      identifierType: this.belongsTo(IdentifierType, 'identifier_type_id'),
      attributes: this.hasMany(ClinicalServiceAttribute, 'service_id'),
      clinicSectors: this.belongsToMany(ClinicSector, ClinicalServiceSector, 'clinical_service_id', 'clinic_sector_id'),
      drugs: this.hasMany(Drug, 'clinical_service_id')
      // patientServiceIdentifiers: this.hasMany(PatientServiceIdentifier, 'service_id')
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

  static async apiUpdate (clinicalService) {
    return await this.api().patch('/clinicalService/' + clinicalService.id, clinicalService)
  }

  static localDbAdd (clinicalService) {
    return nSQL(this.entity).query('upsert',
    clinicalService
     ).exec().then(
      ClinicalService.insertOrUpdate({ data: clinicalService })
     )
  }

  static localDbGetById (id) {
    return db.newDb().collection('clinicalServices').doc({ id: id }).get()
  }

  static localDbGetAll () {
    return nSQL(this.entity).query('select').exec().then(result => {
      console.log(result)
      ClinicalService.insertOrUpdate({ data: result })
      })
  }

  static localDbUpdate (clinicalService) {
    return db.newDb().collection('clinicalServices').doc({ id: clinicalService.id }).set(clinicalService)
  }

  static localDbUpdateAll (clinicalServices) {
    return db.newDb().collection('clinicalServices').set(clinicalServices)
  }

  static localDbDelete (clinicalService) {
    return db.newDb().collection('clinicalServices').doc({ id: clinicalService.id }).delete()
  }

  static localDbDeleteAll () {
    return db.newDb().collection('clinicalServices').delete()
  }
}
