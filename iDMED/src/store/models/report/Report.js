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

    // Received Stock report
    static async apiInitReceivedStockProcessing (params) {
      return await this.api().post('/receivedStockReport/initReportProcess', params)
    }

    static async apiReceivedStockReport (reportId, fileType) {
      return await this.api().get(`/receivedStockReport/printReport/${reportId}/${fileType}`)
    }

    // Used Stock Report
    static async apiInitUsedStockProcessing (params) {
      return await this.api().post('/usedStockReport/initReportProcess', params)
    }

    static async apiUsedStockReport (reportId, fileType) {
      return await this.api().get(`/usedStockReport/printReport/${reportId}/${fileType}`)
    }

    // Arv Daily Regster
    static async apiInitArvDailyRegisterProcessing (params) {
      return await this.api().post('/arvDailyRegisterReport/initReportProcess', params)
    }

    static async apiArvDailyRegisterReport (reportId, fileType) {
      return await this.api().get(`/arvDailyRegisterReport/printReport/${reportId}/${fileType}`)
    }

    static async apiInitActiveInDrugStoreProcessing (params) {
      return await this.api().post('/activePatientReport/initReportProcess', params)
    }

    static async apiActivePatientReport (reportId, fileType) {
      return await this.api().get(`/activePatientReport/printReport/${reportId}/${fileType}`)
    }

    static async apiInitPatientsHistryProcessing (params) {
      return await this.api().post('/historicoLevantamentoReport/initReportProcess', params)
    }

    static async apiPatientsHistryReport (reportId, fileType) {
      return await this.api().get(`/historicoLevantamentoReport/printReport/${reportId}/${fileType}`)
    }
}
