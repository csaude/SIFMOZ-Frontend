<template>
     <div  class="row">
      <div class="col">
        <q-table
         style="max-width: 100%; "
          :rows="rows"
          :columns="columnsGender"
           class="my-sticky-header-table text-color-white"
            title="Total de dispensa por Idade no Serviço"
           hide-bottom>
        <template v-slot:body="props">
            <q-tr :props="props">
            <q-td key="dispenseType" :props="props">
                {{ props.row.dispenseType }}
            </q-td>
            <q-td key="adulto" :props="props">
                {{ props.row.adulto }}
            </q-td>
              <q-td key="menor" :props="props">
                {{ props.row.menor }}
            </q-td>
            </q-tr>
        </template>
    </q-table>
      </div>
    </div>
</template>
<script>
import Report from 'src/store/models/report/Report'
import { SessionStorage } from 'quasar'
import Clinic from '../../../store/models/clinic/Clinic'
import { nSQL } from 'nano-sql'
import mixinIsOnline from 'src/mixins/mixin-is-online'
import mixinplatform from 'src/mixins/mixin-system-platform'

const columnsGender = [
  { name: 'dispenseType', required: true, label: 'Tipo de Dispensa', align: 'left', field: row => row.dispenseType, format: val => `${val}` },
  { name: 'adulto', required: true, label: 'Adulto', align: 'left', field: row => row.adulto, format: val => `${val}` },
   { name: 'menor', required: true, label: 'Criança', align: 'left', field: row => row.menor, format: val => `${val}` }
]

export default {
  mixins: [mixinplatform, mixinIsOnline],
  props: ['serviceCode', 'year'],
  data () {
    return {
        columnsGender,
        rowData: []
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
    agruparRegistros (registros) {
      const agrupado = registros.reduce((obj, registro) => {
        const descricao = registro.dispenseTypeDescription
        const faixa = registro.faixa

        if (!obj[descricao]) {
          obj[descricao] = {
            dispenseType: descricao,
            adulto: 0,
            menor: 0
          }
        }

        if (faixa === 'ADULTO') {
          obj[descricao].adulto++
        } else if (faixa === 'MENOR') {
          obj[descricao].menor++
        }

        return obj
      }, {})

      return Object.values(agrupado)
    },
    getDispenseByAge () {
      if (!this.isOnline) {
          const realYear = this.year
          const dateStr = realYear + '-12-20'
          const yearBefore = this.year - 1
          const dateStr1 = yearBefore + '-12-21'
          const endDateObject = new Date(dateStr)
          const startDateObject = new Date(dateStr1)
          const serviceCD = this.serviceCode
          nSQL('patientVisits')
          .query('select', ['identifiers.startDate AS startDate', 'patientVisits.visitDate AS visitDate', 'patientVisits.patientVisitDetails[0].pack.pickupDate AS pickupDate',
          'patientVisits.patient.id AS patientId', 'clinicalServices.code AS service', '0 AS quantity', '0 AS percent', 'patientVisits.patient.dateOfBirth AS dateOfBirth',
          'patientVisits.patientVisitDetails[0].episode.episodeDate AS lastEpisode', '0 AS month', 'patientVisits.clinic.id AS clinicID',
          'patientVisits.patientVisitDetails[0].prescription.prescriptionDetails[0].dispenseType.code AS dispenseTypeCode', '0 AS faixa',
          'patientVisits.patientVisitDetails[0].prescription.prescriptionDetails[0].dispenseType.description AS dispenseTypeDescription',
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
          rows = rows.filter(value => {
              return value.service === serviceCD && new Date(value.startDate) >= startDateObject && new Date(value.startDate) <= endDateObject && new Date(value.pickupDate) >= startDateObject && new Date(value.pickupDate) <= endDateObject && value.clinicID === this.clinic.id // Apenas o true sera mantido, o resto sera removido
          })
          rows.forEach((item) => {
            const idade = this.calcularIdade(item.dateOfBirth)
            if (idade >= 0) {
              if (idade < 18) {
                item.faixa = 'MENOR'
              }
              if (idade >= 18) {
                item.faixa = 'ADULTO'
              }
            }
          })
          rows = this.agruparRegistros(rows)
          this.rowData = rows
        })
    } else {
      Report.apiGetDispenseByAge(this.year, this.clinic.id, this.serviceCode).then(resp => {
        this.rowData = resp.response.data
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
    rows () {
      return this.rowData
    }
  },
    created () {
      this.getDispenseByAge()
    },
    watch: {
      serviceCode: function (newVal, oldVal) {
          this.getDispenseByAge()
      },
      year: function (newVal, oldVal) {
        this.getDispenseByAge()
      }
  }
}
</script>
<style lang="sass">
.my-sticky-header-table
  /* height or max-height is important */
  .q-table__top,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: $light-green-1

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
</style>
