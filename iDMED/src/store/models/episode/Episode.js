import { Model } from '@vuex-orm/core'
import Clinic from '../clinic/Clinic'
import ClinicSector from '../clinicSector/ClinicSector'
import EpisodeType from '../episodeType/EpisodeType'
import PatientServiceIdentifier from '../patientServiceIdentifier/PatientServiceIdentifier'
import PatientVisitDetails from '../patientVisitDetails/PatientVisitDetails'
import StartStopReason from '../startStopReason/StartStopReason'
import db from 'src/store/localbase'
import { v4 as uuidv4 } from 'uuid'
import { nSQL } from 'nano-sql'

export default class Episode extends Model {
  static entity = 'episodes'

  static fields () {
    return {
      id: this.uid(() => uuidv4()),
      episodeDate: this.attr(''),
      notes: this.attr(''),
      creationDate: this.attr(''),
      episodeType_id: this.attr(''),
      clinicSector_id: this.attr(''),
      patientServiceIdentifier_id: this.attr(''),
      startStopReason_id: this.attr(''),
      isLast: this.boolean(false),
      referralClinic_id: this.attr(''),
      syncStatus: this.attr(''),
      // Relationships
      referralClinic: this.belongsTo(Clinic, 'referralClinic_id'),
      startStopReason: this.belongsTo(StartStopReason, 'startStopReason_id'),
      episodeType: this.belongsTo(EpisodeType, 'episodeType_id'),
      clinicSector: this.belongsTo(ClinicSector, 'clinicSector_id'),
      patientServiceIdentifier: this.belongsTo(PatientServiceIdentifier, 'patientServiceIdentifier_id'),
      patientVisitDetails: this.hasMany(PatientVisitDetails, 'episode_id')
    }
  }

  closed () {
    if (this.episodeType === null) return false
    return this.episodeType.code === 'FIM'
  }

  isStartEpisode () {
    if (this.episodeType === null) return false
    return this.episodeType.code === 'INICIO'
  }

  isCloseEpisode () {
    if (this.episodeType === null) return false
    return this.episodeType.code === 'FIM'
  }

  isBackReferenceEpisode () {
    if (this.startStopReason === null || this.startStopReason === undefined) return false
    return this.startStopReason.code === 'VOLTOU_REFERENCIA'
  }

  isDCReferenceEpisode () {
    if (this.startStopReason === null || this.startStopReason === undefined) return false
    return this.startStopReason.code === 'REFERIDO_DC'
  }

  isReferenceEpisode () {
    if (this.startStopReason === null || this.startStopReason === undefined) return false
    return this.startStopReason.code === 'REFERIDO_PARA'
  }

  isReferenceOrTransferenceEpisode () {
    return this.isDCReferenceEpisode() || this.isTranferenceEpisode() || this.isReferenceEpisode()
  }

  isTranferenceEpisode () {
    if (this.startStopReason === null) return false
    return this.startStopReason.code === 'TRANSFERIDO_PARA'
  }

  hasVisits () {
    return this.patientVisitDetails.length > 0
  }

  lastVisit () {
    let lastVisit = null
    this.patientVisitDetails.forEach((visit) => {
      if (lastVisit === null) {
        lastVisit = visit
      } else if (visit.patientVisit.visitDate > lastVisit.patientVisit.visitDate) {
        lastVisit = visit
      }
    })
    return lastVisit
  }

  static async apiSave (episode, isNew) {
    if (isNew) {
      return await this.api().post('/episode', episode)
    } else {
      return await this.api().patch('/episode/' + episode.id, episode)
    }
  }

  static async apiUpdate (episode) {
    return await this.api().patch('/episode/' + episode.id, episode)
  }

  static async apiRemove (episode) {
    return await this.api().delete(`/episode/${episode.id}`)
  }

  static async apiGetAllByClinicId (clinicId, offset, max) {
    return await this.api().get('/episode/clinic/' + clinicId + '?offset=' + offset + '&max=' + max)
  }

  static async apiFetchById (id) {
    return await this.api().get(`/episode/${id}`)
  }

  static async apiGetAllByIdentifierId (identifierId, offset, max) {
    return await this.api().get('/episode/identifier/' + identifierId + '?offset=0&max=100')
  }

  static async apiGetLastByClinicSectorId (clinicSectorId) {
    return await this.api().get('/episode/clinicSector/' + clinicSectorId)
  }

  static localDbAddOrUpdate (episode) {
    return nSQL(this.entity).query('upsert',
    episode
  ).exec().then(result => {
    Episode.insertOrUpdate({ data: episode })
    })
  }

  static localDbGetById (id) {
    return nSQL(this.entity).query('select').where(['id', '=', id]).exec().then(result => {
       // Episode.insertOrUpdate({ data: result[0] })
         return result[0]
       })
  }

  static localDbGetAll () {
     return nSQL(this.entity).query('select').exec().then(result => {
      Episode.insertOrUpdate({ data: result })
      })
  }

  static localDbDelete (episode) {
     nSQL(this.entity).query('delete').where(['id', '=', episode.id]).exec()
      Episode.delete(episode.id)
  }

  static localDbDeleteById (episodeId) {
    return db.newDb().collection('episodes').doc({ id: episodeId }).delete()
  }

  static localDbDeleteAll () {
    return db.newDb().collection('episodes').delete()
  }

  static async syncEpisode (episode) {
    if (episode.syncStatus === 'R') await this.apiSave(episode, true)
    if (episode.syncStatus === 'U') await this.apiUpdate(episode, false)
  }

  static getClassName () {
    return 'episode'
  }

  /*
  static getEpisodeNSql () {
   nSQL().onConnected(() => {
     nSQL('episode').query('select', ['episode.episodeDate', 'episode.serviceIdentifier.startDate']).join({
      type: 'inner', // Supported join types are left, inner, right, cross and outer.
      table: 'serviceIdentifier',
      where: ['episode.patientServiceIdentifier_id', '=', 'serviceIdentifier.id'] // any valid WHERE statement works here
  }).exec().then(result => {
      console.log(result)
     // Episode.insert({ data: result })
      //  return result
      })
    })
  }
  */

  static async getEpisodesNSqlByIdentifier (patientServiceIdentifier) {
    return nSQL(this.entity).query('select').where(['patientServiceIdentifier[id]', '=', patientServiceIdentifier.id]).exec().then(result => {
      if (result !== undefined) {
        Episode.insertOrUpdate({ data: result })
      }
         return result
       })
   }

   static async localDbGetBySyncStatusToSychronize () {
    return nSQL(this.entity).query('select').where([['syncStatus', '=', 'R'], 'OR', ['syncStatus', '=', 'U']]).exec().then(result => {
      return result
        })
    }
}
