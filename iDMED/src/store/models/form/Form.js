import { Model } from '@vuex-orm/core'
import Drug from '../drug/Drug'
import db from 'src/store/localbase'
import { v4 as uuidv4 } from 'uuid'
import { nSQL } from 'nano-sql'

export default class Form extends Model {
  static entity = 'forms'

  static fields () {
    return {
      id: this.uid(() => uuidv4()),
      code: this.attr(''),
      description: this.attr(''),

      // Relationships
      drugs: this.hasMany(Drug, 'form_id')
    }
  }

  static async apiGetAll (offset, max) {
    return await this.api().get('/form?offset=' + offset + '&max=' + max)
  }

  static async apiFetchById (id) {
    return await this.api().get(`/form/${id}`)
  }

  static localDbAdd (form) {
    return nSQL(this.entity).query('upsert',
    form
     ).exec().then(
      Form.insertOrUpdate({ data: form })
     )
  }

  static localDbGetById (id) {
    return db.newDb().collection('forms').doc({ id: id }).get()
  }

  static localDbGetAll () {
    return nSQL(this.entity).query('select').exec().then(result => {
      console.log(result)
      Form.insertOrUpdate({ data: result })
      })
  }

  static localDbUpdate (form) {
    return db.newDb().collection('forms').doc({ id: form.id }).set(form)
  }

  static localDbUpdateAll (forms) {
    return db.newDb().collection('forms').set(forms)
  }

  static localDbDelete (form) {
    return db.newDb().collection('forms').doc({ id: form.id }).delete()
  }

  static localDbDeleteAll () {
    return db.newDb().collection('forms').delete()
  }
}
