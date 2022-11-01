import { Model } from '@vuex-orm/core'
import ClinicSector from '../clinicSector/ClinicSector'
import db from 'src/store/localbase'

export default class ClinicSectorType extends Model {
  static entity = 'clinicSectorTypes'

  static fields () {
    return {
      id: this.attr(null),
      code: this.attr(''),
      description: this.attr(''),
      syncStatus: this.attr(''),
      clinicSectorList: this.hasMany(ClinicSector, 'clinic_sector_type_id')

    }
  }

  static async apiGetAll (offset, max) {
    return await this.api().get('/clinicSectorType?offset=' + offset + '&max=' + max)
  }

  static async apiFetchById (id) {
    return await this.api().get(`/clinicSectorType/${id}`)
  }

  static localDbAdd (clinicSectorType) {
    return db.newDb().collection('clinicSectorTypes').add(clinicSectorType)
  }

  static localDbGetById (id) {
    return db.newDb().collection('clinicSectorTypes').doc({ id: id }).get()
  }

  static localDbGetAll () {
    return db.newDb().collection('clinicSectorTypes').get()
  }

  static localDbUpdate (clinicSectorType) {
    return db.newDb().collection('clinicSectorTypes').doc({ id: clinicSectorType.id }).set(clinicSectorType)
  }

  static localDbUpdateAll (clinicSectorTypes) {
    return db.newDb().collection('clinicSectorTypes').set(clinicSectorTypes)
  }

  static localDbDelete (clinicSectorType) {
    return db.newDb().collection('clinicSectorTypes').doc({ id: clinicSectorType.id }).delete()
  }

  static localDbDeleteAll () {
    return db.newDb().collection('clinicSectorTypes').delete()
  }
}
