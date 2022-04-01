<template>
<div>
<div class="q-mt-lg">
<div class="row">
<div class="col q-ml-md" v-for="(item) in this.clinicalServiceReports" :key="item.id">
  <q-btn :color=item.colour @click="setServiceCode(item.code)" :style=item.style>
      <q-icon left size="6em" :name=item.icon  />
      <div >Serviço  {{item.code}} <br> {{this.patientByServiceCode(item.code).length}} Pacientes Activos ao Tratamento </div>
    </q-btn>
    </div>
</div>
</div>
  <div class="q-mt-lg">
  <p align="center"> <strong>Serviço {{serviceCode}} </strong></p>
  </div>
         <div class="q-mt-lg">
          <BarByDispenseType :serviceCode=serviceCode :dataLoaded=dataLoaded > </BarByDispenseType>
             <div
      class="row q-col-gutter-md q-px-md q-py-md"
      key="allCharts"
    >
    <div class="col-md-6 col-sm-12 col-xs-12">
              <LineByAge :serviceCode=serviceCode > </LineByAge>
    </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
           <LineBySex :serviceCode=serviceCode > </LineBySex>
      </div>
          <div
      class="row q-col-gutter-md q-px-md q-py-md"
      key="allCharts"
    >
    <div class="col-md-6 col-sm-12 col-xs-12">
              <PieGenderChart :serviceCode=serviceCode > </PieGenderChart>
    </div>
     <div class="col-md-6 col-sm-12 col-xs-12">
            <StockReport :isCharts= true :dataLoaded=dataLoaded :serviceCode=serviceCode > </StockReport>
      </div>
        <DispenseTypeByAgeTable :serviceCode=serviceCode :dataLoaded=dataLoaded > </DispenseTypeByAgeTable>
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
export default {
     props: ['dataLoaded'],
    data () {
        return {
         serviceCode: 'TARV',
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
              } else if (item.code === 'TPT') {
                  item.colour = 'red'
                   item.icon = 'vaccines'
              } else if (item.code === 'PREP') {
                  item.colour = 'teal'
                   item.icon = 'health_and_safety'
              } else {
                 item.icon = 'health_and_safety'
                const exists = localStorage.getItem(item.code)
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
              this.clinicalServiceReports.push(item)
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
                                   return episodes.notes === 'Inicio ao tratamento'
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
      }
    },
    mounted () {
     //  this.loadData()
       this.getClinicalServicesOptions()
    },
     created () {
  }
}
</script>

<style>

</style>
