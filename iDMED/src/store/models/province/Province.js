import { Model } from '@vuex-orm/core'
import Country from 'src/store/models/country/Country'
import City from '../city/City'
import Clinic from '../clinic/Clinic'
import District from '../district/District'
import db from 'src/store/localbase'
import { v4 as uuidv4 } from 'uuid'
import { nSQL } from 'nano-sql'

export default class Province extends Model {
  static entity = 'provinces'

  static fields () {
    return {
      id: this.uid(() => uuidv4()),
      description: this.attr(''),
      code: this.attr(''),
      country_id: this.attr(''),
      syncStatus: this.attr(''),
      // Relationships
      country: this.belongsTo(Country, 'country_id'),
      districts: this.hasMany(District, 'province_id'),
      clinics: this.hasMany(Clinic, 'province_id'),
      cities: this.hasMany(City, 'province_id')

    }
  }

  static async apiFetchById (id) {
    return await this.api().get(`/province/${id}`)
  }

  static async apiGetAll (offset, max) {
    return await this.api().get('/province?offset=' + offset + '&max=' + max)
  }

  static localDbAdd (province) {
    return nSQL(this.entity).query('upsert',
    province
       ).exec().then(
        Province.insertOrUpdate({ data: province })
       )
  }

  static localDbGetById (id) {
    return db.newDb().collection('provinces').doc({ id: id }).get()
  }

  static async localDbGetAll () {
    return nSQL(this.entity).query('select').exec().then(result => {
      console.log(result)
      Province.insertOrUpdate({ data: result })
      })
  }

  static localDbUpdate (province) {
    return db.newDb().collection('provinces').doc({ id: province.id }).set(province)
  }

  static localDbUpdateAll (provinces) {
    return db.newDb().collection('provinces').set(provinces)
  }

  static localDbDelete (province) {
    return db.newDb().collection('provinces').doc({ id: province.id }).delete()
  }

  static localDbDeleteAll () {
    return db.newDb().collection('provinces').delete()
  }
}
