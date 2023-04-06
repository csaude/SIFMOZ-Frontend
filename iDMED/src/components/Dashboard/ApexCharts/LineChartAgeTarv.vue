<template>
<div class= 'relative-position '>
  <apexchart
    style= 'max-width: 100%  '
    height= '500 '
    type= 'line '
    :options= 'chartOptions '
    :series= 'series '
></apexchart>
<div v-if= '!loaded ' class= 'absolute-center '>
        <q-spinner-ball
          color= 'primary '
          size= 'xl '
        />
      </div>
</div>
</template>

<script>
 import VueApexCharts from 'vue3-apexcharts'
 import { ref } from 'vue'
import Clinic from '../../../store/models/clinic/Clinic'
import Report from 'src/store/models/report/Report'
import { SessionStorage } from 'quasar'
import mixinplatform from 'src/mixins/mixin-system-platform'
import { nSQL } from 'nano-sql'
import mixinIsOnline from 'src/mixins/mixin-is-online'
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
        colors: ['#6a0dad', '#AAFF00'],
         title: {
          text: 'Total de Pacientes no Serviço ' + this.serviceCode + '\n que iniciaram o levantamento',
          size: 10,
          align: 'center',
          offsetY: -3,
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
      calcularIdade (dataNascimento) {
        const hoje = new Date()
        const nascimento = new Date(dataNascimento)
        let idade = hoje.getFullYear() - nascimento.getFullYear()
        const mes = hoje.getMonth() - nascimento.getMonth()
        if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
          idade--
        }
        return idade
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
     getPatientsFirstDispenseByAge () {
      this.loading = true
      const fm = { name: 'Criancas', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }
      const ms = { name: 'Adultos', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }

      if (!this.isOnline) {
        const realYear = this.year
        const dateStr = realYear + '-12-20'
        const yearBefore = this.year - 1
        const dateStr1 = yearBefore + '-12-21'
        const endDateObject = new Date(dateStr)
        const startDateObject = new Date(dateStr1)
        const serviceCD = this.serviceCode

        nSQL('patientVisits')
          .query('select', ['identifiers.startDate AS startDate', 'patientVisits.visitDate AS visitDate', 'patientVisits.patient.dateOfBirth AS dateOfBirth',
          'patientVisits.patient.id AS patientId', 'clinicalServices.code AS service', '1 AS month', '0 AS quantity', '0 AS faixa',
          'patientVisits.patientVisitDetails[0].prescription.prescriptionDetails[0].dispenseType.code AS dispenseTypeCode'])
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
          rows.forEach((item) => {
            const idade = this.calcularIdade(item.dateOfBirth)
            if (item.startDate !== null && item.startDate !== undefined) {
              const strtDate = new Date(item.startDate)
              if (strtDate.getDate() > 20) {
                item.month = strtDate.getMonth() + 2 // Adicionar 1 mes
              }
              if (strtDate.getDate() <= 20) {
                item.month = strtDate.getMonth() + 1 // Considerar mes da data
              }
              if (idade < 18) {
                item.faixa = 'MENOR'
              }
              if (idade >= 18) {
                item.faixa = 'ADULTO'
              }
            }
          })

          rows = rows.filter(function (value) {
              return value.service === serviceCD && new Date(value.startDate) >= startDateObject && new Date(value.startDate) <= endDateObject && new Date(value.visitDate) <= endDateObject // Apenas o true sera mantido, o resto sera removido
          })

          rows = rows.reduce((acc, obj) => {
            const key = obj.dispenseTypeCode + '-' + obj.month + '-' + obj.faixa
            const matchingObj = acc.find(item => item.key === key)
            if (!matchingObj) {
              acc.push({
                key: key,
                dispenseTypeCode: obj.dispenseTypeCode,
                startDate: obj.startDate,
                visitDate: obj.visitDate,
                month: obj.month,
                service: obj.service,
                dateOfBirth: obj.dateOfBirth,
                faixa: obj.faixa,
                quantity: 1
              })
            } else {
              matchingObj.quantity++
            }
            return acc
          }, [])

          console.log(rows)

          for (let i = 1; i <= 12; i++) {
          rows.forEach((item) => {
            if (item.faixa === 'MENOR' && item.month === i) {
              fm.data[i - 1] = item.quantity
            } else if (item.faixa === 'ADULTO' && item.month === i) {
              ms.data[i - 1] = item.quantity
              console.log(ms.data[i - 1])
            }
          })
        }
        this.series = []
        this.series[0] = fm
        this.series[1] = ms
        this.loading = false
        })
      } else {
      Report.apiGetPatientsFirstDispenseByAge(this.year, this.clinic.id, this.serviceCode).then(resp => {
        console.log(resp.response.data)
        for (let i = 1; i <= 12; i++) {
          resp.response.data.forEach((item) => {
            if (item.faixa === 'MENOR' && item.month === i) {
              fm.data[i - 1] = item.quantity
            } else if (item.faixa === 'ADULTO' && item.month === i) {
              ms.data[i - 1] = item.quantity
            }
          })
        }
        this.series = []
        this.series[0] = fm
        this.series[1] = ms
        this.loading = false
      })
     }
    }
  },
   watch: {
   serviceCode: function (newVal, oldVal) {
     this.getPatientsFirstDispenseByAge()
        },
    year: function (newVal, oldVal) {
      this.getPatientsFirstDispenseByAge()
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
      this.getPatientsFirstDispenseByAge()
    }
}

</script>
