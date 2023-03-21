import { Model } from '@vuex-orm/core'
import PatientTransReference from './PatientTransReference'
import db from 'src/store/localbase'
import { v4 as uuidv4 } from 'uuid'
import { nSQL } from 'nano-sql'

export default class PatientTransReferenceType extends Model {
  static entity = 'patientTransReferenceTypes'

  static fields () {
    return {
      id: this.uid(() => uuidv4()),
      code: this.attr(''),
      description: this.attr(''),
      syncStatus: this.attr(''),
      // relationships
      patientTransReferences: this.hasMany(PatientTransReference, 'patientTransReferenceTypeId')
    }
  }

  static async apiGetAll (offset, max) {
    return await this.api().get('/patientTransReferenceType?offset=' + offset + '&max=' + max)
  }

  static localDbAdd (patientTransReferenceType) {
    return nSQL(this.entity).query('upsert',
    patientTransReferenceType
       ).exec().then(
        PatientTransReferenceType.insertOrUpdate({ data: patientTransReferenceType })
       )
  }

  static localDbGetById (id) {
    return db.newDb().collection('patientTransReferenceTypes').doc({ id: id }).get()
  }

  static localDbGetAll () {
    return nSQL(this.entity).query('select').exec().then(result => {
      console.log(result)
      PatientTransReferenceType.insertOrUpdate({ data: result })
      })
  }

  static localDbUpdate (patientTransReferenceType) {
    return db.newDb().collection('patientTransReferenceTypes').doc({ id: patientTransReferenceType.id }).set(patientTransReferenceType)
  }

  static localDbUpdateAll (patientTransReferenceTypes) {
    return db.newDb().collection('patientTransReferenceTypes').set(patientTransReferenceTypes)
  }

  static localDbDelete (patientTransReferenceType) {
    return db.newDb().collection('patientTransReferenceTypes').doc({ id: patientTransReferenceType.id }).delete()
  }

  static localDbDeleteAll () {
    return db.newDb().collection('patientTransReferenceTypes').delete()
  }
}
