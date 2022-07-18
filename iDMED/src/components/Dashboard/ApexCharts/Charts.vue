<template>
<div>
<div class="q-mt-lg">
<div class="row">
<div class="col q-ml-md" v-for="(item) in this.clinicalServiceReports" :key="item.id">
  <q-btn :color=item.colour @click="setServiceCode(item.code)" :style=item.style>
      <q-icon left size="6em" :name=item.icon  />
      <div >Serviço  {{item.code}} <br> {{this.patientByServiceCode(item.code).length}} Pacientes Activos ao Levantamento </div>
    </q-btn>
    </div>
</div>
</div>
  <div class="q-mt-lg">
  <p align="center"> <strong>Serviço {{serviceCode}} </strong></p>
  </div>
        <div class="q-mt-lg">
          <BarByDispenseType class="graph-conainer" v-bind:serviceCode=serviceCode :dataLoaded=dataLoaded > </BarByDispenseType>
        <div
      class=""
      key="allCharts"
    >
    <div class="row">
      <LineByAge class="col graph-conainer" :serviceCode=serviceCode :dataLoaded=dataLoaded > </LineByAge>
      <PieGenderChart class="col graph-conainer" :serviceCode=serviceCode > </PieGenderChart>
      <LineBySex class="col graph-conainer" :serviceCode=serviceCode :dataLoaded=dataLoaded> </LineBySex>
    </div>
      <div class="row" >
        <DispenseTypeByAgeTable class="q-ma-md" :serviceCode=serviceCode :dataLoaded=dataLoaded > </DispenseTypeByAgeTable>
      </div>
      <div class="row q-mt-md justify-center">
        <StockReport class="q-mb-lg" :isCharts= true :dataLoaded=dataLoaded :serviceCode=serviceCode > </StockReport>
      </div>
    </div>
         </div>
</div>
</template>

<script>
 // import { QSpinnerBall } from 'quasar'
 import { ref } from 'vue'
import PatientServiceIdentifier from '../../../store/models/patientServiceIdentifier/PatientServiceIdentifier'
import ClinicalService from '../../../store/models/ClinicalService/ClinicalService'
import EpisodeType from 'src/store/models/episodeType/EpisodeType'
export default {
     props: ['dataLoaded'],
    data () {
        return {
         serviceCode: '',
         isTARV: ref(false),
         isTB: ref(false),
         isPrep: ref(false),
         isAll: ref(true),
         clinicalServiceReports: []
        }
    },
    components: {
          BarByDispenseType: require('components/Dashboard/ApexCharts/BarReportDispenseType1.vue').default,
         LineByAge: require('components/Dashboard/ApexCharts/LineChartAgeTarv.vue').default,
      //    LineByAgeTB: require('components/Dashboard/ApexCharts/LineChartAgeTb.vue').default,
       //     BarTB: require('components/Dashboard/ApexCharts/BarReportTPTInitial.vue').default, PieGenderChart
          PieGenderChart: require('components/Dashboard/ApexCharts/PieGenderChart.vue').default,
             LineBySex: require('components/Dashboard/ApexCharts/LineChartSex.vue').default,
         //      HeatMapDispenseTypeAge: require('components/Dashboard/ApexCharts/HeatMap.vue').default,
                 DispenseTypeByAgeTable: require('components/Dashboard/ApexCharts/DispenseTypeByAgeTable.vue').default,
                   StockReport: require('components/Dashboard/ApexCharts/StockReport.vue').default
    },
    methods: {
 loadData () {
   //  const offset = 0
    //  const max = 0
     // const clinicId = 'ff8081817c668dcc017c66dc3d330002'
   //  this.doPrescriptionGet(clinicId, offset, max)
     // this.doEpisodeGet(clinicId, offset, max)
   //    this.doPatientVisitDetailsGet(clinicId, offset, max)
    //     this.doPatientGet(clinicId, offset, max) doIdentifiersGet
 //         this.doPatientVisitGet(clinicId, offset, max)
     //      this.doIdentifiersGet(clinicId, offset, max)
          //  doPatientVisitGet(clinicId, offset, max)
  },
  setServiceCode (code) {
     this.serviceCode = code
     if (code === 'TPT') {
      this.isTARV = false
       this.isTB = false
        this.isPrep = false
      //   this.isAll = true
     } else if (code === 'TARV') {
         this.isTARV = false
         this.isTB = false
         this.isPrep = false
        //  this.isAll = true
     } else if (code === 'PREP') {
         this.isTARV = false
         this.isTB = false
         this.isPrep = false
        //  this.isAll = true
     }
  },
      getClinicalServicesOptions () {
        for (const item of this.clinicalServices) {
          const patients = this.patientByServiceCode(item.code)
            if (patients.length > 0) {
              if (item.code === 'TARV') {
                  item.colour = 'green'
                  item.icon = 'medication'
                  this.clinicalServiceReports.splice(0, 0, item)
              } else if (item.code === 'TPT') {
                  item.colour = 'red'
                   item.icon = 'vaccines'
                      this.clinicalServiceReports.splice(1, 0, item)
              } else if (item.code === 'PREP') {
                  item.colour = 'teal'
                   item.icon = 'health_and_safety'
                     this.clinicalServiceReports.splice(2, 0, item)
              } else {
                 item.icon = 'health_and_safety'
                const exists = localStorage.getItem(item.code)
                 this.clinicalServiceReports.splice(3, 0, item)
                if (exists === null) {
               const randomColor = require('randomcolor') // import the script
                   const color = randomColor() // a hex code for an attractive color
                   console.log(color)
                   item.style = 'background-color:' + color + ';' + 'color: ##ffffff'
                    localStorage.setItem(item.code, 'background-color:' + color + ';' + 'color: ##ffffff')
                } else {
                   item.style = exists
                }
              }
            //  this.clinicalServiceReports.push(item)
            }
        }
      },
      patientByServiceCode (serviceCode) {
         return PatientServiceIdentifier.query()
                           .with('identifierType')
                            .with('service')
                             .where((patientServiceIdentifier) => {
                                 return patientServiceIdentifier.endDate === null
                              })
                             .whereHas('service', (query) => {
                              query.where((service) => {
                                 return service.code === serviceCode
                              })
                              })
                               .whereHas('episodes', (query) => {
                              query.where((episodes) => {
                                  console.log(episodes)
                                   return episodes.episode_type_id === this.episodeTypeInitial.id
                              })
                              }).get()
         }
    },
    computed: {
      getCodeService () {
        return this.serviceCode
      },
         clinicalServices () {
          return ClinicalService.query().with('attributes.clinicalServiceAttributeType')
          .with('identifierType')
          .with('therapeuticRegimens')
          .with('clinicSectors.clinic')
          .has('code').get()
      },
       episodeTypeInitial () {
          return EpisodeType.query().where((episodeType) => {
                                 return episodeType.code === 'INICIO'
                              }).get()
      }
    },
    mounted () {
     //  this.loadData()
    //   this.getClinicalServicesOptions()
    },
     created () {
  },
   watch: {
         dataLoaded: function (newVal, oldVal) {
          console.log('Prop changed: ', newVal, ' | was: ', oldVal)
          this.getClinicalServicesOptions()
          this.serviceCode = 'TARV'
          this.setServiceCode('TARV')
        }
     }
}
</script>

<style lang="scss">
    .graph-conainer {
      border: 1px solid $grey-13;
      border-radius: 10px;
      margin: 15px;
      padding: 15px;
      background-color: $light-green-1;
    }
</style>
