import { Model } from '@vuex-orm/core'
import Appointment from '../appointment/Appointment'
import GroupMember from '../groupMember/GroupMember'
import PatientAttribute from '../patientAttribute/PatientAttribute'
import PatientServiceIdentifier from '../patientServiceIdentifier/PatientServiceIdentifier'
import Province from '../province/Province'
import District from '../district/District'
import Clinic from '../clinic/Clinic'
import PostoAdministrativo from '../PostoAdministrativo/PostoAdministrativo'
import Localidade from '../Localidade/Localidade'
import PatientVisit from '../patientVisit/PatientVisit'
import HealthInformationSystem from '../healthInformationSystem/HealthInformationSystem'
import db from 'src/store/localbase'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'
import { nSQL } from 'nano-sql'
import EpisodeType from '../episodeType/EpisodeType'
import ClinicSector from '../clinicSector/ClinicSector'
import StartStopReason from '../startStopReason/StartStopReason'
import Episode from '../episode/Episode'
import PatientVisitDetails from '../patientVisitDetails/PatientVisitDetails'
import Prescription from '../prescription/Prescription'
import Pack from '../packaging/Pack'

export default class Patient extends Model {
  static entity = 'patients'

  get fullName () {
    return `${this.firstNames} ${this.middleNames} ${this.lastNames}`
  }

  static fields () {
    return {
      id: this.uid(() => uuidv4()),
      firstNames: this.attr(''),
      middleNames: this.attr(''),
      lastNames: this.attr(''),
      gender: this.attr(''),
      dateOfBirth: this.attr(''),
      cellphone: this.attr(''),
      alternativeCellphone: this.attr(''),
      address: this.attr(''),
      addressReference: this.attr(''),
      accountstatus: this.boolean(true),
      hisLocation: this.attr(''),
      hisLocationName: this.attr(''),
      hisUuid: this.attr(''),
      his_id: this.attr(''),
      province_id: this.attr(''),
      district_id: this.attr(''),
      postoAdministrativo_id: this.attr(''),
      bairro_id: this.attr(''),
      clinic_id: this.attr(''),
      syncStatus: this.attr(''),

      // Relationships
      province: this.belongsTo(Province, 'province_id'),
      attributes: this.hasMany(PatientAttribute, 'patient_id'),
      identifiers: this.hasMany(PatientServiceIdentifier, 'patient_id'),
      appointments: this.hasMany(Appointment, 'patient_id'),
      members: this.hasMany(GroupMember, 'patient_id'),
      district: this.belongsTo(District, 'district_id'),
      postoAdministrativo: this.belongsTo(PostoAdministrativo, 'postoAdministrativo_id'),
      bairro: this.belongsTo(Localidade, 'bairro_id'),
      clinic: this.belongsTo(Clinic, 'clinic_id'),
      his: this.belongsTo(HealthInformationSystem, 'his_id'),
      patientVisits: this.hasMany(PatientVisit, 'patient_id')
    }
  }

  isActiveOnGroupOfService (service) {
    if (this.members.length <= 0) return false
    const isActive = this.members.some((member) => {
      return member.endDate === null && member.group.service.code === service.code
    })
    return isActive
  }

  bairroName () {
    if (this.bairro === null) return ''
    return this.bairro.description
  }

  postoAdministrativoName () {
    if (this.postoAdministrativo === null) return ''
    return this.postoAdministrativo.description
  }

  hasIdentifiers () {
    return this.identifiers.length > 0
  }

  isMale () {
    return this.gender === 'Masculino'
  }

  getOldestIdentifier () {
    if (!this.hasIdentifiers()) return null
    let preferedId = ''
    Object.keys(this.identifiers).forEach(function (k) {
      const id = this.identifiers[k]
      if (preferedId === '') {
        preferedId = id
      } else if (new Date(preferedId.startDate) > new Date(id.startDate)) {
        preferedId = id
      }
    }.bind(this))
    return preferedId
  }

  hasEpisodes () {
    if (this.identifiers.length <= 0) return false
    const hasEpisodes = this.identifiers.some((identifier) => {
      return identifier.episodes.length > 0
    })
    return hasEpisodes
  }

  preferedIdentifier () {
    if (this.identifiers.length <= 0) return null
    let preferedId = null
    Object.keys(this.identifiers).forEach(function (k) {
      const id = this.identifiers[k]
      if (id.prefered) {
        preferedId = id
      }
    }.bind(this))
    return preferedId
  }

  hasPreferedId () {
    return this.preferedIdentifier() !== null
  }

  preferedIdentifierValue () {
    if (this.identifiers.length <= 0) return 'Sem identificador'
    let preferedId = {}
    Object.keys(this.identifiers).forEach(function (k) {
      const id = this.identifiers[k]
      if (id.prefered) {
        preferedId = id
      }
    }.bind(this))
    return preferedId.value
  }

  hasOneAndClosedIdentifier () {
    if (this.identifiers.length > 1 && this.hasEpisodes()) return false
    return this.identifiers.length === 1 && (this.identifiers[0].endDate !== null && this.identifiers[0].endDate.length !== 0)
  }

  age () {
    return moment().diff(moment(this.dateOfBirth, 'YYYY-MM-DD'), 'years')
  }

  static async apiFetchById (id) {
    return await this.api().get(`/patient/${id}`)
  }

  static async apiSearch (patient) {
    return await this.api().post('/patient/search', patient)
  }

  static async apisearchByParam (searchParam, clinicId) {
    return await this.api().get(`/patient/searchByParam/${searchParam}/${clinicId}`)
  }

  static async apiSave (patient, isNew) {
    console.log('patient3' + patient, isNew)
    if (isNew) {
      return await this.api().post('/patient', patient)
    } else {
      return await this.api().patch('/patient/' + patient.id, patient)
    }
  }

  static async apiUpdate (patient) {
    return await this.api().patch('/patient/' + patient.id, patient)
  }

  static async apiGetAllByClinicId (clinicId, offset, max) {
    return await this.api().get('/patient/clinic/' + clinicId + '?offset=' + offset + '&max=' + max)
  }

  static localDbAddOrUpdate (patient) {
    return nSQL(this.entity).query('upsert',
    patient).exec().then(
          Patient.insertOrUpdate({ data: patient })
        )
  }

  static localDbGetById (id) {
    return db.newDb().collection('patients').doc({ id: id }).get()
  }

  static async localDbGetAll () {
  return nSQL(this.entity).query('select').exec().then(result => {
    console.log('patientsSearch' + result)
      Patient.insertOrUpdate({ data: result })
      })
  }

  static localDbUpdate (patient) {
    return db.newDb().collection('patients').doc({ id: patient.id }).set(patient)
  }

  static localDbUpdateAll (patients) {
    return db.newDb().collection('patients').set(patients)
  }

  static localDbDelete (patientId) {
    return db.newDb().collection('patients').doc({ id: patientId }).delete()
  }

  static localDbDeleteAll () {
    return db.newDb().collection('patients').delete()
  }

  static async syncPatient (patient) {
    if (patient.syncStatus === 'R') await this.apiSave(patient, true)
    if (patient.syncStatus === 'U') await this.apiSave(patient, false)
  }

  static getClassName () {
    return 'patient'
  }

  static async localDbGetBySyncStatusToSychronize () {
    return nSQL(this.entity).query('select').where([['syncStatus', '=', 'R'], 'OR', ['syncStatus', '=', 'U']]).exec().then(result => {
      return result
        })
    }

    static loadPatientWithIdentifiersEpisodeAndVisitFromServer (selectedPatient) {
      console.log(JSON.parse(JSON.stringify(selectedPatient)))
      Patient.localDbAddOrUpdate(JSON.parse(JSON.stringify(selectedPatient)))
      PatientServiceIdentifier.localDbAddOrUpdate(JSON.parse(JSON.stringify(selectedPatient.identifiers)))

      selectedPatient.identifiers.forEach(identifier => {
        Episode.apiGetAllByIdentifierId(identifier.id).then(resp => {
            if (resp.response.data.length > 0) {
              identifier.episodes = resp.response.data
              const lastEpisode = identifier.episodes[0]
              Episode.localDbAddOrUpdate(JSON.parse(JSON.stringify(lastEpisode)))

              const endEpispde = new Episode()
              endEpispde.episodeDate = moment()
              endEpispde.notes = 'Carregamento na Paragem Unica'
              endEpispde.creationDate = moment()
              endEpispde.episodeType = EpisodeType.query().where('code', 'FIM').first()
              endEpispde.patientServiceIdentifier = {}
              endEpispde.patientServiceIdentifier.id = identifier.id
              endEpispde.clinicSector = ClinicSector.query().with('clinic.*').with('clinicSectorType').where('code', 'NORMAL').first()
              endEpispde.startStopReason = StartStopReason.query().where('code', 'OUTRO').first()
              endEpispde.syncStatus = 'R'

              Episode.localDbAddOrUpdate(JSON.parse(JSON.stringify(endEpispde)))

              const startEpisode = new Episode()
              startEpisode.episodeDate = moment()
              startEpisode.notes = 'Carregamento na Paragem Unica'
              startEpisode.creationDate = moment()
              startEpisode.episodeType = EpisodeType.query().where('code', 'FIM').first()
              startEpisode.patientServiceIdentifier = {}
              startEpisode.patientServiceIdentifier.id = identifier.id
              console.log(localStorage.getItem('clinic_sectors'))
              startEpisode.clinicSector = ClinicSector.query().with('clinic.*').with('clinicSectorType').where('code', localStorage.getItem('clinic_sectors')).first()
              startEpisode.startStopReason = StartStopReason.query().where('code', 'TRANSFERIDO_DE').first()
              startEpisode.syncStatus = 'R'

              Episode.localDbAddOrUpdate(JSON.parse(JSON.stringify(startEpisode)))
          /*
              identifier.episodes.forEach(episode => {
                PatientVisitDetails.apiGetLastByEpisodeId(episode.id).then(resp => {
                  console.log(resp.response.data)
                  if (resp.response.data) {
                    episode.patientVisitDetails[0] = resp.response.data
                    this.loadVisitDetailsInfo(episode.patientVisitDetails, 0)
                  } // else this.flagGoReady = true
                })
            })
*/
}
})
})
            let i = 0
            let iP = 0
            let iPa = 0
            PatientVisit.apiGetLastVisitOfPatient(selectedPatient.id).then(resp => {
              if (resp.response.data) {
                resp.response.data.patientVisitDetails.forEach(pvd => {
                  PatientVisitDetails.apiFetchById(pvd.id).then(resp1 => {
                   // resp.response.data.patientVisitDetails[0] = resp1.response.data
                    if (pvd.id === resp1.response.data.id && resp.response.data.patientVisitDetails[i] !== undefined) {
                      console.log(i)
                      resp.response.data.patientVisitDetails[i] = resp1.response.data
                      Prescription.apiFetchById(resp.response.data.patientVisitDetails[i].prescription.id).then(respPre => {
                        resp.response.data.patientVisitDetails[iP].prescription = respPre.response.data
                        console.log(JSON.parse(JSON.stringify(resp.response.data)))
                        iP++
                        PatientVisit.localDbAddOrUpdate(JSON.parse(JSON.stringify(resp.response.data)))
                        if (resp.response.data.patientVisitDetails[iPa].pack !== null) {
                          Pack.apiFetchById(resp.response.data.patientVisitDetails[i].pack.id).then(respPack => {
                            resp.response.data.patientVisitDetails[iPa].pack = respPack.response.data
                            console.log(JSON.parse(JSON.stringify(resp.response.data)))
                            PatientVisit.localDbAddOrUpdate(JSON.parse(JSON.stringify(resp.response.data)))
                           // this.flagGoReady = true
                           console.log(i)
                           iPa++
                          })
                        } else {
                        //  this.flagGoReady = true
                        }
                        i++
                       // PatientVisit.localDbAddOrUpdate(JSON.parse(JSON.stringify(resp.response.data)))
                      })
                   //   PatientVisit.localDbAddOrUpdate(JSON.parse(JSON.stringify(resp.response.data)))
                    }
                  })
                  console.log(resp.response.data)
                })
              }
            })
    }
}
