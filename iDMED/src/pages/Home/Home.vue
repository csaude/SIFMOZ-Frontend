<template>
 <q-page class="flex flex-center">
  <div class="">
   <div class="row q-pa-xl q-gutter-xl">
    <div class="col">
    <router-link :to="`/patients`">
        <q-btn round>
          <q-avatar size="190px">
            <img src="~assets/patientsButton.png">
          </q-avatar>
          <q-tooltip content-class="bg-pink-4 text-white shadow-4"
                          :offset="[10, 10]"
                          transition-show="rotate"
                          transition-hide="rotate">
                 Pacientes/Utentes
                </q-tooltip>
        </q-btn>
     </router-link>
    </div>
    <div class="col">
    <router-link :to="`/group/search`">
        <q-btn round>
          <q-avatar size="190px">
            <img src="~assets/groupsButton.png">
          </q-avatar>
           <q-tooltip content-class="bg-blue text-white shadow-4"
                          :offset="[10, 10]"
                          transition-show="rotate"
                          transition-hide="rotate">
                  Grupos
                </q-tooltip>
        </q-btn>
     </router-link>
    </div>
    <div class="col">
    <router-link :to="`/stock`">
        <q-btn round>
          <q-avatar size="190px">
            <img src="~assets/stockButton.png">
          </q-avatar>
           <q-tooltip content-class="bg-blue text-white shadow-4"
                          :offset="[10, 10]"
                          transition-show="rotate"
                          transition-hide="rotate">
                  Stock
                </q-tooltip>
        </q-btn>
     </router-link>
    </div>
   </div>
   <div class="row ">
   <div class="col col-sm-3"/>
   <div class="col">
     <router-link :to="`/dashboard`">
        <q-btn round>
          <q-avatar size="190px">
            <img src="~assets/dashboardButton.png">
          </q-avatar>
          <q-tooltip content-class="text-white shadow-4"
                          :offset="[10, 10]"
                          transition-show="rotate"
                          transition-hide="rotate">
                  Dashboard
                </q-tooltip>
        </q-btn>
     </router-link>
   </div>
   <div class="col">
     <router-link :to="`/reports`">
        <q-btn round>
          <q-avatar size="190px">
            <img src="~assets/reportsButton.png">
          </q-avatar>
          <q-tooltip content-class="text-white shadow-4"
                          :offset="[10, 10]"
                          transition-show="rotate"
                          transition-hide="rotate">
                  Relatórios
                </q-tooltip>
        </q-btn>
     </router-link>
   </div>
   <div class="col-2">
      <router-link :to="`/settings`">
        <q-btn round>
          <q-avatar size="190px">
            <img src="~assets/settingsButton.png">
          </q-avatar>
          <q-tooltip content-class="bg-blue text-white shadow-4"
                          :offset="[10, 10]"
                          transition-show="rotate"
                          transition-hide="rotate">
                  Administração
                </q-tooltip>
        </q-btn>
     </router-link>
   </div>
   </div>
  </div>
  </q-page>
</template>

<script>
import { SessionStorage, QSpinnerBall } from 'quasar'
import Clinic from '../../store/models/clinic/Clinic'
import District from '../../store/models/district/District'
import Province from '../../store/models/province/Province'
import Patient from '../../store/models/patient/Patient'
import ClinicalService from '../../store/models/ClinicalService/ClinicalService'
import ClinicSector from '../../store/models/clinicSector/ClinicSector'
import IdentifierType from '../../store/models/identifierType/IdentifierType'
import PatientServiceIdentifier from '../../store/models/patientServiceIdentifier/PatientServiceIdentifier'
import EpisodeType from '../../store/models/episodeType/EpisodeType'
import StartStopReason from '../../store/models/startStopReason/StartStopReason'
import Episode from '../../store/models/episode/Episode'
import ClinicalServiceAttributeType from '../../store/models/ClinicalServiceAttributeType/ClinicalServiceAttributeType'
import ClinicalServiceAttribute from '../../store/models/ClinicalServiceAttribute/ClinicalServiceAttribute'
import Drug from '../../store/models/drug/Drug'
import TherapeuticRegimen from '../../store/models/therapeuticRegimen/TherapeuticRegimen'
import TherapeuticLine from '../../store/models/therapeuticLine/TherapeuticLine'
import Form from '../../store/models/form/Form'
import Duration from '../../store/models/Duration/Duration'
// import Doctor from '../../store/models/doctor/Doctor'
import DispenseType from '../../store/models/dispenseType/DispenseType'
import PatientVisit from '../../store/models/patientVisit/PatientVisit'
import PatientVisitDetails from '../../store/models/patientVisitDetails/PatientVisitDetails'
import Pack from '../../store/models/packaging/Pack'
import Prescription from '../../store/models/prescription/Prescription'
import RAMScreening from '../../store/models/screening/RAMScreening'
import AdherenceScreening from '../../store/models/screening/AdherenceScreening'
import PregnancyScreening from '../../store/models/screening/PregnancyScreening'
import TBScreening from '../../store/models/screening/TBScreening'
import VitalSignsScreening from '../../store/models/screening/VitalSignsScreening'
import FacilityType from '../../store/models/facilityType/FacilityType'
import InteroperabilityType from '../../store/models/interoperabilityType/InteroperabilityType'
import InteroperabilityAttribute from '../../store/models/interoperabilityAttribute/InteroperabilityAttribute'
import HealthInformationSystem from '../../store/models/healthInformationSystem/HealthInformationSystem'
import StockCenter from '../../store/models/stockcenter/StockCenter'
import StockEntrance from '../../store/models/stockentrance/StockEntrance'
import Stock from '../../store/models/stock/Stock'
import { InventoryStockAdjustment } from '../../store/models/stockadjustment/InventoryStockAdjustment'
import Inventory from '../../store/models/stockinventory/Inventory'
import StockOperationType from '../../store/models/stockoperation/StockOperationType'
import ReferedStockMoviment from '../../store/models/stockrefered/ReferedStockMoviment'
import DestroyedStock from '../../store/models/stockdestruction/DestroyedStock'
export default {
    components: {
    },
    methods: {
      loadAppParameters () {
        Duration.apiGetAll()
        Province.apiGetAll()
        District.apiGetAll()
        // this.getAllInventoriesOfClinic()
        ClinicalServiceAttributeType.apiGetAll()
        ClinicalService.apiGetAll()
        ClinicSector.apiGetAll()
        IdentifierType.apiGetAll()
        EpisodeType.apiGetAll()
        FacilityType.apiGetAll()
        StartStopReason.apiGetAll()
        ClinicalServiceAttribute.apiGetAll()
        Drug.apiGetAll(0, 100)
        TherapeuticRegimen.apiGetAll()
        TherapeuticLine.apiGetAll()
        Form.apiGetAll()
      //  Doctor.apiFetchByClinicId(this.clinic.id)
        DispenseType.apiGetAll()
        Clinic.apiGetAll()
        RAMScreening.apiGetAll()
        AdherenceScreening.apiGetAll()
        PregnancyScreening.apiGetAll()
        TBScreening.apiGetAll()
        VitalSignsScreening.apiGetAll()
        InteroperabilityType.apiGetAll(0, 100)
        InteroperabilityAttribute.apiGetAll()
        HealthInformationSystem.apiGetAll()
        StockCenter.apiGetAll()
        Stock.apiGetAll()
        InventoryStockAdjustment.apiGetAll()
        StockOperationType.apiGetAll()
        ReferedStockMoviment.apiGetAll()
        DestroyedStock.apiGetAll()
      },
      saveCurrClinic () {
        Clinic.apiFetchById('ff8081817c668dcc017c66dc3d330002').then(resp => {
          SessionStorage.set('currClinic', resp.response.data)
        })
      },
      getAllInventoriesOfClinic () {
        const offset = 0
        const max = 100
        this.doInventoryGet(this.clinic.id, offset, max)
      },
      getAllStockOfClinic () {
        const offset = 0
        const max = 100
        this.doStockEntranceGet(this.clinic.id, offset, max)
      },
      getAllPatientVisitsOfClinic () {
        const offset = 0
        const max = 100
        this.doPatientVisitGet(this.clinic.id, offset, max)
      },
      getAlPatientVisitDetailsOfClinic () {
        const offset = 0
        const max = 100
        this.doPatientVisitDetailsGet(this.clinic.id, offset, max)
      },
      getAllPatientsOfClinic () {
        const offset = 0
        const max = 100
        this.doPatientGet(this.clinic.id, offset, max)
      },
      getAllIdentifiersOfClinic () {
        const offset = 0
        const max = 100
        this.doIdentifiersGet(this.clinic.id, offset, max)
      },
      getAllEpisodesOfClinic () {
        const offset = 0
        const max = 100
        this.doEpisodeGet(this.clinic.id, offset, max)
      },
      getAllPrescriptionOfClinic () {
        const offset = 0
        const max = 100
        this.doPrescriptionkGet(this.clinic.id, offset, max)
      },
      getAllPacksOfClinic () {
        const offset = 0
        const max = 100
        this.doPackGet(this.clinic.id, offset, max)
      },
      doInventoryGet (clinicId, offset, max) {
        Inventory.apiGetAllByClinicId(clinicId, offset, max).then(resp => {
              if (resp.response.data.length > 0) {
                offset = offset + max
                setTimeout(this.doInventoryGet(clinicId, offset, max), 2)
              }
          }).catch(error => {
              console.log(error)
          })
      },
      doPackGet (clinicId, offset, max) {
        Pack.apiGetAllByClinicId(clinicId, offset, max).then(resp => {
              // if (resp.response.data.length > 0) {
              //   offset = offset + max
              //   setTimeout(this.doPackGet(clinicId, offset, max), 2)
              // }
          }).catch(error => {
              console.log(error)
          })
      },
      doStockEntranceGet (clinicId, offset, max) {
        StockEntrance.apiGetAllByClinicId(clinicId, offset, max).then(resp => {
              if (resp.response.data.length > 0) {
                offset = offset + max
                setTimeout(this.doStockEntranceGet(clinicId, offset, max), 2)
              }
          }).catch(error => {
              console.log(error)
          })
      },
      doPrescriptionkGet (clinicId, offset, max) {
        Prescription.apiGetAllByClinicId(clinicId, offset, max).then(resp => {
              if (resp.response.data.length > 0) {
                offset = offset + max
                setTimeout(this.doPrescriptionkGet(clinicId, offset, max), 2)
              }
          }).catch(error => {
              console.log(error)
          })
      },
      doEpisodeGet (clinicId, offset, max) {
        Episode.apiGetAllByClinicId(clinicId, offset, max).then(resp => {
              if (resp.response.data.length > 0) {
                offset = offset + max
                setTimeout(this.doEpisodeGet(clinicId, offset, max), 2)
              }
          }).catch(error => {
              console.log(error)
          })
      },
      doPatientVisitDetailsGet (clinicId, offset, max) {
        PatientVisitDetails.apiGetAllByClinicId(clinicId, offset, max).then(resp => {
              if (resp.response.data.length > 0) {
                offset = offset + max
                setTimeout(this.doPatientVisitDetailsGet(clinicId, offset, max), 2)
              }
          }).catch(error => {
              console.log(error)
          })
      },
      doPatientGet (clinicId, offset, max) {
        Patient.apiGetAllByClinicId(clinicId, offset, max).then(resp => {
              if (resp.response.data.length > 0) {
                offset = offset + max
                setTimeout(this.doPatientGet(clinicId, offset, max), 2)
              }
          }).catch(error => {
              console.log(error)
          })
      },
      doPatientVisitGet (clinicId, offset, max) {
        PatientVisit.apiGetAllByClinicId(clinicId, offset, max).then(resp => {
              if (resp.response.data.length > 0) {
                offset = offset + max
                setTimeout(this.doPatientVisitGet(clinicId, offset, max), 2)
              }
          }).catch(error => {
              console.log(error)
          })
      },
      doIdentifiersGet (clinicId, offset, max) {
        PatientServiceIdentifier.apiGetAllByClinicId(clinicId, offset, max).then(resp => {
              if (resp.response.data.length > 0) {
                offset = offset + max
                setTimeout(this.doIdentifiersGet(clinicId, offset, max), 2)
              }
          }).catch(error => {
              console.log(error)
          })
      }
    },
    mounted () {
      this.loadAppParameters()
      // this.getAllPatientsOfClinic()
      // this.getAllIdentifiersOfClinic()
      // this.getAllPrescriptionOfClinic()
      // this.getAllEpisodesOfClinic()
      // this.getAllPatientVisitsOfClinic()
      // this.getAllPacksOfClinic()
      // this.getAlPatientVisitDetailsOfClinic()
      // PackagedDrug.apiGetAll()
      // PrescribedDrug.apiGetAll()
      // PrescriptionDetail.apiGetAll()
    },
    created () {
      this.$q.loading.show({
      message: 'Carregando ...',
      spinnerColor: 'grey-4',
      spinner: QSpinnerBall
      // delay: 400 // ms
    })

    setTimeout(() => {
      this.$q.loading.hide()
    }, 600)
      this.saveCurrClinic()
    },
    computed: {
      /*
      clinic: {
        get () {
          return Clinic.query()
                    .with('province')
                    .where('id', SessionStorage.getItem('currClinic').id)
                    .first()
        }
      } */
      /*
      clinic: {
        get () {
          return new Clinic(SessionStorage.getItem('currClinic'))
        }
      } */
      clinic: {
        get () {
          return new Clinic(SessionStorage.getItem('currClinic'))
        }
      }
      /*
      clinic () {
        return new Clinic(SessionStorage.getItem('currClinic'))
      } */
    }
}
</script>

<style>

</style>
