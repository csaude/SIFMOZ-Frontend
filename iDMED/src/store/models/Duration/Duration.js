import { Model } from '@vuex-orm/core'
import Prescription from '../prescription/Prescription'
import db from 'src/store/localbase'
import { v4 as uuidv4 } from 'uuid'
import { nSQL } from 'nano-sql'

export default class Duration extends Model {
  static entity = 'durations'

  static fields () {
    return {
      id: this.uid(() => uuidv4()),
      weeks: this.number(''),
      description: this.attr(''),
      prescriptions: this.hasMany(Prescription, 'duration_id')
    }
  }

  static async apiGetAll (offset, max) {
    return await this.api().get('/duration?offset=0&max=100')
  }

  static async apiFetchById (id) {
    return await this.api().get(`/duration/${id}`)
  }

  static localDbAdd (duration) {
    return nSQL(this.entity).query('upsert',
    duration
     ).exec().then(
    Duration.insertOrUpdate({ data: duration })
     )
  }

  static localDbGetById (id) {
    return db.newDb().collection('durations').doc({ id: id }).get()
  }

  static localDbGetAll () {
    return nSQL(this.entity).query('select').exec().then(result => {
      console.log(result)
      Duration.insertOrUpdate({ data: result })
      //  return result
      })
  }

  static localDbUpdate (duration) {
    return db.newDb().collection('durations').doc({ id: duration.id }).set(duration)
  }

  static localDbUpdateAll (durations) {
    return db.newDb().collection('durations').set(durations)
  }

  static localDbDelete (duration) {
    return db.newDb().collection('durations').doc({ id: duration.id }).delete()
  }

  static localDbDeleteAll () {
    return db.newDb().collection('durations').delete()
  }
}
