import { Model } from '@vuex-orm/core'
import Group from '../group/Group'
import db from 'src/store/localbase'
import { v4 as uuidv4 } from 'uuid'
import { nSQL } from 'nano-sql'

export default class GroupType extends Model {
  static entity = 'groupTypes'

  static fields () {
    return {
      id: this.uid(() => uuidv4()),
      code: this.attr(''),
      description: this.attr(''),
      syncStatus: this.attr(''),
      groups: this.hasMany(Group, 'groupType_id')
    }
  }

  static async apiGetAll () {
    return await this.api().get('/groupType')
  }

  static localDbAdd (groupType) {
    return nSQL(this.entity).query('upsert',
    groupType
       ).exec().then(
        GroupType.insertOrUpdate({ data: groupType })
       )
  }

  static localDbGetById (id) {
    return db.newDb().collection('groupTypes').doc({ id: id }).get()
  }

  static localDbGetAll () {
    return nSQL(this.entity).query('select').exec().then(result => {
      console.log(result)
      GroupType.insertOrUpdate({ data: result })
      })
  }

  static localDbUpdate (groupType) {
    return db.newDb().collection('groupTypes').doc({ id: groupType.id }).set(groupType)
  }

  static localDbUpdateAll (groupTypes) {
    return db.newDb().collection('groupTypes').set(groupTypes)
  }

  static localDbDelete (groupType) {
    return db.newDb().collection('groupTypes').doc({ id: groupType.id }).delete()
  }

  static localDbDeleteAll () {
    return db.newDb().collection('groupTypes').delete()
  }
}
