<template>
<div style="width: 1200px; min-height: 200px; linear-gradient( 135deg, #343E59 10%, #2B2D3E 40%)">
  <apexchart
    style="max-width: 50%; "
      height="500"
  type="area"
  :options="chartOptions"
  :series="series"
></apexchart>
</div>
</template>

<script>
 import VueApexCharts from 'vue3-apexcharts'
 import Episode from '../../../store/models/episode/Episode'
import moment from 'moment'
import PatientServiceIdentifier from '../../../store/models/patientServiceIdentifier/PatientServiceIdentifier'
// import moment from 'moment'
// import { QSpinnerBall } from 'quasar'
const month = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
export default {
   props: ['serviceCode'],
      Nmap: new Map(),
      NmapChild: new Map(),
      month,
        components: {
    apexchart: VueApexCharts
  },
  data: function () {
    return {
      chartOptions: { // ApexCharts options
        chart: {
          id: 'vue-chart-line'
        },
        colors: ['#13a6c1', '#F44336'],
         title: {
          text: 'Gráfico de Pacientes Activos ao Tratamento Por Gênero',
          align: 'left',
          style: {
            color: '#000000'
          }
          },
           animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 1000
        },
            stroke: {
    show: true,
    curve: 'smooth',
    lineCap: 'butt',
    colors: undefined,
    width: 5,
    dashArray: 0,
    markers: {
    size: 1
}
},
tooltip: {
          y: {
            formatter: function (val) {
              return val
            }
          }
         },
      dataLabels: {
          enabled: false
        },
          xaxis: {
      categories: [...month]
      }
    },
      series: [{
          name: 'series-1',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }]
      }
  },
  methods: {
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
        getAdultPatientsByMonth () {
    const monthsPresent = []
    const toDate = str => new Date(str.replace(/^(\d+)\/(\d+)\/(\d+)$/, '$2/$1/$3'))
    const month = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
   const map = this.patientAdultsMale.reduce((a, b) => {
  const m = toDate(b.startDate).getMonth()
  console.log(m)
  a[m] = (a[m] || 0) + 1
  monthsPresent.push(month[+m])
     return a
}, {})
  let result = Object.entries(map).map(([key, data]) => ({ data, key: month[+key] }))
   const monthsNot = month.filter(item => !monthsPresent.includes(item))
   for (const item of monthsNot) {
     result.push(({ data: 0, key: item }))
   }
  result = result.sort(function (a, b) {
  // sort based on the value in the monthNames object
  console.log(+moment(a.key, 'MMM') - moment(b.key, 'MMM'))
  return +moment(a.key, 'MMM') - moment(b.key, 'MMM')
})
  return result
  },
    getChildPatientsByMonth () {
    const monthsPresent = []
    const toDate = str => new Date(str.replace(/^(\d+)\/(\d+)\/(\d+)$/, '$2/$1/$3'))
    const month = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
   const map = this.patientFeminineTarv.reduce((a, b) => {
  const m = toDate(b.startDate).getMonth()
  console.log(m)
  a[m] = (a[m] || 0) + 1
  monthsPresent.push(month[+m])
     return a
}, {})
  let result = Object.entries(map).map(([key, data]) => ({ data, key: month[+key] }))
   const monthsNot = month.filter(item => !monthsPresent.includes(item))
   for (const item of monthsNot) {
     result.push(({ data: 0, key: item }))
   }
  result = result.sort(function (a, b) {
  // sort based on the value in the monthNames object
  console.log(+moment(a.key, 'MMM') - moment(b.key, 'MMM'))
  return +moment(a.key, 'MMM') - moment(b.key, 'MMM')
})
  return result
  },
  updateChart () {
     const mapIter = this.Nmap.values()
         const arrDone = []
       for (const item of mapIter) {
         arrDone.push(item.data)
         }
          const mapIter2 = this.NmapChild.values()
         const arrConfirmed = []
       for (const item of mapIter2) {
         arrConfirmed.push(item.data)
         }
    this.series = [
      {
        name: 'Masculino',
        data: [...arrDone]
      },
      {
        name: 'Feminino',
        data: [...arrConfirmed]
      }
    ]
  }
  },
  computed: {
         patientAdultsMale () {
         return PatientServiceIdentifier.query()
                           .with('identifierType')
                            .with('service')
                             .where((patientServiceIdentifier) => {
                                 return patientServiceIdentifier.endDate === null
                              })
                             .whereHas('service', (query) => {
                              query.where((service) => {
                                 return service.code === this.serviceCode
                              })
                              })
                              .whereHas('patient', (query) => {
                              query.where((patient) => {
                                   return patient.gender === 'Masculino'
                              })
                              })
                               .whereHas('episodes', (query) => {
                              query.where((episodes) => {
                                  console.log(episodes)
                                   return episodes.notes === 'Inicio ao tratamento'
                              })
                              }).get()
         },
          patientFeminineTarv () {
         return PatientServiceIdentifier.query()
                           .with('identifierType')
                            .with('service')
                             .where((patientServiceIdentifier) => {
                                 return patientServiceIdentifier.endDate === null
                              })
                             .whereHas('service', (query) => {
                              query.where((service) => {
                                 return service.code === this.serviceCode
                              })
                              })
                                .whereHas('patient', (query) => {
                              query.where((patient) => {
                                   return patient.gender === 'Feminino'
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
  watch: {
   serviceCode: function (newVal, oldVal) {
          console.log('Prop changed: ', newVal, ' | was: ', oldVal)
           this.Nmap = this.getAdultPatientsByMonth()
        this.NmapChild = this.getChildPatientsByMonth()
        this.updateChart()
        }
        },
    created () {
   // this.Nmap1 = this.getAppointmentsDoneByMonth()
 //  this.doEpisodeGet('ff8081817c668dcc017c66dc3d330002', 0, 100)
 /*   this.$q.loading.show({
      message: 'Carregando ...',
      spinnerColor: 'grey-4',
      spinner: QSpinnerBall
      // delay: 400 // ms
    })
  //   this.Nmap = new Map()
 Episode.apiGetAllByClinicId('ff8081817c668dcc017c66dc3d330002').then(resp => {
       console.log(this.patientMensTarv)
          this.$q.loading.hide()
      }) */
        this.Nmap = this.getAdultPatientsByMonth()
        this.NmapChild = this.getChildPatientsByMonth()
        this.updateChart()
    }
}

</script>
