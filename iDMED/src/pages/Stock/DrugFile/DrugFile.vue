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
import { date, SessionStorage } from 'quasar'
import Stock from '../../../store/models/stock/Stock'
import Inventory from '../../../store/models/stockinventory/Inventory'
import StockOperationType from '../../../store/models/stockoperation/StockOperationType'
import DestroyedStock from '../../../store/models/stockdestruction/DestroyedStock'
import ReferedStockMoviment from '../../../store/models/stockrefered/ReferedStockMoviment'
const columns = [
  { name: 'eventDate', required: true, label: 'Data Movimento', field: 'eventDate', align: 'center', sortable: true },
  { name: 'moviment', align: 'center', label: 'Movimento', sortable: true },
  { name: 'orderNumber', align: 'center', label: 'Nr. Guia', sortable: false },
  { name: 'incomes', align: 'center', label: 'Entradas', sortable: true },
  { name: 'outcomes', align: 'center', label: 'Saídas', sortable: true },
  { name: 'posetiveAdjustment', align: 'center', label: 'Ajuste Posetivo (+)', sortable: true },
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
    generateDrugEventList () {
      const stockList = Stock.query()
                             .with('adjustments.*')
                             .with('entrance.stocks')
                             .with('drug')
                             .with('center')
                             .with('clinic.province')
                             .where('drug_id', this.drug.id)
                             .get()

      Object.keys(stockList).forEach(function (i) {
        const entranceIncluded = this.entranceList.some((item) => {
          return item.id === stockList[i].entrance.id
        })
        if (!entranceIncluded) {
          this.entranceList.push(stockList[i].entrance)
        }
      }.bind(this))

      this.entranceList.forEach((item) => {
        this.loadRelatedEntrance(item)
      })

      Object.keys(stockList).forEach(function (i) {
        const stock = stockList[i]
        if (stock.adjustments.length > 0) {
          Object.keys(stock.adjustments).forEach(function (k) {
            if (stock.adjustments[k].type === 'INVENTORYSTOCKADJUSTMENT') {
              this.loadRelatedInventories(stock.adjustments[k])
            } else {
              this.loadRelatedAdjustments(stock.adjustments[k], stock)
            }
          }.bind(this))
        }
      }.bind(this))
      this.drugEventList.sort((a, b) => {
        const d1 = new Date(a.eventDate)
        const d2 = new Date(b.eventDate)
        return d2 - d1
      })
    },
    generateEvent (inventory) {
      const processedInventory = this.drugEventList.some((item) => {
        return item.id === inventory.id
      })

      if (!processedInventory && !inventory.open) {
        const event = {
              id: inventory.id,
              eventDate: inventory.startDate,
              moviment: 'Inventário',
              orderNumber: '-',
              incomes: '-',
              outcomes: '-',
              posetiveAdjustment: 0,
              negativeAdjustment: 0,
              loses: '-',
              balance: 0,
              notes: '-'
            }
        inventory.adjustments.forEach((item) => {
          if (item.adjustedStock.drug_id === this.drug.id) {
            item.operation = StockOperationType.find(item.operation_id)
            if (item.isPosetiveAdjustment()) {
              event.posetiveAdjustment = Number(event.posetiveAdjustment + item.adjustedValue)
            } else {
              event.negativeAdjustment = Number(event.negativeAdjustment + item.adjustedValue)
            }
            event.balance = Number(event.balance + item.balance)
          }
        })
        this.drugEventList.push(event)
      }
    },
    loadRelatedInventories (adjustment) {
      // console.log(adjustment)
      const inventory = Inventory.query()
                                 .with('adjustments.adjustedStock.drug', (query) => {
                                    query.where((adjustedStock) => {
                                        return adjustedStock.drug_id === this.drug.id
                                      })
                                    })
                                 .where('id', adjustment.inventory_id)
                                 .first()
      const inventoryIsOnList = this.inventoryList.some((item) => {
        return item.id === inventory.id
      })

      if (!inventoryIsOnList) this.inventoryList.push(inventory)
      this.inventoryList.forEach((item) => {
        this.generateEvent(item)
      })
    },
    loadRelatedEntrance (entrance) {
      const event = {
            id: entrance.id,
            eventDate: entrance.dateReceived,
            moviment: 'Entrada de Stock',
            orderNumber: entrance.orderNumber,
            incomes: '-',
            outcomes: '-',
            posetiveAdjustment: '-',
            negativeAdjustment: '-',
            loses: '-',
            balance: 0,
            notes: '-'
          }
      entrance.stocks.forEach((stock) => {
        if (stock.drug_id === this.drug.id) {
          event.balance = Number(event.balance + stock.unitsReceived)
        }
      })
      this.drugEventList.push(event)
    },
    loadRelatedAdjustments (adjustment, stock) {
      if (adjustment.finalised) {
        const event = {
              id: '',
              eventDate: '',
              moviment: '',
              orderNumber: '-',
              incomes: '-',
              outcomes: '-',
              posetiveAdjustment: '-',
              negativeAdjustment: '-',
              loses: '-',
              balance: adjustment.balance,
              notes: '-'
            }
        if (adjustment.type === 'STOCKDESTRUCTIONADJUSTMENT') {
          adjustment.destruction = DestroyedStock.find(adjustment.destruction_id)
          event.id = adjustment.destruction.id
          event.eventDate = adjustment.captureDate
          event.moviment = adjustment.destruction.notes
          event.loses = adjustment.adjustedValue
        } else if (adjustment.type === 'STOCKREFERENCEADJUSTMENT') {
          adjustment.reference = ReferedStockMoviment.find(adjustment.reference_id)
          event.id = adjustment.reference.id
          event.eventDate = adjustment.reference.date
          event.moviment = adjustment.reference.origin
          event.orderNumber = adjustment.reference.orderNumber
          if (adjustment.operation.code === 'AJUSTE_POSETIVO') {
            event.posetiveAdjustment = adjustment.adjustedValue
          } else {
            event.negativeAdjustment = adjustment.adjustedValue
          }
        } else if (adjustment.type === 'INVENTORYSTOCKADJUSTMENT') {
          adjustment.inventory = Inventory.find(adjustment.inventory_id)
          event.id = adjustment.inventory.id
          event.eventDate = adjustment.inventory.startDate
          event.moviment = 'Inventário'
          if (adjustment.operation.code === 'AJUSTE_POSETIVO') {
            event.posetiveAdjustment = adjustment.adjustedValue
          } else {
            event.negativeAdjustment = adjustment.adjustedValue
            event.outcomes = adjustment.adjustedValue
          }
        }
        event.notes = adjustment.notes
        this.drugEventList.push(event)
      }
    }
  },
  mounted () {
    this.generateDrugEventList()
  },
  computed: {
    drug () {
      return Drug.query()
                 .with('stocks')
                 .where('id', SessionStorage.getItem('selectedDrug').id)
                 .first()
    }
  },
  components: {
    Dialog: require('components/Shared/Dialog/Dialog.vue').default,
    TitleBar: require('components/Shared/TitleBar.vue').default,
    LoteInfoContainer: require('components/Stock/StockFile/LoteInfoContainer.vue').default,
    ListHeader: require('components/Shared/ListHeader.vue').default
    // TextInput: require('components/Shared/Input/TextField.vue').default
  }
}
</script>

<style lang="scss">
  .box-border {
    border: 1px solid $grey-4
  }
</style>
