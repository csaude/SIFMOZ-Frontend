<template>
   <div>
    <apexchart
 style="max-width: 100%; "
  height="500"
  type="bar"
  :options="chartOptions"
  :series="series"
></apexchart>
   </div>
</template>

<script>
 import VueApexCharts from 'vue3-apexcharts'
 import moment from 'moment'
import DispenseType from '../../../store/models/dispenseType/DispenseType'
 // import { QSpinnerBall } from 'quasar'
import PatientVisitDetails from '../../../store/models/patientVisitDetails/PatientVisitDetails'
// import PatientServiceIdentifier from 'src/store/models/patientServiceIdentifier/PatientServiceIdentifier'
const monthsX = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEC']
const toDateStr = str => new Date(str.replace(/^(\d+)\/(\d+)\/(\d+)$/, '$2/$1/$3'))
const monthsEng = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
const latestPrescriptions = []
export default {
      props: ['serviceCode'],
      mapDispenseMonthly: new Map(),
      mapDispenseQuarterly: new Map(),
      mapDispenseSemestraly: new Map(),
       arrDispenseMonthly: [],
      arrDispenseQuarterly: [],
      arrDispenseSemestraly: [],
       monthsX,
       toDateStr,
       monthsEng,
        components: {
    apexchart: VueApexCharts
  },
  data: function () {
    return {
      latestPrescriptions,
      chartOptions: { // ApexCharts options
        chart: {
          id: 'vue-chart-bar'
        },
        colors: ['#F44336', '#13c185', '#13a6c1'],
         animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 1000
        },
         title: {
          text: 'Tipo de Dispensa',
          align: 'center',
          style: {
            color: '#000000'
          }
          },
           plotOptions: {
              bar: {
                borderRadius: 10
              }
           },
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
      categories: [...monthsX]
      }
      },
      series: [{
          name: 'series-1',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }]
      }
  },
  methods: {
      getLastPrescriptionsMonthlyByMonth () {
       const monthsPresent = []
   const map = this.monthlyDispensePrescriptions.reduce((a, b) => {
  const m = toDateStr(b.prescription.prescriptionDate).getMonth()
  a[m] = (a[m] || 0) + 1
  monthsPresent.push(monthsEng[+m])
     return a
}, {})
   let result = Object.entries(map).map(([key, data]) => ({ data, key: monthsEng[+key] }))
   const monthsNot = monthsEng.filter(item => !monthsPresent.includes(item))
   for (const item of monthsNot) {
     result.push(({ data: 0, key: item }))
   }
  result = result.sort(function (a, b) {
  // sort based on the value in the monthNames object
  return +moment(a.key, 'MMM') - moment(b.key, 'MMM')
})
  return result
  },
    getLastPrescriptionsQuarterlyByMonth () {
       const monthsPresent = []
   const map = this.quarterlyDispensePrescriptions.reduce((a, b) => {
  const m = toDateStr(b.prescription.prescriptionDate).getMonth()
  a[m] = (a[m] || 0) + 1
  monthsPresent.push(monthsEng[+m])
     return a
}, {})
   let result = Object.entries(map).map(([key, data]) => ({ data, key: monthsEng[+key] }))
   const monthsNot = monthsEng.filter(item => !monthsPresent.includes(item))
   for (const item of monthsNot) {
     result.push(({ data: 0, key: item }))
   }
  result = result.sort(function (a, b) {
  // sort based on the value in the monthNames object
  return +moment(a.key, 'MMM') - moment(b.key, 'MMM')
})
  return result
  },
   getLastPrescriptionsSemestralByMonth () {
       const monthsPresent = []
   const map = this.semestralDispensePrescriptions.reduce((a, b) => {
  const m = toDateStr(b.prescription.prescriptionDate).getMonth()
  a[m] = (a[m] || 0) + 1
  monthsPresent.push(monthsEng[+m])
     return a
}, {})
   let result = Object.entries(map).map(([key, data]) => ({ data, key: monthsEng[+key] }))
   const monthsNot = monthsEng.filter(item => !monthsPresent.includes(item))
   for (const item of monthsNot) {
     result.push(({ data: 0, key: item }))
   }
  result = result.sort(function (a, b) {
  // sort based on the value in the monthNames object
  return +moment(a.key, 'MMM') - moment(b.key, 'MMM')
})
  return result
  },
   getDispenseTypeId (id) {
      return DispenseType.find(id)
  },
       getLastPatientTarvPrescription () {
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
          updateChart () {
             const arrPending = []
             const arrDone = []
             const arrConfirmed = []
         if (this.mapDispenseMonthly !== undefined) {
       const mapIter = this.mapDispenseMonthly.values()
       for (const item of mapIter) {
         arrPending.push(item.data)
         }
         }
           if (this.mapDispenseQuarterly !== undefined) {
           const mapIter1 = this.mapDispenseQuarterly.values()
       for (const item of mapIter1) {
         arrDone.push(item.data)
         }
           }
   if (this.mapDispenseSemestraly !== undefined) {
           const mapIter2 = this.mapDispenseSemestraly.values()
       for (const item of mapIter2) {
         arrConfirmed.push(item.data)
         }
   }
    this.series = [
       {
        name: 'Dispensa Mensal',
        data: [...arrPending]
      },
      {
        name: 'Dispensa Trimestral',
        data: [...arrDone]
      },
       {
        name: 'Dispensa Semestral',
        data: [...arrConfirmed]
      }
    ]
          }
  },
  computed: {
         monthlyDispensePrescriptions () {
        return this.latestPrescriptions.filter((latestVisitDetails) => {
                  return latestVisitDetails.prescription.prescriptionDetails[0].dispenseType.code === 'DM'
                })
      },
       quarterlyDispensePrescriptions () {
          return this.latestPrescriptions.filter((latestVisitDetails) => {
                  return latestVisitDetails.prescription.prescriptionDetails[0].dispenseType.code === 'DT'
                })
      },
       semestralDispensePrescriptions () {
         return this.latestPrescriptions.filter((latestVisitDetails) => {
                  return latestVisitDetails.prescription.prescriptionDetails[0].dispenseType.code === 'DS'
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
    // this.loadData()
     this.getLastPatientTarvPrescription()
      console.log(this.allDispensePrescriptions)
   //    console.log(this.quarterlyDispensePrescriptions)
        this.mapDispenseMonthly = this.getLastPrescriptionsMonthlyByMonth()
    this.mapDispenseQuarterly = this.getLastPrescriptionsQuarterlyByMonth()
    this.mapDispenseSemestraly = this.getLastPrescriptionsSemestralByMonth()
    this.updateChart()
    },
     mounted () {
  //    this.updateChart()
    },
     watch: {
   serviceCode: function (newVal, oldVal) {
          console.log('Prop changed: ', newVal, ' | was: ', oldVal)
            this.getLastPatientTarvPrescription()
      console.log(this.allDispensePrescriptions)
   //    console.log(this.quarterlyDispensePrescriptions)
        this.mapDispenseMonthly = this.getLastPrescriptionsMonthlyByMonth()
    this.mapDispenseQuarterly = this.getLastPrescriptionsQuarterlyByMonth()
    this.mapDispenseSemestraly = this.getLastPrescriptionsSemestralByMonth()
        this.updateChart()
        }
        }
}
</script>
