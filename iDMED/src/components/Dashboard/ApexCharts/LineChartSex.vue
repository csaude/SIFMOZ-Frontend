<template>
<div style="width: 850px; min-height: 200px; linear-gradient( 135deg, #343E59 10%, #2B2D3E 40%)" class="relative-position">
  <apexchart
    style="max-width: 100%; "
    height="500"
    type="area"
    :options="chartOptions"
    :series="series"
  ></apexchart>
  <div v-if="!loaded" class="absolute-center">
        <q-spinner-ball
          color="primary"
          size="xl"
        />
      </div>
</div>
</template>

<script>
import { SessionStorage } from 'quasar'
import { ref } from 'vue'
 import VueApexCharts from 'vue3-apexcharts'
import Clinic from '../../../store/models/clinic/Clinic'
import Report from 'src/store/models/report/Report'
import { nSQL } from 'nano-sql'
import mixinIsOnline from 'src/mixins/mixin-is-online'
import mixinplatform from 'src/mixins/mixin-system-platform'
const month = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
export default {
  mixins: [mixinplatform, mixinIsOnline],
    props: ['serviceCode', 'year'],
     emits: ['update:serviceCode'],
      Nmap: new Map(),
      NmapChild: new Map(),
      month,
  components: {
    apexchart: VueApexCharts
  },
  data: function () {
    const loading = ref(false)
    return {
      loading,
      chartOptions: { // ApexCharts options
        chart: {
          id: 'vue-chart-line',
          toolbar: {
        show: true,
        offsetY: 7
        }
        },
        colors: ['#0096FF', '#FF1493'],
         title: {
          text: 'Total de Pacientes no Serviço ' + this.serviceCode + ' que iniciaram o levantamento',
          align: 'center',
          style: {
            color: '#000000',
            fontSize: '13px'
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
    removerDuplicados (registros) {
      const uniqueRegistros = registros.reduce((unique, registro) => {
        if (!unique.some((r) => r.patientId === registro.patientId)) {
          unique.push(registro)
        }
        return unique
      }, [])
      return uniqueRegistros
    },
    agruparRegistrosPorDispenseTypeCodeMonthGender (registros) {
      const agrupadoPorDispenseTypeCode = registros.reduce((agrupado, registro) => {
        const chave = `${registro.dispenseTypeCode}-${registro.month}-${registro.gender}`
        if (!agrupado[chave]) {
          agrupado[chave] = {
            dispenseTypeCode: registro.dispenseTypeCode,
            month: registro.month,
            quantity: 0,
            gender: registro.gender
          }
        }
        agrupado[chave].quantity++
        return agrupado
      }, {})
      return Object.values(agrupadoPorDispenseTypeCode)
    },

    getPatientsFirstDispenseByGender () {
    this.loading = true
      const fm = { name: 'Feminino', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }
      const ms = { name: 'Masculino', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }

      if (!this.isOnline) {
          const realYear = this.year
          const dateStr = realYear + '-12-20'
          const yearBefore = this.year - 1
          const dateStr1 = yearBefore + '-12-21'
          const endDateObject = new Date(dateStr)
          const startDateObject = new Date(dateStr1)
          const serviceCD = this.serviceCode
          nSQL('patientVisits')
          .query('select', ['identifiers.startDate AS startDate', 'patientVisits.visitDate AS visitDate',
          'patientVisits.patient.id AS patientId', 'clinicalServices.code AS service', '0 AS quantity', '0 AS percent',
          'patientVisits.patientVisitDetails[0].episode.episodeDate AS lastEpisode', '0 AS month',
          'patientVisits.patientVisitDetails[0].prescription.prescriptionDetails[0].dispenseType.code AS dispenseTypeCode',
          'patientVisits.patient.gender AS gender'])
          .join(
            [{
              type: 'inner',
              table: 'identifiers',
              where: ['identifiers.patient.id', '=', 'patientVisits.patient.id']
            },
            {
              type: 'inner',
              table: 'episodes',
              where: ['episodes.patientServiceIdentifier.id', '=', 'identifiers.id']
            },
            {
              type: 'inner',
              table: 'clinicalServices',
              where: ['clinicalServices.id', '=', 'identifiers.service.id']
            }])
          .exec()
        .then(rows => {
          rows = this.removerDuplicados(rows)
          rows = rows.filter(function (value) {
              return value.service === serviceCD && new Date(value.visitDate) >= startDateObject && new Date(value.visitDate) <= endDateObject // Apenas o true sera mantido, o resto sera removido
          })

          rows.forEach((item) => {
            if (item.visitDate !== null && item.visitDate !== undefined) {
              const visitDate = new Date(item.visitDate)
              if (visitDate.getDate() > 20) {
                item.month = visitDate.getMonth() + 2 // Adicionar 1 mes
              }
              if (visitDate.getDate() <= 20) {
                item.month = visitDate.getMonth() + 1 // Considerar mes da data
              }
            }
          })
          rows = this.agruparRegistrosPorDispenseTypeCodeMonthGender(rows)
            for (let i = 1; i <= 12; i++) {
              rows.forEach((item) => {
                if (item.gender === 'Feminino' && item.month === i) {
                  fm.data[i - 1] = item.quantity
                } else if (item.gender === 'Masculino' && item.month === i) {
                  ms.data[i - 1] = item.quantity
                }
              })
            }
            this.series = []
            this.series[0] = ms
            this.series[1] = fm
            this.loading = false
          })
        } else {
          Report.apiGetPatientsFirstDispenseByGender(this.year, this.clinic.id, this.serviceCode).then(resp => {
            for (let i = 1; i <= 12; i++) {
              resp.response.data.forEach((item) => {
                if (item.gender === 'Feminino' && item.month === i) {
                  fm.data[i - 1] = item.quantity
                } else if (item.gender === 'Masculino' && item.month === i) {
                  ms.data[i - 1] = item.quantity
                }
              })
            }
            this.series = []
            this.series[0] = ms
            this.series[1] = fm
            this.loading = false
          })
        }
    }
  },
  computed: {
    clinic () {
      return Clinic.query()
                  .where('id', SessionStorage.getItem('currClinic').id)
                  .first()
    },
    loaded () {
      return !this.loading
    }
  },
  watch: {
    serviceCode: function (newVal, oldVal) {
      this.getPatientsFirstDispenseByGender()
    },
    year: function (newVal, oldVal) {
      this.getPatientsFirstDispenseByGender()
    }
  },
  created () {
    this.getPatientsFirstDispenseByGender()
  }
}

</script>
