import { Model } from '@vuex-orm/core'
import Episode from '../episode/Episode'
import Pack from '../packaging/Pack'
import Prescription from '../prescription/Prescription'
import PatientVisit from '../patientVisit/PatientVisit'

export default class PatientVisitDetails extends Model {
  static entity = 'patientVisitDetails'

  static fields () {
    return {
      id: this.attr(null),
      patient_visit_id: this.attr(''),
      episode_id: this.attr(''),
      pack_id: this.attr(''),
      prescription_id: this.attr(''),
      // Relationships
      pack: this.hasOne(Pack, 'pack_id'),
      episode: this.belongsTo(Episode, 'episode_id'),
      patientVisit: this.belongsTo(PatientVisit, 'patient_visit_id'),
      prescription: this.hasOne(Prescription, 'prescription_id')
    }
  }
}
