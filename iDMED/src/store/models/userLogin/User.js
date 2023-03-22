import { Model } from '@vuex-orm/core'
 import Clinic from '../clinic/Clinic'
 import ClinicSector from '../clinicSector/ClinicSector'
 import UserClinics from './UserClinic'
 import UserClinicSectors from './UserClinicSector'
// import Role from './Role'
// import UserRole from './UserRole'
// import { v4 as uuidv4 } from 'uuid'
import { nSQL } from 'nano-sql'

export default class User extends Model {
  static entity = 'users'

  static state () {
    return {
      fetching: false
    }
}

  static fields () {
    return {
      id: this.attr(null),
      username: this.attr(''),
      password: this.attr(''),
      role: this.attr(null),
      fullName: this.attr(''),
      access_token: this.attr(''),
      refresh_token: this.attr(''),
      firstNames: this.attr(''),
      lastNames: this.attr(''),
      accountLocked: this.attr(''),
      contact: this.attr(''),
      email: this.attr(''),
      roles: this.attr(null),
      syncStatus: this.attr(''),
      authorities: this.attr(null),
        clinics: this.belongsToMany(Clinic, UserClinics, 'user_id', 'clinic_id'),
      clinicSectors: this.belongsToMany(ClinicSector, UserClinicSectors, 'user_id', 'clinic_sector_id')
    }
  }

  static async apiGetAll (offset, max) {
    return await this.api().get('/secUser?offset=' + offset + '&max=' + max)
  }

  static async apiSave (userLogin) {
    return await this.api().post('/secUser', userLogin)
  }

  static localDbAddOrUpdate (secUser) {
    return nSQL(this.entity).query('upsert',
    secUser
     ).exec().then(
      User.insertOrUpdate({ data: secUser })
     )
  }

  static localDbGetAll () {
    return nSQL(this.entity).query('select').exec().then(result => {
      console.log(result)
     return User.insert({ data: result })
      })
  }

  static localDbGetByUsername (username) {
    return nSQL(this.entity).query('select').where(['username', '=', username]).exec().then(result => {
      console.log(result)
     return result[0]
      })
  }
  /*
  static localDbAddOrUpdate (user) {
    if (user.id === null) {
      user.id = uuidv4()
     return this.localDbAdd(user)
    } else {
      user.syncStatus = 'U'
      return this.localDbUpdate(user)
    }
  }
  */
}
