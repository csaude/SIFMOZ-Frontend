import { Model } from '@vuex-orm/core'
import Province from 'src/store/models/province/Province'
import db from 'src/store/localbase'
import { v4 as uuidv4 } from 'uuid'

export default class Country extends Model {
  static entity = 'countries'

  static fields () {
    return {
      id: this.uid(() => uuidv4()),
      description: this.attr(''),
      nacionality: this.attr(''),
      code: this.attr(''),

      // Relationshiops
      provinces: this.hasMany(Province, 'country_id')
    }
  }

  static localDbAdd (countrie) {
    return db.newDb().collection('countries').add(countrie)
  }

  static localDbGetById (id) {
    return db.newDb().collection('countries').doc({ id: id }).get()
  }

  static localDbGetAll () {
    return db.newDb().collection('countries').get()
  }

  static localDbUpdate (countrie) {
    return db.newDb().collection('countries').doc({ id: countrie.id }).set(countrie)
  }

  static localDbUpdateAll (countries) {
    return db.newDb().collection('countries').set(countries)
  }

  static localDbDelete (countrie) {
    return db.newDb().collection('countries').doc({ id: countrie.id }).delete()
  }

  static localDbDeleteAll () {
    return db.newDb().collection('countries').delete()
  }
}
