import { Model } from '@vuex-orm/core'
import Clinic from '../clinic/Clinic'
import ClinicSector from '../clinicSector/ClinicSector'
import EpisodeType from '../episodeType/EpisodeType'
import PatientServiceIdentifier from '../patientServiceIdentifier/PatientServiceIdentifier'
import PatientVisitDetails from '../patientVisitDetails/PatientVisitDetails'
import StartStopReason from '../startStopReason/StartStopReason'
import db from 'src/store/localbase'

export default class Episode extends Model {
  static entity = 'episodes'

  static fields () {
    return {
      id: this.attr(null),
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

  static async apiSave (episode) {
    return await this.api().post('/episode', episode)
  }

  static async apiRemove (episode) {
    return await this.api().delete(`/episode/${episode.id}`)
  }

  static async apiGetAllByClinicId (clinicId, offset, max) {
    return await this.api().get('/episode/clinic/' + clinicId + '?offset=0&max=100')
  }

  static async apiFetchById (id) {
    return await this.api().get(`/episode/${id}`)
  }

  static async apiGetAllByIdentifierId (identifierId, offset, max) {
    return await this.api().get('/episode/identifier/' + identifierId + '?offset=0&max=100')
  }

  static localDbAdd (episode) {
    return db.newDb().collection('episodes').add(episode)
  }

  static localDbGetById (id) {
    return db.newDb().collection('episodes').doc({ id: id }).get()
  }

  static localDbGetAll () {
    return db.newDb().collection('episodes').get()
  }

  static localDbUpdate (episode) {
    return db.newDb().collection('episodes').doc({ id: episode.id }).set(episode)
  }

  static localDbUpdateAll (episodes) {
    return db.newDb().collection('episodes').set(episodes)
  }

  static localDbDelete (episode) {
    return db.newDb().collection('episodes').doc({ id: episode.id }).delete()
  }

  static localDbDeleteAll () {
    return db.newDb().collection('episodes').delete()
  }
}
