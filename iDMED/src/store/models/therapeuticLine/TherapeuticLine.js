import { Model } from '@vuex-orm/core'
import PrescriptionDetail from '../prescriptionDetails/PrescriptionDetail'
import db from 'src/store/localbase'
import { v4 as uuidv4 } from 'uuid'
import { nSQL } from 'nano-sql'

export default class TherapeuticLine extends Model {
  static entity = 'therapeuticLines'
  static fields () {
    return {
      id: this.uid(() => uuidv4()),
      code: this.attr(''),
      description: this.attr(''),
      syncStatus: this.attr(''),
      prescriptionDetails: this.hasMany(PrescriptionDetail, 'therapeutic_line_id')
    }
  }

  static async apiGetAll (offset, max) {
    return await this.api().get('/therapeuticLine?offset=0&max=100')
  }

  static async apiFetchById (id) {
    return await this.api().get(`/therapeuticLine/${id}`)
  }

  static localDbAdd (therapeuticLine) {
    return nSQL(this.entity).query('upsert',
    therapeuticLine
     ).exec().then(
      TherapeuticLine.insertOrUpdate({ data: therapeuticLine })
     )
  }

  static localDbGetById (id) {
    return db.newDb().collection('therapeuticLines').doc({ id: id }).get()
  }

  static localDbGetAll () {
    nSQL(this.entity).query('select').exec().then(result => {
      console.log(result)
      return TherapeuticLine.insertOrUpdate({ data: result })
      })
  }

  static localDbUpdate (therapeuticLine) {
    return db.newDb().collection('therapeuticLines').doc({ id: therapeuticLine.id }).set(therapeuticLine)
  }

  static localDbUpdateAll (therapeuticLines) {
    return db.newDb().collection('therapeuticLines').set(therapeuticLines)
  }

  static localDbDelete (therapeuticLine) {
    return db.newDb().collection('therapeuticLines').doc({ id: therapeuticLine.id }).delete()
  }

  static localDbDeleteAll () {
    return db.newDb().collection('therapeuticLines').delete()
  }
}
