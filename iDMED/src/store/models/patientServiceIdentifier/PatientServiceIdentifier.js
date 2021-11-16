import { Model } from '@vuex-orm/core'
import Episode from '../episode/Episode'
import IdentifierType from '../identifierType/IdentifierType'
import Patient from '../patient/Patient'
import ClinicalService from '../ClinicalService/ClinicalService'

export default class PatientServiceIdentifier extends Model {
  static entity = 'identifiers'

  static fields () {
    return {
      id: this.attr(null),
      startDate: this.attr(''),
      endDate: this.attr(''),
      reopenDate: this.attr(''),
      value: this.attr(''),
      state: this.attr(''),
      prefered: this.boolean(true),
      identifier_type_id: this.attr(''),
      service_id: this.attr(''),
      patient_id: this.attr(''),
      // Relationships
      identifierType: this.belongsTo(IdentifierType, 'identifier_type_id'),
      service: this.belongsTo(ClinicalService, 'service_id'),
      patient: this.belongsTo(Patient, 'patient_id'),
      episodes: this.hasMany(Episode, 'patientServiceIdentifier_id')

    }
  }

  isPrefered () {
    return this.prefered
  }

  hasEpisodes () {
    return this.episodes.length > 0
  }

  canBeEdited () {
    if (!this.hasEpisodes()) return true
    let canEdit = true
    Object.keys(this.episodes).forEach(function (k) {
      const eps = this.episodes[k]
      if (canEdit) {
        if (eps.hasVisits()) {
          canEdit = false
        }
      }
    }.bind(this))
    return canEdit
  }

  static async apiSave (identifier) {
    return await this.api().post('/patientServiceIdentifier', identifier)
  }

  static async apiGetAllByClinicId (clinicId, offset, max) {
    return await this.api().get('/patientServiceIdentifier/clinic/' + clinicId + '?offset=' + offset + '&max=' + max)
  }
}
