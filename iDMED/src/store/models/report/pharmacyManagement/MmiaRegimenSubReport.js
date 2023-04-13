// import { Model } from '@vuex-orm/core'
import { Model } from '@vuex-orm/core'
import { v4 as uuidv4 } from 'uuid'
import { nSQL } from 'nano-sql'

export default class MmiaRegimenSubReport extends Model {
    static entity = 'mmiaRegimenSubReport'
    static fields () {
      return {
        id: this.uid(() => uuidv4()),
        reportId: this.attr(''),

       // fields
       code: this.attr(''),
       regimen: this.attr(''),
      // drugId: this.attr(''),
      line: this.attr(''),
      lineCode: this.attr(''),
      totalPatients: this.attr(0),
      cumunitaryClinic: this.attr(0)
      }
    }

      static localDbAddOrUpdate (targetCopy) {
          nSQL(this.entity).query('upsert',
          targetCopy
        ).exec()
        MmiaRegimenSubReport.insertOrUpdate({ data: targetCopy })
      }

      static localDbGetAllByReportId (reportId) {
        return nSQL(this.entity).query('select').where(['reportId', '=', reportId]).exec().then(result => {
          console.log(result)
          // Stock.insert({ data: result })
          return result
        })
      }

      static createNewMmiaRegimenSubReport (detail, reportId, isReferido) {
        const mmiaRegimenSubReport = new MmiaRegimenSubReport()
        mmiaRegimenSubReport.reportId = reportId
        mmiaRegimenSubReport.code = detail.therapeuticRegimen.code
        mmiaRegimenSubReport.regimen = detail.therapeuticRegimen.description
        mmiaRegimenSubReport.lineCode = detail.getTherapeuticLine.code
        mmiaRegimenSubReport.line = detail.therapeuticLine.description
        isReferido ? mmiaRegimenSubReport.comunitaryClinic++ : mmiaRegimenSubReport.totalPatients++
        return mmiaRegimenSubReport
    }
}
