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

  static localDBGetByIdNanoSQL (id) {
    return nSQL(this.entity).query('select').where(['id', '=', id]).exec().then(result => {
      return result[0]
    })
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

    static async localDbGetByPatientId (patientId) {
      return nSQL(this.entity).query('select').where(['id', '=', patientId]).exec().then(result => {
        return result
          })
      }

      static async apiGetPatientsByClinicSectorId (clinicSectorId) {
        return await this.api().get('/patient/clinicSector/' + clinicSectorId)
      }

    static async loadPatientWithIdentifiersEpisodeAndVisitFromServer (selectedPatient) {
      console.log(JSON.parse(JSON.stringify(selectedPatient)))
      Patient.localDbAddOrUpdate(JSON.parse(JSON.stringify(selectedPatient)))
      PatientServiceIdentifier.localDbAddOrUpdate(JSON.parse(JSON.stringify(selectedPatient.identifiers)))
      const endEpisodeType = EpisodeType.query().where('code', 'FIM').first()
      const startEpisodeType = EpisodeType.query().where('code', 'INICIO').first()
      const stopReason = StartStopReason.query().where('code', 'REFERIDO_PARA_SECTOR').first()
      const startReason = StartStopReason.query().where('code', 'MANUNTENCAO').first()
      const clinicSectorNormal = ClinicSector.query().with('clinic.*').with('clinicSectorType').where('code', 'NORMAL').first()
      const clinicSectorUser = ClinicSector.query().with('clinic.*').with('clinicSectorType').where('code', localStorage.getItem('clinic_sectors')).first()

      selectedPatient.identifiers.forEach(identifier => {
        Episode.apiGetAllByIdentifierId(identifier.id).then(resp => {
            if (resp.response.data.length > 0) {
              identifier.episodes = resp.response.data
              const lastEpisode = identifier.episodes[0]
              Episode.localDbAddOrUpdate(JSON.parse(JSON.stringify(lastEpisode)))
              const endEpispde = new Episode()
              endEpispde.episodeDate = moment().hour(0)
              endEpispde.creationDate = moment()
              endEpispde.notes = 'Fim - Carregamento na Paragem Unica'
              endEpispde.episodeType = {}
              endEpispde.episodeType.id = endEpisodeType.id
              endEpispde.episodeType_id = endEpisodeType.id
              endEpispde.patientServiceIdentifier = {}
              endEpispde.patientServiceIdentifier.id = identifier.id
              endEpispde.patientServiceIdentifier_id = identifier.id
              endEpispde.clinicSector = {}
              endEpispde.clinicSector.id = clinicSectorNormal.id
              endEpispde.clinicSector_id = clinicSectorNormal.id
              endEpispde.startStopReason = {}
              endEpispde.startStopReason.id = stopReason.id
              endEpispde.startStopReason_id = stopReason.id
              endEpispde.syncStatus = 'R'

              Episode.localDbAddOrUpdate(JSON.parse(JSON.stringify(endEpispde)))

              const startEpisode = new Episode()
              startEpisode.episodeDate = moment()
              startEpisode.creationDate = moment()
              startEpisode.notes = 'Inicio - Carregamento na Paragem Unica'
              startEpisode.episodeType = {}
              startEpisode.episodeType.id = startEpisodeType.id
              startEpisode.episodeType_id = startEpisodeType.id
              startEpisode.patientServiceIdentifier = {}
              startEpisode.patientServiceIdentifier.id = identifier.id
              startEpisode.patientServiceIdentifier_id = identifier.id
              startEpisode.clinicSector = {}
              startEpisode.clinicSector.id = clinicSectorUser.id
              startEpisode.clinicSector_id = clinicSectorUser.id
              startEpisode.startStopReason = {}
              startEpisode.startStopReason.id = startReason.id
              startEpisode.startStopReason_id = startReason.id
              startEpisode.syncStatus = 'R'

              Episode.localDbAddOrUpdate(JSON.parse(JSON.stringify(startEpisode)))
}
})
})
            const resp = await PatientVisit.apiGetLastVisitOfPatient(selectedPatient.id)
            if (resp.response.data && resp.response.data.patientVisitDetails) {
              for (let i = 0; i < resp.response.data.patientVisitDetails.length; i++) {
                const pvd = resp.response.data.patientVisitDetails[i]
                const resp1 = await PatientVisitDetails.apiFetchById(pvd.id)

                if (resp1.response.data) {
                  resp.response.data.patientVisitDetails[i] = resp1.response.data
                  const respPre = await Prescription.apiFetchById(resp.response.data.patientVisitDetails[i].prescription.id)
                  if (respPre.response.data) {
                    resp.response.data.patientVisitDetails[i].prescription = respPre.response.data
                  }
                  if (resp.response.data.patientVisitDetails[i].pack !== null) {
                    const respPack = await Pack.apiFetchById(resp.response.data.patientVisitDetails[i].pack.id)
                    if (respPack.response.data) {
                      resp.response.data.patientVisitDetails[i].pack = respPack.response.data
                    }
                  }
                }
              }
            }
            console.log(JSON.parse(JSON.stringify(resp.response.data)))
            await PatientVisit.localDbAddOrUpdate(JSON.parse(JSON.stringify(resp.response.data)))
    }
}
