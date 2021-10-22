import { Model } from '@vuex-orm/core'
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
        dateReturned: this.attr(''),
        stockReturned: this.attr(''),
        packageReturned: this.attr(''),
        reasonForPackageReturn: this.attr(''),
        // Relationships
        patientVisitDetails: this.belongsTo(PatientVisitDetails, 'pack_id'),
        packagedDrugs: this.hasMany(PackagedDrug, 'pack_id')
      }
    }
}
