<template>
  <div>
    <TitleBar>Ficha do Medicamento</TitleBar>
    <div class="q-pa-lg">
      <ListHeader
        :addVisible="false"
        :doneVisible="false"
        :mainContainer="true"
        bgColor="bg-primary">{{drug.name}}
      </ListHeader>
      <div class="box-border q-pb-md">
      <div class="row q-pa-md">
        <q-space />
        <q-btn unelevated color="blue" label="Voltar" @click="goBack"/>
        <q-btn unelevated color="green-4" class="q-ml-md" label="Imprimir" />
      </div>
        <q-table
          class="col"
          dense
          flat
          separator="cell"
          :rows="drugEventList"
          :columns="columns"
          row-key="id"
          >
          <template v-slot:no-data="{ icon, filter }">
            <div class="full-width row flex-center text-primary q-gutter-sm text-body2">
              <span>
                Sem resultados para visualizar
              </span>
              <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
            </div>
          </template>
          <template #header="props">
            <q-tr class="text-left bg-grey-3" style="text-align: center"  :props="props">
              <q-th style="width: 70px" >{{columns[0].label}}</q-th>
              <q-th style="width: 190px;" >{{columns[1].label}}</q-th>
              <q-th style="width: 190px" >{{columns[2].label}}</q-th>
              <q-th style="width: 190px" >{{columns[3].label}}</q-th>
              <q-th style="width: 190px" >{{columns[4].label}}</q-th>
              <q-th style="width: 190px" >{{columns[5].label}}</q-th>
              <q-th style="width: 190px" >{{columns[6].label}}</q-th>
              <q-th style="width: 190px" >{{columns[7].label}}</q-th>
              <q-th style="width: 190px" >{{columns[8].label}}</q-th>
              <q-th class="col" >{{columns[9].label}}</q-th>
            </q-tr>

          </template>
          <template #body="props">
            <q-tr :props="props">
              <q-td key="eventDate" :props="props">
                {{formatDate(props.row.eventDate)}}
              </q-td>
              <q-td key="moviment" :props="props">
                {{props.row.moviment}}
              </q-td>
              <q-td key="orderNumber" :props="props">
                {{props.row.orderNumber}}
              </q-td>
              <q-td key="incomes" :props="props">
                {{props.row.incomes}}
              </q-td>
              <q-td key="outcomes" :props="props">
                {{props.row.outcomes}}
              </q-td>
              <q-td key="posetiveAdjustment" :props="props">
                {{props.row.posetiveAdjustment}}
              </q-td>
              <q-td key="negativeAdjustment" :props="props">
                {{props.row.negativeAdjustment}}
              </q-td>
              <q-td key="loses" :props="props">
                {{props.row.loses}}
              </q-td>
              <q-td key="balance" :props="props">
                {{props.row.balance}}
              </q-td>
              <q-td key="notes" :props="props">
                {{props.row.notes}}
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
      <div>
        <list-header
          :addVisible="false"
          :doneVisible="false"
          :mainContainer="false"
          bgColor="bg-primary">Informação por Lote
        </list-header>
        <span v-for="lote in drug.stocks" :key="lote.id" >
          <lote-info-container :stock="lote" />
        </span>
      </div>
    </div>
      <q-dialog v-model="alert.visible" persistent>
        <Dialog :type="alert.type" @closeDialog="closeDialog">
          <template v-slot:title> Informação</template>
          <template v-slot:msg> {{alert.msg}} </template>
        </Dialog>
      </q-dialog>
  </div>
</template>

<script>
import { ref } from 'vue'
import Drug from '../../../store/models/drug/Drug'
import { QSpinnerBall, useQuasar, date, SessionStorage } from 'quasar'
import Stock from '../../../store/models/stock/Stock'
import Clinic from '../../../store/models/clinic/Clinic'
const columns = [
  { name: 'eventDate', required: true, label: 'Data Movimento', field: 'eventDate', align: 'center', sortable: true },
  { name: 'moviment', align: 'center', label: 'Movimento', sortable: true },
  { name: 'orderNumber', align: 'center', label: 'Nr. Guia', sortable: false },
  { name: 'incomes', align: 'center', label: 'Entradas', sortable: true },
  { name: 'outcomes', align: 'center', label: 'Saídas', sortable: true },
  { name: 'posetiveAdjustment', align: 'center', label: 'Ajuste Positivo (+)', sortable: true },
  { name: 'negativeAdjustment', align: 'center', label: 'Ajuste Negativo (-)', sortable: true },
  { name: 'loses', align: 'center', label: 'Perdas', sortable: true },
  { name: 'balance', align: 'center', label: 'Saldo', sortable: true },
  { name: 'notes', align: 'center', label: 'Resumo das Notas', sortable: false }
]
export default {
  data () {
    return {
      alert: ref({
        type: '',
        visible: false,
        msg: ''
      }),
      columns,
      $q: useQuasar(),
      drugEventList: [],
      inventoryList: [],
      entranceList: []
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    formatDate (dateString) {
      return date.formatDate(dateString, 'DD-MM-YYYY')
    },
    showloading () {
      console.log('loaging')
       this.$q.loading.show({
          spinner: QSpinnerBall,
          spinnerColor: 'gray',
          spinnerSize: 140,
          message: 'Carregando, aguarde por favor...',
          messageColor: 'white'
        })
    },
    hideLoading () {
      this.$q.loading.hide()
    },
    generateDrugEventSummary () {
      this.showloading()
      Stock.apiGetDrugSummary(this.clinic.id, this.drug.id).then(resp => {
        console.log(resp.response.data)
        const t = resp.response.data
        t.sort((a, b) => {
          const d1 = new Date(a.eventDate)
          const d2 = new Date(b.eventDate)
          return d2 - d1
        })
        this.drugEventList = t
        this.hideLoading()
      })
    }
  },
  mounted () {
    this.generateDrugEventSummary()
  },
  computed: {
    drug () {
      return Drug.query()
                 .with('stocks.entrance')
                 .where('id', SessionStorage.getItem('selectedDrug').id)
                 .first()
    },
    clinic () {
      return Clinic.query()
                  .where('id', SessionStorage.getItem('currClinic').id)
                  .first()
    }
  },
  components: {
    Dialog: require('components/Shared/Dialog/Dialog.vue').default,
    TitleBar: require('components/Shared/TitleBar.vue').default,
    LoteInfoContainer: require('components/Stock/StockFile/LoteInfoContainer.vue').default,
    ListHeader: require('components/Shared/ListHeader.vue').default
  }
}
</script>

<style lang="scss">
  .box-border {
    border: 1px solid $grey-4
  }
</style>
