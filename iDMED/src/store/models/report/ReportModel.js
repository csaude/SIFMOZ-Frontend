import { Model } from '@vuex-orm/core'

export default class ReportModel extends Model {
  static entity = 'reportModels'

  static fields () {
    return {
      id: this.attr(null)
    }
  }

  static async apiInitMmiaProcessing (params) {
    return await this.api().post('/mmiaReport/initReportProcess', params)
  }
}
