import { Model } from '@vuex-orm/core'
import db from 'src/store/localbase'
import { nSQL } from 'nano-sql'

export default class ProvincialServer extends Model {
  static entity = 'provincialServers'

  static fields () {
    return {
      id: this.attr(null),
      urlPath: this.attr(''),
      code: this.attr(''),
      destination: this.attr(''),
      port: this.attr(''),
      username: this.attr(''),
      syncStatus: this.attr(''),
      password: this.attr('')
    }
  }

  static async apiFetchById (id) {
    return await this.api().get(`/provincialServer/${id}`)
  }

  static async apiGetAll () {
    return await this.api().get('/provincialServer')
  }

  static localDbAdd (provincialServer) {
    return nSQL(this.entity).query('upsert',
    provincialServer
       ).exec().then(
        ProvincialServer.insertOrUpdate({ data: provincialServer })
       )
  }

  static localDbGetById (id) {
    return db.newDb().collection('provincialServers').doc({ id: id }).get()
  }

  static localDbGetAll () {
    return nSQL(this.entity).query('select').exec().then(result => {
      console.log(result)
      ProvincialServer.insertOrUpdate({ data: result })
      })
  }

  static localDbUpdate (provincialServer) {
    return db.newDb().collection('provincialServers').doc({ id: provincialServer.id }).set(provincialServer)
  }

  static localDbUpdateAll (provincialServers) {
    return db.newDb().collection('provincialServers').set(provincialServers)
  }

  static localDbDelete (provincialServer) {
    return db.newDb().collection('provincialServers').doc({ id: provincialServer.id }).delete()
  }

  static localDbDeleteAll () {
    return db.newDb().collection('provincialServers').delete()
  }
}
