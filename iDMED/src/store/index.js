// import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import VuexORM from '@vuex-orm/core'
// import datePlugin from 'vuex-orm-plugin-date-attribute'
import VuexORMAxios from '@vuex-orm/plugin-axios'
import Country from './models/country/Country'
import Province from './models/province/Province'
import District from './models/district/District'
import City from './models/city/City'
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
import PatientServiceIdentifier from './models/patientServiceIdentifier/PatientServiceIdentifier'
import ClinicalService from './models/ClinicalService/ClinicalService'
import StartStopReason from './models/startStopReason/StartStopReason'
import TherapeuticRegimen from './models/therapeuticRegimen/TherapeuticRegimen'
import Stock from './models/stock/Stock'
import { StockAdjustment, InventoryStockAdjustment, StockDestructionAdjustment, StockReferenceAdjustment } from './models/stockadjustment/StockAdjustmentHierarchy'
import StockCenter from './models/stockcenter/StockCenter'
import DestroyedStock from './models/stockdestruction/DestroyedStock'
import StockEntrance from './models/stockentrance/StockEntrance'
import Inventory from './models/stockinventory/Inventory'
import StockLevel from './models/stocklevel/StockLevel'
import StockOperationType from './models/stockoperation/StockOperationType'
import ReferedStockMoviment from './models/stockrefered/ReferedStockMoviment'
import AdherenceScreening from './models/screening/AdherenceScreening'
import PregnancyScreening from './models/screening/PregnancyScreening'
import RAMScreening from './models/screening/RAMScreening'
import VitalSignsScreening from './models/screening/VitalSignsScreening'
import TBScreening from './models/screening/TBScreening'
import Localidade from './models/Localidade/Localidade'
import PostoAdministrativo from './models/PostoAdministrativo/PostoAdministrativo'
import ClinicalServiceAttributeType from './models/ClinicalServiceAttributeType/ClinicalServiceAttributeType'
import ClinicalServiceAttribute from './models/ClinicalServiceAttribute/ClinicalServiceAttribute'
import PatientVisitDetails from './models/patientVisitDetails/PatientVisitDetails'
import Doctor from './models/doctor/Doctor'
import Form from './models/form/Form'
import TherapeuticLine from './models/therapeuticLine/TherapeuticLine'
import DispenseType from './models/dispenseType/DispenseType'
import Duration from './models/Duration/Duration'
import TherapeuticRegimensDrug from './models/TherapeuticRegimensDrug/TherapeuticRegimensDrug'
import PatientVisit from './models/patientVisit/PatientVisit'
import Pack from './models/packaging/Pack'
import PackagedDrug from './models/packagedDrug/PackagedDrug'
import Prescription from './models/prescription/Prescription'
import PrescriptionDetail from './models/prescriptionDetails/PrescriptionDetail'
import PrescribedDrug from './models/prescriptionDrug/PrescribedDrug'
import HealthInformationSystem from './models/healthInformationSystem/HealthInformationSystem'
import InteroperbilityAttribute from './models/interoperabilityAttribute/InteroperabilityAttribute'
import InteroperabilityType from './models/interoperabilityType/InteroperabilityType'
import ClinicalServiceSector from './models/ClinicalServiceClinicSector/ClinicalServiceSector'
import DispenseMode from './models/dispenseMode/DispenseMode'
import PackagedDrugStock from './models/packagedDrug/PackagedDrugStock'
import GroupPackHeader from './models/group/GroupPackHeader'
import GroupPack from './models/group/GroupPack'
import Report from './models/report/Report'
import PatientTransReferenceType from './models/tansreference/PatientTransReferenceType'
import PatientTransReference from './models/tansreference/PatientTransReference'
import ClinicSectorType from './models/clinicSectorType/ClinicSectorType'
import SpetialPrescriptionMotive from './models/prescription/SpetialPrescriptionMotive'
import ProvincialServer from './models/provincialServer/ProvincialServer'
import SystemConfigs from './models/systemConfigs/SystemConfigs'

// Vue.use(Vuex)

VuexORM.use(VuexORMAxios, {
  axios,
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  },
 // baseURL: 'http://172.104.236.126:5110/'
  baseURL: 'http://localhost:8884/'
})

// VuexORM.use(datePlugin)

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
database.register(PatientServiceIdentifier)
database.register(ClinicalService)
database.register(StartStopReason)
database.register(TherapeuticRegimen)
database.register(Stock)
database.register(StockAdjustment)
database.register(InventoryStockAdjustment)
database.register(StockDestructionAdjustment)
database.register(StockReferenceAdjustment)
database.register(StockCenter)
database.register(DestroyedStock)
database.register(StockEntrance)
database.register(Inventory)
database.register(StockLevel)
database.register(StockOperationType)
database.register(ReferedStockMoviment)
database.register(AdherenceScreening)
database.register(PregnancyScreening)
database.register(RAMScreening)
database.register(VitalSignsScreening)
database.register(TBScreening)
database.register(Localidade)
database.register(PostoAdministrativo)
database.register(ClinicalServiceAttributeType)
database.register(ClinicalServiceAttribute)
database.register(PatientVisitDetails)
database.register(Doctor)
database.register(Form)
database.register(TherapeuticLine)
database.register(DispenseType)
database.register(DispenseMode)
database.register(Duration)
database.register(TherapeuticRegimensDrug)
database.register(PatientVisit)
database.register(Pack)
database.register(PackagedDrug)
database.register(Prescription)
database.register(PrescriptionDetail)
database.register(PrescribedDrug)
database.register(HealthInformationSystem)
database.register(InteroperbilityAttribute)
database.register(InteroperabilityType)
database.register(ClinicalServiceSector)
database.register(PackagedDrugStock)
database.register(GroupPackHeader)
database.register(GroupPack)
database.register(Report)
database.register(PatientTransReferenceType)
database.register(PatientTransReference)
database.register(ClinicSectorType)
database.register(SpetialPrescriptionMotive)
database.register(ProvincialServer)
database.register(SystemConfigs)

export default new Vuex.Store({
  plugins: [VuexORM.install(database)]
})
