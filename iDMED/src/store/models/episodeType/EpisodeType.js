import { Model } from '@vuex-orm/core'
import db from 'src/store/localbase'
import { v4 as uuidv4 } from 'uuid'
import { nSQL } from 'nano-sql'

export default class EpisodeType extends Model {
  static entity = 'episodeTypes'

  static fields () {
    return {
      id: this.uid(() => uuidv4()),
      code: this.attr(''),
      description: this.attr('')

    }
  }

  static async apiGetAll (offset, max) {
    return await this.api().get('/episodeType?offset=' + offset + '&max=' + max)
  }

  static async apiFetchById (id) {
    return await this.api().get(`/episodeType/${id}`)
  }

  static localDbAdd (episodeType) {
    return nSQL(this.entity).query('upsert',
    episodeType
     ).exec().then(
      EpisodeType.insertOrUpdate({ data: episodeType })
     )
  }

  static localDbGetById (id) {
    return db.newDb().collection('episodeTypes').doc({ id: id }).get()
  }

  static localDbGetAll () {
    return nSQL(this.entity).query('select').exec().then(result => {
      console.log(result)
      EpisodeType.insertOrUpdate({ data: result })
      })
  }

  static localDbUpdate (episodeType) {
    return db.newDb().collection('episodeTypes').doc({ id: episodeType.id }).set(episodeType)
  }

  static localDbUpdateAll (episodeTypes) {
    return db.newDb().collection('episodeTypes').set(episodeTypes)
  }

  static localDbDelete (episodeType) {
    return db.newDb().collection('episodeTypes').doc({ id: episodeType.id }).delete()
  }

  static localDbDeleteAll () {
    return db.newDb().collection('episodeTypes').delete()
  }
}
