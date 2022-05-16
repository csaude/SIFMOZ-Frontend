import { Model } from '@vuex-orm/core'

export default class Report extends Model {
    static entity = 'reports'

    static async apiInitMmiaProcessing (params) {
      return await this.api().post('/mmiaReport/initReportProcess', params)
    }

    static async apiPrintMmiaReport (reportId, fileType) {
      return await this.api().get(`/mmiaReport/printReport/${reportId}/${fileType}`)
    }

    static async getProcessingStatus (controller, params) {
      return await this.api().get(`/${controller}/getProcessingStatus/${params.id}`)
    }
}
