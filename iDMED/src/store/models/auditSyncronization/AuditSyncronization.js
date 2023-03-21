import { Model } from '@vuex-orm/core'
import db from 'src/store/localbase'
import { v4 as uuidv4 } from 'uuid'
import { nSQL } from 'nano-sql'

export default class AuditSyncronization extends Model {
  static entity = 'auditSyncronization'

  static fields () {
    return {
      id: this.uid(() => uuidv4()),
      operationType: this.attr(''),
      username: this.attr(() => localStorage.getItem('user')),
      className: this.attr(''),
      syncStatus: this.attr(''), // 'D -deleted, S sent'
      entity: this.attr(null)
    }
  }

  static localDbAdd (auditSyncronization) {
    return db.newDb().collection('auditSyncronization').add(auditSyncronization)
  }

  static localDbGetAll () {
    return db.newDb().collection('auditSyncronization').get()
  }

  static localDbUpdate (auditSyncronization) {
    return db.newDb().collection('auditSyncronization').doc({ id: auditSyncronization.id }).set(auditSyncronization)
  }

  static localDbDelete (auditSyncronization) {
    return db.newDb().collection('auditSyncronization').doc({ id: auditSyncronization.id }).delete()
  }

  static localDbGetBySyncStatus (syncStatus) {
    return db.newDb().collection('auditSyncronization').doc({ syncStatus: syncStatus }).get()
  }

  static localDbDeleteAll () {
    return db.newDb().collection('auditSyncronization').delete()
  }

  static async apiSyncDeletedRecords (lista) {
      lista.forEach(item => {
        this.api().delete(`/${item.className}/${item.entity.id}`).then(resp => {
          console.log('Resposta: ', resp)
        })
      })
  }

  static localDbAddOrUpdate (targetCopy) {
      nSQL('auditSyncronization').query('upsert',
      targetCopy
    ).exec()
    AuditSyncronization.insert({ data: targetCopy })
  }
}
