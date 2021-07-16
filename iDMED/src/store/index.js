// import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import VuexORM from '@vuex-orm/core'
import VuexORMAxios from '@vuex-orm/plugin-axios'
import Country from './models/country/Country'
import Province from './models/province/Province'
import District from './models/district/District'
import City from './models/city/city'
import Appointment from './models/appointment/Appointment'
import AttributeType from './models/attributeType/AttributeType'
import Clinic from './models/clinic/Clinic'
import ClinicSector from './models/clinicSector/ClinicSector'
import Drug from './models/drug/Drug'
import Episode from './models/episode/Episode'
import EpisodeType from './models/episodeType/EpisodeType'
import FacilityType from './models/facilityType/FacilityType'
import Group from './models/group/Group'
import GroupMember from './models/groupMember/GroupMember'
import GroupType from './models/groupType/GroupType'
import IdentifierType from './models/identifierType/IdentifierType'
import NationalClinic from './models/nationalClinic/NationalClinic'
import Patient from './models/patient/Patient'
import PatientAttribute from './models/patientAttribute/PatientAttribute'
import PatientProgramIdentifier from './models/patientProgramIdentifier/PatientProgramIdentifier'
import Program from './models/program/Program'
import ProgramAttributeType from './models/programAttributeType/ProgramAttributeType'
import StartStopReason from './models/startStopReason/StartStopReason'
import TherapeuticRegimen from './models/therapeuticRegimen/TherapeuticRegimen'

// Vue.use(Vuex)

VuexORM.use(VuexORMAxios, {
  axios,
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  },
  baseURL: 'http://localhost:8081/api'
})

const database = new VuexORM.Database()
database.register(Country)
database.register(Province)
database.register(District)
database.register(City)
database.register(Appointment)
database.register(AttributeType)
database.register(Clinic)
database.register(ClinicSector)
database.register(Drug)
database.register(Episode)
database.register(EpisodeType)
database.register(FacilityType)
database.register(Group)
database.register(GroupMember)
database.register(GroupType)
database.register(IdentifierType)
database.register(NationalClinic)
database.register(Patient)
database.register(PatientAttribute)
database.register(PatientProgramIdentifier)
database.register(Program)
database.register(ProgramAttributeType)
database.register(StartStopReason)
database.register(TherapeuticRegimen)

export default new Vuex.Store({
  plugins: [VuexORM.install(database)]
})
