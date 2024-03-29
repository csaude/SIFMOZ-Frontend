import { Model } from '@vuex-orm/core'
import Prescription from '../prescription/Prescription'
import TherapeuticRegimen from '../therapeuticRegimen/TherapeuticRegimen'
import DispenseType from '../dispenseType/DispenseType'
import TherapeuticLine from '../therapeuticLine/TherapeuticLine'
import SpetialPrescriptionMotive from '../prescription/SpetialPrescriptionMotive'
import db from 'src/store/localbase'
import { v4 as uuidv4 } from 'uuid'

export default class PrescriptionDetail extends Model {
    static entity = 'prescriptionsDetails'
    static fields () {
      return {
        id: this.uid(() => uuidv4()),
        reasonForUpdate: this.attr(''),
        prescription_id: this.attr(''),
        therapeutic_line_id: this.attr(''),
        therapeutic_regimen_id: this.attr(''),
        dispense_type_id: this.attr(''),
        spetialPrescriptionMotive_id: this.attr(''),
        syncStatus: this.attr(''),
        // Relationships
        prescription: this.belongsTo(Prescription, 'prescription_id'),
        therapeuticLine: this.belongsTo(TherapeuticLine, 'therapeutic_line_id'),
        therapeuticRegimen: this.belongsTo(TherapeuticRegimen, 'therapeutic_regimen_id'),
        dispenseType: this.belongsTo(DispenseType, 'dispense_type_id'),
        spetialPrescriptionMotive: this.belongsTo(SpetialPrescriptionMotive, 'spetialPrescriptionMotive_id')
      }
    }

    static async apiGetAllByPrescriptionId (prescriptionId) {
      return await this.api().get('/prescriptionDetail/prescription/' + prescriptionId)
    }

    static async apiGetAll () {
      return await this.api().get('/prescriptionDetail?offset=' + 0 + '&max=' + 200)
    }

    static async apiFetchById (id) {
      return await this.api().get(`/prescriptionDetail/${id}`)
    }

    static localDbAdd (prescriptionsDetail) {
      return db.newDb().collection('prescriptionsDetails').add(prescriptionsDetail)
    }

    static localDbGetById (id) {
      return db.newDb().collection('prescriptionsDetails').doc({ id: id }).get()
    }

    static localDbGetAll () {
      return db.newDb().collection('prescriptionsDetails').get()
    }

    static localDbUpdate (prescriptionsDetail) {
      return db.newDb().collection('prescriptionsDetails').doc({ id: prescriptionsDetail.id }).set(prescriptionsDetail)
    }

    static localDbUpdateAll (prescriptionsDetails) {
      return db.newDb().collection('prescriptionsDetails').set(prescriptionsDetails)
    }

    static localDbDelete (prescriptionsDetail) {
      return db.newDb().collection('prescriptionsDetails').doc({ id: prescriptionsDetail.id }).delete()
    }

    static localDbDeleteAll () {
      return db.newDb().collection('prescriptionsDetails').delete()
    }
}
