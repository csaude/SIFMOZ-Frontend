<template>
  <div style="width: 1200px; min-height: 200px; linear-gradient( 135deg, #343E59 10%, #2B2D3E 40%)">
    <apexchart
  style="max-width: 50%; "
  type="donut"
  :options="chartOptions"
  :series="series"
></apexchart>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts'
import PatientServiceIdentifier from '../../../store/models/patientServiceIdentifier/PatientServiceIdentifier'
// import moment from 'moment'
// const series = []
// const categories = []

export default {
  props: ['serviceCode'],
      Nmap: new Map(),
      Nmap1: new Map(),
     components: {
    apexchart: VueApexCharts
  },
  data: function () {
    return {
       chartOptions: {
        labels: ['Masculino', 'Feminino'],
        colors: ['#0096FF', '#FF1493'],
          animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 2000
        },
      title: {
          text: 'Percentual de Pacientes Activos ao Tratamento Por Genero',
          align: 'center',
          style: {
            color: '#000000'
          }
          },
      plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                name: {
                  show: true,
                  fontSize: '22px',
                  fontFamily: 'Rubik',
                  color: '#dfsda',
                  offsetY: -10
                },
                value: {
                  show: true,
                  fontSize: '16px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  color: undefined,
                  offsetY: 16,
                  formatter: function (val) {
                    return val
                  }
                },
                total: {
                  show: true,
                  label: 'Total',
                  color: '#373d3f',
                  formatter: function (w) {
                    return w.globals.seriesTotals.reduce((a, b) => {
                      return a + b
                    }, 0)
                  }
                }
              }
            }
          }
        }
       }
    }
  },
  methods: {
      getTotalActives () {
          const activesTotal = []
          activesTotal.push(this.patientAdultsMale.length)
          activesTotal.push(this.patientFeminineTarv.length)
          return activesTotal
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
         },
       series () {
      //   var series = [11, 32, 45, 32]
       const series = this.getTotalActives()
        return series
    }
  },
    created () {
    }
}

</script>
