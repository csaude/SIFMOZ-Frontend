import { Model } from '@vuex-orm/core'

export default class TherapeuticRegimen extends Model {
  static entity = 'provincias'

  static fields () {
    return {
      id: this.attr(null),
      regimenScheme: this.attr(''),
      active: this.attr(''),
      code: this.attr(''),
      pedhiatric: this.attr(''),
      description: this.attr('')

    }
  }
}
