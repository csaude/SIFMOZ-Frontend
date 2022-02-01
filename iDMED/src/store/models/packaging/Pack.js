import { Model } from '@vuex-orm/core'
import Clinic from '../clinic/Clinic'
import DispenseMode from '../dispenseMode/DispenseMode'
import PackagedDrug from '../packagedDrug/PackagedDrug'
import PatientVisitDetails from '../patientVisitDetails/PatientVisitDetails'

export default class Pack extends Model {
    static entity = 'packs'
    static fields () {
      return {
        id: this.attr(null),
        dateLeft: this.attr(''),
        dateReceived: this.attr(''),
        modified: this.boolean(false),
        packDate: this.attr(''),
        pickupDate: this.attr(''),
        nextPickUpDate: this.attr(''),
        weeksSupply: this.attr(''),
        dispenseMode_id: this.attr(''),
        dateReturned: this.attr(''),
        stockReturned: this.number(0),
        packageReturned: this.number(0),
        reasonForPackageReturn: this.attr(''),
        patientVisitDetails_id: this.attr(''),
        clinic_id: this.attr(''),
        syncStatus: this.attr(''),
        // Relationships
        clinic: this.belongsTo(Clinic, 'clinic_id'),
        patientVisitDetails: this.belongsTo(PatientVisitDetails, 'patientVisitDetails_id'),
        dispenseMode: this.belongsTo(DispenseMode, 'dispenseMode_id'),
        packagedDrugs: this.hasMany(PackagedDrug, 'pack_id')
      }
    }

    static async apiSave (pack) {
      return await this.api().post('/pack', pack)
    }

    static async apiGetAllByClinicId (clinicId, offset, max) {
      return await this.api().get('/pack/clinic/' + clinicId + '?offset=' + offset + '&max=' + max)
    }

    static async apiGetAllByPatientVisitDetailsId (patientVisitDetailsId, offset, max) {
      return await this.api().get('/pack/patientVisitDetails/' + patientVisitDetailsId + '?offset=' + offset + '&max=' + max)
    }

    static async apiFetchById (id) {
      return await this.api().get(`/pack/${id}`)
    }

    getDrugsString () {
      let drugsString = ''
      Object.keys(this.packagedDrugs).forEach(function (k) {
        const presDrug = this.packagedDrugs[k]
        drugsString = drugsString + presDrug.drug.name
      }.bind(this))
      return drugsString
    }
}
