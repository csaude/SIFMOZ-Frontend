<template>
   <div>
    <apexchart
 style="max-width: 100%; "
  height="500"
  type="heatmap"
  :options="chartOptions"
  :series="series"
></apexchart>
   </div>
</template>
<script>
 import VueApexCharts from 'vue3-apexcharts'
 import moment from 'moment'
 // import { QSpinnerBall } from 'quasar'
// import PatientServiceIdentifier from 'src/store/models/patientServiceIdentifier/PatientServiceIdentifier'
import PatientVisitDetails from '../../../store/models/patientVisitDetails/PatientVisitDetails'
const monthsX = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEC']
const toDateStr = str => new Date(str.replace(/^(\d+)\/(\d+)\/(\d+)$/, '$2/$1/$3'))
const monthsEng = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
// const latestPrescriptions = []
// const arrDispenseMonthly = []
// const arrDispenseQuarterly = []
// const arrDispenseSemestraly = []
export default {
      props: ['serviceCode', 'dataLoaded'],
       monthsX,
       toDateStr,
       monthsEng,
        components: {
    apexchart: VueApexCharts
  },
  data: function () {
    return {
      latestPrescriptions: [],
       arrDispenseMonthly: [],
      arrDispenseQuarterly: [],
      arrDispenseSemestraly: [],
      chartOptions: { // ApexCharts options
        chart: {
          id: 'vue-heat-map'
        },
         animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 1000
        },
         title: {
          text: 'Tipo de Dispensa por Faixa Etaria',
          align: 'center',
          style: {
            color: '#000000'
          }
          },
           plotOptions: {
      heatmap: {
        colorScale: {
          ranges: [{
              from: 0,
              to: 3,
              color: '#00A100',
              name: 'low'
            },
            {
              from: 4,
              to: 10,
              color: '#128FD9',
              name: 'medium'
            },
            {
              from: 11,
              to: 45,
              color: '#FFB200',
              name: 'high'
            }
          ]
        }
      }
           },
           shadeIntensity: 0.5,
      radius: 0,
      useFillColorAsStroke: true,
   stroke: {
    show: true,
    curve: 'smooth',
    lineCap: 'butt',
    colors: undefined,
    width: 2,
    dashArray: 0
},
fill: {
          opacity: 2
        },
         tooltip: {
          y: {
            formatter: function (val) {
              return val
            }
          }
         },
      dataLabels: {
          enabled: true
        },
      xaxis: {
              type: 'category',
              categories: ['Adultos', 'Criancas']
            }
        },
         series: [{
          name: 'series-1',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }]
      }
  },
  methods: {
       getLastPatientPrescriptionByClinicalService () {
          const patientVisitDetails = PatientVisitDetails.query()
                            .with('patientVisit')
                             .with('prescription')
                            .with('prescription.prescriptionDetails')
                             .with('prescription.prescriptionDetails.dispenseType')
                            .with('patientVisit.patient')
                            .with('episode.patientServiceIdentifier.service')
                              .get()
                     const patientVisitDetailsTarv = patientVisitDetails.filter((patientVisitDetail) => {
                  return patientVisitDetail.episode.patientServiceIdentifier.service.code === this.serviceCode
                })
              patientVisitDetailsTarv.forEach(patientVisitDetail => {
             //  let patient = patientVisitDetail.patientVisit.patient
                if (this.latestPrescriptions.length === 0) {
                  this.latestPrescriptions.push(patientVisitDetail)
                } else {
               const visit = this.latestPrescriptions.filter(x => x.patientVisit.patient.id === patientVisitDetail.patientVisit.patient.id)
                if (visit.length > 0) {
                  const index = this.latestPrescriptions.map(x => {
                              return x.Id
                                 }).indexOf(visit[0].id)
                      const prescriptionDate = visit[0].prescription.prescriptionDate
                     // console.log(visit.prescription.prescriptionDate)
                   if (moment(prescriptionDate).isBefore(patientVisitDetail.prescription.prescriptionDate)) {
                        this.latestPrescriptions.splice(index, 1)
                         this.latestPrescriptions.push(patientVisitDetail)
                   }
                } else {
                     this.latestPrescriptions.push(patientVisitDetail)
                }
             }
              })
              if (patientVisitDetailsTarv.length === 0) {
                this.latestPrescriptions = []
              }
         return this.latestPrescriptions
          },
            idadeCalculator (birthDate) {
            if (moment(birthDate).isValid()) {
               const utentBirthDate = moment(birthDate)
               const todayDate = moment(new Date())
               const idade = todayDate.diff(utentBirthDate, 'years')
               console.log(idade)
               return idade
            }
        },
         updateChart () {
             this.arrDispenseMonthly = []
              this.arrDispenseQuarterly = []
               this.arrDispenseSemestraly = []
        this.arrDispenseMonthly.push(this.monthlyAdultsDispensePrescriptions.length)
         this.arrDispenseMonthly.push(this.monthlyKidsDispensePrescriptions.length)
             this.arrDispenseQuarterly.push(this.quarterlyAdultsDispensePrescriptions.length)
         this.arrDispenseQuarterly.push(this.quarterlyKidsDispensePrescriptions.length)
           this.arrDispenseSemestraly.push(this.semestralAdultsDispensePrescriptions.length)
         this.arrDispenseSemestraly.push(this.semestralKidsDispensePrescriptions.length)
    this.series = [
     {
        name: 'Dispensa Mensal',
        data: [...this.arrDispenseMonthly]
      },
        {
        name: 'Dispensa Trimestral',
       data: [...this.arrDispenseQuarterly]
      },
       {
        name: 'Dispensa Semestral',
        data: [...this.arrDispenseSemestraly]
      }
    ]
          }
  },
  computed: {
       monthlyAdultsDispensePrescriptions () {
        return this.latestPrescriptions.filter((latestVisitDetails) => {
                  return latestVisitDetails.prescription.prescriptionDetails[0].dispenseType.code === 'DM' && this.idadeCalculator(latestVisitDetails.patientVisit.patient.dateOfBirth) > 15
                })
      },
       quarterlyAdultsDispensePrescriptions () {
          return this.latestPrescriptions.filter((latestVisitDetails) => {
                  return latestVisitDetails.prescription.prescriptionDetails[0].dispenseType.code === 'DT' && this.idadeCalculator(latestVisitDetails.patientVisit.patient.dateOfBirth) > 15
                })
      },
       semestralAdultsDispensePrescriptions () {
         return this.latestPrescriptions.filter((latestVisitDetails) => {
                  return latestVisitDetails.prescription.prescriptionDetails[0].dispenseType.code === 'DS' && this.idadeCalculator(latestVisitDetails.patientVisit.patient.dateOfBirth) > 15
                })
      },
      monthlyKidsDispensePrescriptions () {
        return this.latestPrescriptions.filter((latestVisitDetails) => {
                  return latestVisitDetails.prescription.prescriptionDetails[0].dispenseType.code === 'DM' && this.idadeCalculator(latestVisitDetails.patientVisit.patient.dateOfBirth) < 15
                })
      },
       quarterlyKidsDispensePrescriptions () {
          return this.latestPrescriptions.filter((latestVisitDetails) => {
                  return latestVisitDetails.prescription.prescriptionDetails[0].dispenseType.code === 'DT' && this.idadeCalculator(latestVisitDetails.patientVisit.patient.dateOfBirth) < 15
                })
      },
       semestralKidsDispensePrescriptions () {
         return this.latestPrescriptions.filter((latestVisitDetails) => {
                  return latestVisitDetails.prescription.prescriptionDetails[0].dispenseType.code === 'DS' && this.idadeCalculator(latestVisitDetails.patientVisit.patient.dateOfBirth) < 15
                })
      }
  },
    created () {
    /*  this.$q.loading.show({
      message: 'Carregando ...',
      spinnerColor: 'grey-4',
      spinner: QSpinnerBall
      // delay: 400 // ms
    }) */
    //  this.loadData()
   //   console.log(this.allDispensePrescriptions)
   //    console.log(this.quarterlyDispensePrescriptions)
  //   this.getLastPatientPrescriptionByClinicalService()
   //   this.updateChart()
    },
    watch: {
   serviceCode: function (newVal, oldVal) {
          console.log('Prop changed: ', newVal, ' | was: ', oldVal)
           this.getLastPatientPrescriptionByClinicalService()
       this.updateChart()
        },
        dataLoaded: function (newVal, oldVal) {
          console.log('Prop changed: ', newVal, ' | was: ', oldVal)
         this.getLastPatientPrescriptionByClinicalService()
      this.updateChart()
        }
        }
}
</script>
