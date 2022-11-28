import { Model } from '@vuex-orm/core'
import { v4 as uuidv4 } from 'uuid'

export default class AttributeType extends Model {
  static entity = 'attributeTypes'

  static fields () {
    return {
      id: this.uid(() => uuidv4()),
      code: this.attr(''),
      name: this.attr(''),
      description: this.attr(''),
      datatype: this.attr('')
    }
  }
}
