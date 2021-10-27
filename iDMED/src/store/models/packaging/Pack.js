import { Model } from '@vuex-orm/core'
import Clinic from '../clinic/Clinic'
import PackagedDrug from '../packagedDrug/PackagedDrug'
import PatientVisitDetails from '../patientVisitDetails/PatientVisitDetails'

export default class Pack extends Model {
    static entity = 'packs'
    static fields () {
      return {
        id: this.attr(null),
        dateLeft: this.attr(''),
        dateReceived: this.attr(''),
        modified: this.attr(''),
        packDate: this.attr(''),
        pickupDate: this.attr(''),
        weeksSupply: this.attr(''),
        dispenseMode: this.attr(''),
        dateReturned: this.attr(''),
        stockReturned: this.attr(''),
        packageReturned: this.attr(''),
        reasonForPackageReturn: this.attr(''),
        patientVisitDetails_id: this.attr(''),
        clinic_id: this.attr(''),
        // Relationships
        clinic: this.belongsTo(Clinic, 'clinic_id'),
        patientVisitDetails: this.belongsTo(PatientVisitDetails, 'patientVisitDetails_id'),
        packagedDrugs: this.hasMany(PackagedDrug, 'pack_id')
      }
    }

    static async apiSave (pack) {
      return await this.api().post('/pack', pack)
    }
}
