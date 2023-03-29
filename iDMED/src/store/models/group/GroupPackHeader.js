import { Model } from '@vuex-orm/core'
import Duration from '../Duration/Duration'
import Group from './Group'
import GroupPack from './GroupPack'
import db from 'src/store/localbase'
import { v4 as uuidv4 } from 'uuid'
import { nSQL } from 'nano-sql'

export default class GroupPackHeader extends Model {
  static entity = 'groupPackHeaders'

  static fields () {
    return {
      id: this.uid(() => uuidv4()),
      packDate: this.attr(''),
      nextPickUpDate: this.attr(''),
      isLast: this.boolean(false),
      duration_id: this.attr(''),
      group_id: this.attr(''),
      syncStatus: this.attr(''),
      // Relationships
      duration: this.belongsTo(Duration, 'duration_id'),
      group: this.belongsTo(Group, 'group_id'),
      groupPacks: this.hasMany(GroupPack, 'header_id')

    }
  }

  static async apiFetchById (id) {
    return await this.api().get(`/groupPackHeader/${id}`)
  }

  static async apiSave (groupPackHeader) {
    return await this.api().post('/groupPackHeader', groupPackHeader)
  }

  static async apiUpdate (groupPackHeader) {
    return await this.api().post('/groupPackHeader', groupPackHeader)
  }

  static async apiDelete (groupPackHeader) {
    return await this.api().delete(`/groupPackHeader/${groupPackHeader.id}`)
  }

  static localDbAdd (groupPackHeader) {
    return nSQL(this.entity).query('upsert',
    groupPackHeader
   ).exec().then(result => {
    GroupPackHeader.insertOrUpdate({ data: groupPackHeader })
     })
  }

  static localDbGetById (id) {
    return db.newDb().collection('groupPackHeaders').doc({ id: id }).get()
  }

  static localDbGetAll () {
    return nSQL(this.entity).query('select').exec().then(result => {
      GroupPackHeader.insertOrUpdate({ data: result })
        })
  }

  static localDbUpdate (groupPackHeader) {
    return db.newDb().collection('groupPackHeaders').doc({ id: groupPackHeader.id }).set(groupPackHeader)
  }

  static localDbUpdateAll (groupPackHeaders) {
    return db.newDb().collection('groupPackHeaders').set(groupPackHeaders)
  }

  static localDbDelete (groupPackHeader) {
    return db.newDb().collection('groupPackHeaders').doc({ id: groupPackHeader.id }).delete()
  }

  static localDbDeleteAll () {
    return db.newDb().collection('groupPackHeaders').delete()
  }

  static async localDbGetBySyncStatusToSychronize () {
    return nSQL(this.entity).query('select').where([['syncStatus', '=', 'R'], 'OR', ['syncStatus', '=', 'U']]).exec().then(result => {
      return result
        })
    }
}
