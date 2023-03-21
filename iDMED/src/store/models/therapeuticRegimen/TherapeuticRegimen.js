import { Model } from '@vuex-orm/core'
import ClinicalService from '../ClinicalService/ClinicalService'
import Drug from '../drug/Drug'
import PrescriptionDetail from '../prescriptionDetails/PrescriptionDetail'
import ThrapeuticRegimensDrug from '../TherapeuticRegimensDrug/TherapeuticRegimensDrug'
import db from 'src/store/localbase'
import { v4 as uuidv4 } from 'uuid'
import { nSQL } from 'nano-sql'

export default class TherapeuticRegimen extends Model {
  static entity = 'therapeuticRegimens'

  static fields () {
    return {
      id: this.uid(() => uuidv4()),
      regimenScheme: this.attr(''),
      active: this.boolean(''),
      code: this.attr(''),
     // pedhiatric: this.attr(''),
      description: this.attr(''),
      clinical_service_id: this.attr(''),
      syncStatus: this.attr(''),

      // Relationships
      prescriptionDetails: this.hasMany(PrescriptionDetail, 'therapeutic_regimen_id'),
     // drugs: this.hasMany(Drug, 'therapeutic_regimen_id'),
       drugs: this.belongsToMany(Drug, ThrapeuticRegimensDrug, 'therapeutic_regimen_id', 'drug_id'),
      clinicalService: this.belongsTo(ClinicalService, 'clinical_service_id')
    }
  }

  static async apiGetAll (offset, max) {
    return await this.api().get('/therapeuticRegimen?offset=' + offset + '&max=' + max)
  }

  static async apiFetchById (id) {
    return await this.api().get(`/therapeuticRegimen/${id}`)
  }

  static async apiSave (therapeuticRegimen) {
    return await this.api().post('/therapeuticRegimen', therapeuticRegimen)
  }

  static async apiUpdate (therapeuticRegimen) {
    return await this.api().patch('/therapeuticRegimen/' + therapeuticRegimen.id, therapeuticRegimen)
  }

  static localDbAdd (therapeuticRegimen) {
    return nSQL(this.entity).query('upsert',
    therapeuticRegimen
     ).exec().then(
      TherapeuticRegimen.insertOrUpdate({ data: therapeuticRegimen })
     )
  }

  static localDbGetById (id) {
    return db.newDb().collection('therapeuticRegimens').doc({ id: id }).get()
  }

  static localDbGetAll () {
    return nSQL(this.entity).query('select').exec().then(result => {
      console.log(result)
      TherapeuticRegimen.insert({ data: result })
      })
  }

  static localDbUpdate (therapeuticRegimen) {
    return db.newDb().collection('therapeuticRegimens').doc({ id: therapeuticRegimen.id }).set(therapeuticRegimen)
  }

  static localDbUpdateAll (therapeuticRegimens) {
    return db.newDb().collection('therapeuticRegimens').set(therapeuticRegimens)
  }

  static localDbDelete (therapeuticRegimen) {
    return db.newDb().collection('therapeuticRegimens').doc({ id: therapeuticRegimen.id }).delete()
  }

  static localDbDeleteAll () {
    return db.newDb().collection('therapeuticRegimens').delete()
  }
}
