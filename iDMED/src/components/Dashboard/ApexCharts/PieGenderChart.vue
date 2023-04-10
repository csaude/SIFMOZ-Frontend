<template>
  <div class="relative-position">
  <div
      v-if="loaded">
      <apexchart
      style="max-width: 100%; "
      type="donut"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
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

export default {
  mixins: [mixinplatform, mixinIsOnline],
  props: ['serviceCode', 'year'],
  emits: ['update:serviceCode'],
      Nmap: new Map(),
      Nmap1: new Map(),
     components: {
    apexchart: VueApexCharts
  },
  data () {
    const loading = ref(false)
    return {
      loading,
      series: [],
       chartOptions: {
        labels: ['Masculino', 'Feminino'],
        colors: ['#0096FF', '#FF1493'],
          animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 2000
        },
      title: {
          text: 'Percentual de Pacientes activos no Serviço ' + this.serviceCode,
          align: 'center',
          style: {
            color: '#000000',
            fontSize: '13px'
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
      filterUniquePatients (data) {
        const patientMap = new Map()
        for (const item of data) {
          if (!patientMap.has(item.patientId)) {
            patientMap.set(item.patientId, item)
          } else {
            const existingItem = patientMap.get(item.patientId)
            if (new Date(item.visitDate) > new Date(existingItem.visitDate)) {
              patientMap.set(item.patientId, item)
            }
            if (new Date(item.lastEpisode) > new Date(existingItem.lastEpisode)) {
              patientMap.set(item.patientId, item)
            }
            if (new Date(item.prescriptionDate) > new Date(existingItem.prescriptionDate)) {
              patientMap.set(item.patientId, item)
            }
          }
        }
        return Array.from(patientMap.values())
      },
      groupByGender (arr) {
        const countsByGender = arr.reduce((counts, obj) => {
          const gender = obj.gender
          counts[gender] = counts[gender] || { quantity: 0 }
          counts[gender].quantity++
          return counts
        }, {})

        const results = [
          { gender: 'Masculino', quantity: 0, percent: 0 },
          { gender: 'Feminino', quantity: 0, percent: 0 }
        ]
        const totalCount = arr.length
        for (const gender in countsByGender) {
          const count = countsByGender[gender].quantity
          const percent = (count / totalCount) * 100
          results[gender === 'Masculino' ? 0 : 1] = { gender, quantity: count, percent }
        }

        return results
      },
      removerDuplicados (registros) {
        const uniqueRegistros = registros.reduce((unique, registro) => {
          if (!unique.some((r) => r.patientId === registro.patientId)) {
            unique.push(registro)
          }
          return unique
        }, [])
        return uniqueRegistros
      },

      getActivePatientPercentage () {
        this.loading = true
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
          'patientVisits.patientVisitDetails[0].prescription.prescriptionDetails[0].dispenseType.code AS dispenseTypeCode',
          'patientVisits.patientVisitDetails[0].prescription.prescriptionDetails[0].therapeuticRegimen.code AS therapeuticRegimen',
          'patientVisits.patientVisitDetails[0].prescription.prescriptionDate AS prescriptionDate',
          'patientVisits.patientVisitDetails[0].prescription.prescriptionDetails[0].therapeuticLine.code AS therapeuticLine',
          'patientVisits.patientVisitDetails[0].episode.episodeDate AS lastEpisode',
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
              return value.service === serviceCD && new Date(value.startDate) >= startDateObject && new Date(value.startDate) <= endDateObject && new Date(value.visitDate) <= endDateObject // Apenas o true sera mantido, o resto sera removido
          })
          const arr = this.filterUniquePatients(rows)
          const arr1 = this.groupByGender(arr)

          if (arr1.length > 0) {
              this.series[0] = arr1[0] !== undefined ? arr1[0].quantity : 0
              this.series[1] = arr1[1] !== undefined ? arr1[1].quantity : 0
            } else {
              this.series[0] = 0
              this.series[1] = 0
            }
            this.loading = false
          })
        } else {
          Report.apiGetActivePatientPercentage(this.year, this.clinic.id, this.serviceCode).then(resp => {
            console.log(resp.response.data)
            if (resp.response.data.length > 0) {
              this.series[0] = resp.response.data[0] !== undefined ? resp.response.data[0].quantity : 0
              this.series[1] = resp.response.data[1] !== undefined ? resp.response.data[1].quantity : 0
            } else {
              this.series[0] = 0
              this.series[1] = 0
            }
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
  created () {
    this.getActivePatientPercentage()
  },
  watch: {
   serviceCode: function (newVal, oldVal) {
      this.getActivePatientPercentage()
      this.chartOptions = {
            ...this.chartOptions,
            ...{
          title: {
            text: 'Percentual de Pacientes activos no Serviço ' + this.serviceCode,
            align: 'center',
            style: {
              color: '#000000'
            }
          }
        }
      }
    },
    year: function (newVal, oldVal) { this.getActivePatientPercentage() }
  }
}

</script>
