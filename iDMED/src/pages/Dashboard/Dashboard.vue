<template>
<div>
   <Charts :dataLoaded=dataLoaded> </Charts>
</div>
</template>

<script>
 import { SessionStorage, QSpinnerBall } from 'quasar'
  import { ref } from 'vue'
 import Episode from '../../store/models/episode/Episode'
import Prescription from '../../store/models/prescription/Prescription'
import PatientVisitDetails from '../../store/models/patientVisitDetails/PatientVisitDetails'
import Patient from '../../store/models/patient/Patient'
import PatientVisit from '../../store/models/patientVisit/PatientVisit'
import PatientServiceIdentifier from '../../store/models/patientServiceIdentifier/PatientServiceIdentifier'
import Clinic from '../../store/models/clinic/Clinic'
 import Pack from 'src/store/models/packaging/Pack'
import Duration from 'src/store/models/Duration/Duration'
import Province from 'src/store/models/province/Province'
import District from 'src/store/models/district/District'
import ClinicalServiceAttributeType from 'src/store/models/ClinicalServiceAttributeType/ClinicalServiceAttributeType'
import ClinicalService from 'src/store/models/ClinicalService/ClinicalService'
import ClinicSector from 'src/store/models/clinicSector/ClinicSector'
import IdentifierType from 'src/store/models/identifierType/IdentifierType'
import EpisodeType from 'src/store/models/episodeType/EpisodeType'
import FacilityType from 'src/store/models/facilityType/FacilityType'
import StartStopReason from 'src/store/models/startStopReason/StartStopReason'
import ClinicalServiceAttribute from 'src/store/models/ClinicalServiceAttribute/ClinicalServiceAttribute'
import Drug from 'src/store/models/drug/Drug'
import TherapeuticRegimen from 'src/store/models/therapeuticRegimen/TherapeuticRegimen'
import TherapeuticLine from 'src/store/models/therapeuticLine/TherapeuticLine'
import Form from 'src/store/models/form/Form'
import DispenseType from 'src/store/models/dispenseType/DispenseType'
import StockOperationType from 'src/store/models/stockoperation/StockOperationType'
import ClinicSectorType from 'src/store/models/clinicSectorType/ClinicSectorType'
import PatientTransReferenceType from 'src/store/models/tansreference/PatientTransReferenceType'
export default {
   data () {
     return {
       dataLoaded: ref(false)
     }
   },
    components: {
     //     BarByDispenseType: require('components/Dashboard/ApexCharts/BarReportDispenseType1.vue').default,
     //    LineByAge: require('components/Dashboard/ApexCharts/LineChartAgeTarv.vue').default,
      //    LineByAgeTB: require('components/Dashboard/ApexCharts/LineChartAgeTb.vue').default,
       //     BarTB: require('components/Dashboard/ApexCharts/BarReportTPTInitial.vue').default, PieGenderChart
      //    PieGenderChart: require('components/Dashboard/ApexCharts/PieGenderChart.vue').default,
      //       LineBySex: require('components/Dashboard/ApexCharts/LineChartSex.vue').default,
       //        HeatMapDispenseTypeAge: require('components/Dashboard/ApexCharts/HeatMap.vue').default
        Charts: require('components/Dashboard/ApexCharts/Charts.vue').default
    },
    methods: {
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
        Clinic.apiGetAll(offset, max)
        StockOperationType.apiGetAll(offset, max)
        FacilityType.apiGetAll(offset, max)
        ClinicSectorType.apiGetAll(offset, max)
        PatientTransReferenceType.apiGetAll(offset, max)
      },
 loadData () {
     const offset = 0
      const max = 0
      const clinicId = 'ff8081817c668dcc017c66dc3d330002'
    this.doPrescriptionGet(clinicId, offset, max)
    //  this.doEpisodeGet(clinicId, offset, max)
       this.doPatientVisitDetailsGet(clinicId, offset, max)
         this.doPatientGet(clinicId, offset, max)
          this.doPatientVisitGet(clinicId, offset, max)
          this.doIdentifiersGet(clinicId, offset, max)
           // doPatientVisitGet(clinicId, offset, max)
  },
    doPrescriptionGet (clinicId, offset, max) {
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
        PatientServiceIdentifier.api().get('/patientServiceIdentifier/clinic/' + clinicId).then(resp => {
              //  this.$q.loading.hide()
              if (resp.response.data.length > 0) {
                offset = offset + max
                setTimeout(this.doIdentifiersGet(clinicId, offset, max), 2)
              }
          }).catch(error => {
              console.log(error)
          })
      }
    },
    computed: {
       clinic: {
        get () {
          return new Clinic(SessionStorage.getItem('currClinic'))
        }
      }
    },
    mounted () {
       this.loadAppParameters()
       Episode.apiGetAllByClinicId('ff8081817c668dcc017c66dc3d330002').then(resp => {
       console.log(resp)
     //  console.log(this.patientMensTarv)
     Prescription.apiGetAllByClinicId('ff8081817c668dcc017c66dc3d330002', 0, 100).then(resp => {
        console.log(resp)
    //    this.$q.loading.hide() apiGetByClinicId
        PatientVisitDetails.apiGetAllByClinicId('ff8081817c668dcc017c66dc3d330002', 0, 100).then(resp => {
           console.log(resp)
         PatientVisit.apiGetAllByClinicId('ff8081817c668dcc017c66dc3d330002', 0, 100).then(resp => {
            console.log(resp)
             PatientServiceIdentifier.apiGetAllByClinicId('ff8081817c668dcc017c66dc3d330002', 0, 100).then(resp => {
              Pack.apiGetAllByClinicId('ff8081817c668dcc017c66dc3d330002', 0, 100).then(resp => {
               console.log(resp)
               this.dataLoaded = true
            this.$q.loading.hide()
           })
             })
     })
     })
     })
      })
    },
     created () {
         this.$q.loading.show({
      message: 'Carregando Relatorio...',
      spinnerColor: 'grey-4',
      spinner: QSpinnerBall
      // delay: 400 // ms
    })
  }
}
</script>

<style>

</style>
