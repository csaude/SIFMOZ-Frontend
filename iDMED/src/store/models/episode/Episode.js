import { Model } from '@vuex-orm/core'
import ClinicSector from '../clinicSector/ClinicSector'
import EpisodeType from '../episodeType/EpisodeType'
import PatientProgramIdentifier from '../patientServiceIdentifier/PatientServiceIdentifier'
import PatientVisitDetails from '../patientVisitDetails/PatientVisitDetails'
import StartStopReason from '../startStopReason/StartStopReason'

export default class Episode extends Model {
  static entity = 'episodes'

  static fields () {
    return {
      id: this.attr(null),
      startDate: this.attr(''),
      stopDate: this.attr(''),
      notes: this.attr(''),
      episodeType_id: this.attr(''),
      clinicSector_id: this.attr(''),
      patientProgramIdentifier_id: this.attr(''),
      // Relationships
      startStopReasons: this.hasMany(StartStopReason, 'episode_id'),
      episodeType: this.belongsTo(EpisodeType, 'episodeType_id'),
      clinicSector: this.belongsTo(ClinicSector, 'clinicSector_id'),
      patientProgramIdentifier: this.belongsTo(PatientProgramIdentifier, 'patientProgramIdentifier_id'),
      patientVisitDetails: this.hasMany(PatientVisitDetails, 'episode_id')
    }
  }
}
