import { Model } from '@vuex-orm/core'
import PatientVisitDetails from '../patientVisitDetails/PatientVisitDetails'
import PregnancyScreening from '../screening/PregnancyScreening'
import RAMScreening from '../screening/RAMScreening'
import TBScreening from '../screening/TBScreening'
import AdherenceScreening from '../screening/AdherenceScreening'
import VitalSignsScreening from '../screening/VitalSignsScreening'
import Prescription from '../../../store/models/prescription/Prescription'
import Pack from '../../../store/models/packaging/Pack'
import Patient from '../patient/Patient'
import Clinic from '../clinic/Clinic'
// import PackagedDrug from '../../../store/models/packagedDrug/PackagedDrug'
import db from 'src/store/localbase'
import { v4 as uuidv4 } from 'uuid'
import { nSQL } from 'nano-sql'

export default class PatientVisit extends Model {
  static entity = 'patientVisits'

  static fields () {
    return {
      id: this.uid(() => uuidv4()),
      visitDate: this.attr(''),
      clinic_id: this.attr(''),
      patient_id: this.attr(''),
      isLast: this.boolean(false),
      syncStatus: this.attr(''),
      // Relationships
      patientVisitDetails: this.hasMany(PatientVisitDetails, 'patient_visit_id'),
      vitalSigns: this.hasMany(VitalSignsScreening, 'patient_visit_id'),
      tbScreening: this.hasMany(TBScreening, 'patient_visit_id'),
      pregnancyScreening: this.hasMany(PregnancyScreening, 'patient_visit_id'),
      adherenceScreening: this.hasMany(AdherenceScreening, 'patient_visit_id'),
      ramScreening: this.hasMany(RAMScreening, 'patient_visit_id'),
      clinic: this.belongsTo(Clinic, 'clinic_id'),
      patient: this.belongsTo(Patient, 'patient_id')
    }
  }

  static async apiFetchById (id) {
    return await this.api().get(`/patientVisit/${id}`)
  }

  static async apiSave (patientVisit, newData) {
      return await this.api().post('/patientVisit', patientVisit)
  }

  static async apiMySave (patientVisit) {
    return await this.api().post('/patientVisit/mySave', patientVisit)
  }

  static async apiSaveRec (patientVisit) {
    return await this.api().post('/patientVisit/saveRecord', patientVisit)
  }

  static async apiUpdate (patientVisit) {
    return await this.api().patch(`/patientVisit/${patientVisit.id}`, patientVisit)
  }

  static async apiRemove (id) {
    return await this.api().delete(`/patientVisit/${id}`)
  }

  static async apiGetAllByPatientId (patientId) {
    return await this.api().get('/patientVisit/patient/' + patientId)
  }

  static async apiGetAllByClinicId (clinicId, offset, max) {
    return await this.api().get('/patientVisit/clinic/' + clinicId + '?offset=0&max=100')
  }

  static async apiGetAllLastWithScreeningOfClinic (clinicId, offset, max) {
    return await this.api().get('/patientVisit/AllLastWithScreeningOfClinic/' + clinicId + '?offset=' + offset + '&max=' + max)
  }

  static async apiGetLastVisitOfPatient (patientId) {
    return await this.api().get('/patientVisit/lastofPatient/' + patientId)
  }

  static localDbAddOrUpdate (patientVisit) {
    return nSQL(this.entity).query('upsert',
    patientVisit).exec().then(result => {
     PatientVisit.insertOrUpdate({ data: patientVisit })
     patientVisit.patientVisitDetails.forEach((pvd) => {
      PatientVisitDetails.insertOrUpdate({ data: pvd })
     if (pvd.prescription !== undefined) Prescription.insertOrUpdate({ data: pvd.prescription })
     if (pvd.pack !== undefined) Pack.insertOrUpdate({ data: pvd.pack })
  })
    }
    )
  }

  static async localDbGetById (id) {
    return nSQL(this.entity).query('select').where(['id', '=', id]).exec().then(result => {
      console.log(result)
      return result[0]
    })
  }

  static localDbGetAll () {
    return nSQL(this.entity).query('select').exec().then(result => {
      if (result.length > 0) {
        result.forEach(result => {
          PatientVisit.insertOrUpdate({ data: result })
          result.patientVisitDetails.forEach((pvd) => {
           PatientVisitDetails.insertOrUpdate({ data: pvd })
           if (pvd.prescription !== undefined) Prescription.insertOrUpdate({ data: pvd.prescription })
           if (pvd.pack !== undefined) Pack.insertOrUpdate({ data: pvd.pack })
        })
         })
      }
        })
  }

  static localDbUpdate (patientVisit) {
    return db.newDb().collection('patientVisits').doc({ id: patientVisit.id }).set(patientVisit)
  }

  static localDbDelete (patientVisit) {
     nSQL(this.entity).query('delete').where(['id', '=', patientVisit.id]).exec()
     PatientVisit.delete(patientVisit.id)
  }

  static localDbDeleteAll () {
    return db.newDb().collection('patientVisits').delete()
  }

  static getClassName () {
    return 'patientVisit'
  }

static getPatientNSql () {
      nSQL(this.entity).query('select').exec().then(result => {
       console.log(result)
       PatientVisit.insertOrUpdate({ data: result })
       //  return result
       })
   }

   static getPatientVIsitNSqlByPatient (patient) {
      nSQL(this.entity).query('select').where(['patient[id]', '=', patient.id]).exec().then(result => {
       console.log(result)
       PatientVisit.insertOrUpdate({ data: result[0] })
       result[0].patientVisitDetails.forEach((pvd) => {
        PatientVisitDetails.insertOrUpdate({ data: pvd })
        if (pvd.prescription !== undefined) Prescription.insertOrUpdate({ data: pvd.prescription })
     if (pvd.pack !== undefined) Pack.insertOrUpdate({ data: pvd.pack })
    })
       })
   }

   static getLastPatientVisitLocalByPatient (patient) {
   return nSQL(this.entity).query('select').orderBy({ visitDate: 'desc' }).where(['patient[id]', '=', patient.id]).exec().then(result => {
     console.log(result)
     if (result.length > 0) {
 result.forEach(result => {
  PatientVisit.insertOrUpdate({ data: result })
  result.patientVisitDetails.forEach((pvd) => {
   PatientVisitDetails.insertOrUpdate({ data: pvd })
   if (pvd.prescription !== undefined) Prescription.insertOrUpdate({ data: pvd.prescription })
   if (pvd.pack !== undefined) Pack.insertOrUpdate({ data: pvd.pack })
})
 })
     }
     })
 }

 static async localDbGetBySyncStatusToSychronize () {
  return nSQL(this.entity).query('select').where([['syncStatus', '=', 'R'], 'OR', ['syncStatus', '=', 'U']]).exec().then(result => {
    return result
      })
  }

  static getVisits () {
    nSQL().onConnected(() => {
      nSQL(this.entity).query('select', ['JSON_EXTRACT(patientVisitDetails, "$[*].pack") as pack']).exec().then(result => {
        console.log(result)
      })
     })
   }

   static async localDbGetPacks () {
    const packList = []
    return nSQL('patientVisits').query('select', ['patientVisitDetails']).exec().then(result => {
      for (const pvd of result) {
         for (const pvdObj of pvd.patientVisitDetails) {
          packList.push(pvdObj.pack)
      }
    }
    return packList
     })
    }

    static async localDbGetAllPatientVisit () {
      const patientVisitDetailList = []
      return nSQL('patientVisits').query('select').exec().then(result => {
        for (const pvd of result) {
            patientVisitDetailList.push(pvd)
      }
      return patientVisitDetailList
       })
      }
}
