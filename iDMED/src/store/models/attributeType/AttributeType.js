import { Model } from '@vuex-orm/core'

export default class AttributeType extends Model {
  static entity = 'attributeTypes'

  static fields () {
    return {
      id: this.attr(null),
      code: this.attr(''),
      name: this.attr(''),
      description: this.attr(''),
      datatype: this.attr('')
    }
  }
}
