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
import { SessionStorage, QSpinnerBall, useQuasar } from 'quasar'
import Clinic from '../../store/models/clinic/Clinic'
import District from '../../store/models/district/District'
import Province from '../../store/models/province/Province'
import Patient from '../../store/models/patient/Patient'
import ClinicalService from '../../store/models/ClinicalService/ClinicalService'
import ClinicSector from '../../store/models/clinicSector/ClinicSector'
import IdentifierType from '../../store/models/identifierType/IdentifierType'
import EpisodeType from '../../store/models/episodeType/EpisodeType'
import StartStopReason from '../../store/models/startStopReason/StartStopReason'
import ClinicalServiceAttributeType from '../../store/models/ClinicalServiceAttributeType/ClinicalServiceAttributeType'
import ClinicalServiceAttribute from '../../store/models/ClinicalServiceAttribute/ClinicalServiceAttribute'
import Drug from '../../store/models/drug/Drug'
import TherapeuticRegimen from '../../store/models/therapeuticRegimen/TherapeuticRegimen'
import TherapeuticLine from '../../store/models/therapeuticLine/TherapeuticLine'
import Form from '../../store/models/form/Form'
import Duration from '../../store/models/Duration/Duration'
// import Doctor from '../../store/models/doctor/Doctor'
import DispenseType from '../../store/models/dispenseType/DispenseType'
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
import PatientTransReferenceType from '../../store/models/tansreference/PatientTransReferenceType'
import ClinicSectorType from '../../store/models/clinicSectorType/ClinicSectorType'
import SpetialPrescriptionMotive from '../../store/models/prescription/SpetialPrescriptionMotive'
import ProvincialServer from '../../store/models/provincialServer/ProvincialServer'
export default {
  data () {
    return {
      $q: useQuasar()
    }
  },
    methods: {
      showloading () {
      console.log('loaging')
       this.$q.loading.show({
          spinner: QSpinnerBall,
          spinnerColor: 'gray',
          spinnerSize: 140,
          message: 'Carregando, aguarde por favor...',
          messageColor: 'white'
        })
    },
    hideLoading () {
      this.$q.loading.hide()
    },
      loadAppParameters () {
        const offset = 0
        const max = 100
        Duration.apiGetAll(offset, max)
        Province.apiGetAll(offset, max)
        District.apiGetAll(offset, max)
        ClinicalServiceAttributeType.apiGetAll(offset, max)
        ClinicalService.apiGetAll(offset, max)
        ClinicSector.apiGetAll(offset, max)
        IdentifierType.apiGetAll(offset, max)
        EpisodeType.apiGetAll(offset, max)
        FacilityType.apiGetAll(offset, max)
        StartStopReason.apiGetAll(offset, max)
        ClinicalServiceAttribute.apiGetAll(offset, max)
        Drug.apiGetAll(offset, max)
        TherapeuticRegimen.apiGetAll(offset, max)
        TherapeuticLine.apiGetAll(offset, max)
        Form.apiGetAll(offset, max)
        DispenseType.apiGetAll(offset, max)
        this.getAllClinic()
       // Clinic.apiGetAll(offset, max)
        InteroperabilityType.apiGetAll(offset, max)
        InteroperabilityAttribute.apiGetAll(offset, max)
        HealthInformationSystem.apiGetAll(offset, max)
        StockCenter.apiGetAll(offset, max)
        Stock.apiGetAll(offset, max)
        InventoryStockAdjustment.apiGetAll(offset, max)
        StockOperationType.apiGetAll(offset, max)
        ReferedStockMoviment.apiGetAll(offset, max)
        DestroyedStock.apiGetAll(offset, max)
        FacilityType.apiGetAll(offset, max)
        ClinicSectorType.apiGetAll(offset, max)
        PatientTransReferenceType.apiGetAll(offset, max)
        SpetialPrescriptionMotive.apiGetAll(offset, max)
        ProvincialServer.apiGetAll().then(resp => {
          console.log(resp)
            this.hideLoading()
        })
      },
      saveCurrClinic () {
        // Clinic.apiGetAll(0, 200).then(resp => {
        //   const mainClinic = resp.response.data.filter(clinic => {
        //     return clinic.mainClinic
        //   })
          SessionStorage.set('currClinic', Clinic.query().where('mainClinic', true).get())
        // })
      },
      getAllClinic () {
        const offset = 0
        const max = 100
        this.doClinicGet(offset, max)
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
      getAllPatientsOfClinic () {
        const offset = 0
        const max = 100
        this.doPatientGet(SessionStorage.getItem('currClinic').id, offset, max)
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
    doClinicGet (offset, max) {
          Clinic.apiGetAll(offset, max).then(resp => {
                if (resp.response.data.length > 0) {
                  offset = offset + max
                  setTimeout(this.doClinicGet(offset, max), 2)
                }
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
      doPatientGet (clinicId, offset, max) {
        Patient.apiGetAllByClinicId(clinicId, offset, max).then(resp => {
              if (resp.response.data.length > 0) {
                offset = offset + max
                setTimeout(this.doPatientGet(clinicId, offset, max), 2)
              }
          }).catch(error => {
              console.log(error)
          })
      }
    },
    mounted () {
      setTimeout(() => {
      this.loadAppParameters()
     }, 3000)
     setTimeout(() => {
      this.getAllPatientsOfClinic()
     }, 4000)
    },
    created () {
      this.showloading()
      this.saveCurrClinic()
    },
    computed: {
      clinic () {
        return Clinic.query()
                   .with('province')
                   .with('facilityType')
                   .with('district.province')
                   .where('id', SessionStorage.getItem('currClinic').id)
                   .first()
      }
    }
}
</script>

<style>

</style>
