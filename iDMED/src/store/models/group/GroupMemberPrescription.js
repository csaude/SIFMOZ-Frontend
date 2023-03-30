import { Model } from '@vuex-orm/core'
import GroupMember from '../groupMember/GroupMember'
import Prescription from '../prescription/Prescription'
import db from 'src/store/localbase'
import { v4 as uuidv4 } from 'uuid'
import { nSQL } from 'nano-sql'

export default class GroupMemberPrescription extends Model {
  static entity = 'groupMemberPrescriptions'

  static fields () {
    return {
      id: this.uid(() => uuidv4()),
      prescription_id: this.attr(''),
      member_id: this.attr(''),
      used: this.boolean(false),
      syncStatus: this.attr(''),
      // Relationships
      member: this.belongsTo(GroupMember, 'member_id'),
      prescription: this.belongsTo(Prescription, 'prescription_id')
    }
  }

  static async apiFetchById (id) {
    return await this.api().get(`/groupMemberPrescription/${id}`)
  }

  static async apiFetchByMemberId (id) {
    return await this.api().get(`/groupMemberPrescription/member/${id}`)
  }

  static async apiSave (groupMemberPrescription) {
    return await this.api().post('/groupMemberPrescription', groupMemberPrescription)
  }

  static async apiUpdate (groupMemberPrescription) {
    return await this.api().post('/groupMemberPrescription', groupMemberPrescription)
  }

  static localDbAdd (groupMemberPrescription) {
    return nSQL(this.entity).query('upsert',
    groupMemberPrescription
   ).exec().then(result => {
     GroupMemberPrescription.insertOrUpdate({ data: groupMemberPrescription })
     })
  }

  static localDbGetById (id) {
    return nSQL(this.entity).query('select').where([['id', '=', id]]).exec().then(result => {
      return result
        })
  }

  static localDbGetAll () {
    return nSQL(this.entity).query('select').exec().then(result => {
      GroupMemberPrescription.insertOrUpdate({ data: result })
        })
  }

  static localDbUpdate (groupMemberPrescription) {
    return db.newDb().collection('groupMemberPrescriptions').doc({ id: groupMemberPrescription.id }).set(groupMemberPrescription)
  }

  static localDbUpdateAll (groupMemberPrescriptions) {
    return db.newDb().collection('groupMemberPrescriptions').set(groupMemberPrescriptions)
  }

  static localDbDelete (groupMemberPrescription) {
    return db.newDb().collection('groupMemberPrescriptions').doc({ id: groupMemberPrescription.id }).delete()
  }

  static localDbDeleteAll () {
    return db.newDb().collection('groupMemberPrescriptions').delete()
  }

  static async localDbGetBySyncStatusToSychronize () {
    return nSQL(this.entity).query('select').where([['syncStatus', '=', 'R'], 'OR', ['syncStatus', '=', 'U']]).exec().then(result => {
      return result
        })
    }
}
