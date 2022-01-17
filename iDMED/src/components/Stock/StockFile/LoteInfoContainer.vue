<template>
  <div class="box-border q-pb-md">
          <ListHeader
            :addVisible="isDisplayStep"
            :doneVisible="doneVisible"
            :mainContainer="false"
            @addNewAdjustment="addNewAdjustment"
            @done="saveAjustment"
            @cancel="cancel"
            bgColor="bg-grey-4"><span class="text-blue-grey-8">Nr. do Lote: {{stock.batchNumber}} - [Saldo Actual: {{stock.stockMoviment}}] - [Validade: <span :class="getValidadeLabelColor">{{getValidade}}</span>]</span>
          </ListHeader>
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
                <q-th style="width: 200px" >{{columns[0].label}}</q-th>
                <q-th style="width: 350px;" >{{columns[1].label}}</q-th>
                <q-th style="width: 190px" >{{columns[2].label}}</q-th>
                <q-th style="width: 120px" >{{columns[3].label}}</q-th>
                <q-th style="width: 120px" >{{columns[4].label}}</q-th>
                <q-th style="width: 120px" >{{columns[5].label}}</q-th>
                <q-th style="width: 120px" >{{columns[6].label}}</q-th>
                <q-th style="width: 120px" >{{columns[7].label}}</q-th>
                <q-th style="width: 120px" >{{columns[8].label}}</q-th>
                <q-th class="col" >{{columns[9].label}}</q-th>
              </q-tr>

            </template>
            <template #body="props">
              <q-tr :props="props">
                <q-td key="eventDate" :props="props">
                  <span v-if="props.row.id === null">
                    <q-input
                        dense
                        outlined
                        class="col"
                        v-model="props.row.eventDate"
                        mask="date"
                        ref="expireDate"
                        label="Data Movimento">
                        <template v-slot:append>
                            <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                <q-date v-model="props.row.eventDate" >
                                <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                                </q-date>
                            </q-popup-proxy>
                            </q-icon>
                        </template>
                    </q-input>
                  </span>
                  <span v-else>{{formatDate(props.row.eventDate)}}</span>
                </q-td>
                <q-td key="moviment" :props="props">
                  <span v-if="props.row.id === null">
                    <TextInput
                      v-model="props.row.moviment"
                      label="Tipo de Movimento"
                      dense
                      class="col" />
                  </span>
                  <span v-else>{{props.row.moviment}}</span>
                </q-td>
                <q-td key="orderNumber" :props="props">
                  <span v-if="props.row.id === null">
                    <TextInput
                      v-model="props.row.orderNumber"
                      :disable="isLossAdjustment"
                      label="Número da Guia"
                      dense
                      class="col" />
                  </span>
                  <span v-else>{{props.row.orderNumber}}</span>
                </q-td>
                <q-td key="incomes" :props="props">
                  <span v-if="props.row.id === null">
                    <TextInput
                      v-model="props.row.incomes"
                      disable
                      label="Entradas"
                      dense
                      class="col" />
                  </span>
                  <span v-else>{{props.row.incomes}}</span>
                </q-td>
                <q-td key="outcomes" :props="props">
                  <span v-if="props.row.id === null">
                    <TextInput
                      v-model="props.row.outcomes"
                      disable
                      label="Saídas"
                      dense
                      class="col" />
                  </span>
                  <span v-else>{{props.row.outcomes}}</span>
                </q-td>
                <q-td key="posetiveAdjustment" :props="props">
                  <span v-if="props.row.id === null">
                    <TextInput
                      v-model="props.row.posetiveAdjustment"
                      :disable="!isPosetiveAdjustment"
                      label="Ajuste Posetivo"
                      dense
                      class="col" />
                  </span>
                  <span v-else>{{props.row.posetiveAdjustment}}</span>
                </q-td>
                <q-td key="negativeAdjustment" :props="props">
                  <span v-if="props.row.id === null">
                    <TextInput
                      v-model="props.row.negativeAdjustment"
                      :disable="!isNegativeAdjustment"
                      label="Ajuste Negativo"
                      dense
                      class="col" />
                  </span>
                  <span v-else>{{props.row.negativeAdjustment}}</span>
                </q-td>
                <q-td key="loses" :props="props">
                  <span v-if="props.row.id === null">
                    <TextInput
                      v-model="props.row.loses"
                      :disable="!isLossAdjustment"
                      label="Perdas"
                      dense
                      class="col" />
                  </span>
                  <span v-else>{{props.row.loses}}</span>
                </q-td>
                <q-td key="balance" :props="props">
                  <span v-if="props.row.id === null">
                    <TextInput
                      v-model="props.row.balance"
                      disable
                      label="Saldo"
                      dense
                      class="col" />
                  </span>
                  <span v-else>{{props.row.balance}}</span>
                </q-td>
                <q-td key="notes" :props="props">
                  <span v-if="props.row.id === null">
                    <TextInput
                      v-model="props.row.notes"
                      label="Notas"
                      dense
                      class="col" />
                  </span>
                  <span v-else>{{props.row.notes}}</span>
                </q-td>
              </q-tr>
            </template>
          </q-table>
          <q-dialog v-model="alert.visible" persistent>
            <Dialog :type="alert.type" @closeDialog="closeDialog">
              <template v-slot:title> Informação</template>
              <template v-slot:msg> {{alert.msg}} </template>
            </Dialog>
          </q-dialog>
        </div>
</template>

<script>
import { date, SessionStorage } from 'quasar'
import Stock from '../../../store/models/stock/Stock'
import { StockDestructionAdjustment } from '../../../store/models/stockadjustment/StockDestructionAdjustment'
import StockOperationType from '../../../store/models/stockoperation/StockOperationType'
import DestroyedStock from '../../../store/models/stockdestruction/DestroyedStock'
import Clinic from '../../../store/models/clinic/Clinic'
import { ref } from 'vue'
import { StockReferenceAdjustment } from '../../../store/models/stockadjustment/StockReferenceAdjustment'
import ReferedStockMoviment from '../../../store/models/stockrefered/ReferedStockMoviment'
import Inventory from '../../../store/models/stockinventory/Inventory'
const columns = [
  { name: 'eventDate', required: true, label: 'Data Movimento', field: 'eventDate', align: 'center', sortable: true },
  { name: 'moviment', align: 'center', label: 'Origem/Destino', sortable: true },
  { name: 'orderNumber', align: 'center', label: 'Nr. Guia', sortable: false },
  { name: 'incomes', align: 'center', label: 'Entrada', sortable: true },
  { name: 'outcomes', align: 'center', label: 'Saídas', sortable: true },
  { name: 'posetiveAdjustment', align: 'center', label: 'Ajuste Posetivo (+)', sortable: true },
  { name: 'negativeAdjustment', align: 'center', label: 'Ajuste Negativo (-)', sortable: true },
  { name: 'loses', align: 'center', label: 'Perdas', sortable: true },
  { name: 'balance', align: 'center', label: 'Saldo', sortable: true },
  { name: 'notes', align: 'center', label: 'Notas', sortable: false }
]
export default {
  props: ['stock'],
  data () {
    return {
      alert: ref({
        type: '',
        visible: false,
        msg: ''
      }),
      columns,
      stockExpiteStatus: '',
      drugEventList: [],
      adjustmentType: '',
      step: 'display',
      curEvent: {}
    }
  },
  methods: {
    formatDate (dateString) {
      return date.formatDate(dateString, 'DD-MM-YYYY')
    },
    saveAjustment () {
      let adjustment = null
      let reference = null
      let destruction = null
      if (this.isLossAdjustment) {
          destruction = new DestroyedStock({
            notes: this.curEvent.moviment,
            clinic: this.currClinic
          })
        adjustment = new StockDestructionAdjustment({
          adjustedValue: this.curEvent.loses,
          operation: StockOperationType.query().where('code', 'AJUSTE_NEGATIVO')
        })
        destruction.adjustments.push(adjustment)
      } else if (this.isPosetiveAdjustment || this.isNegativeAdjustment) {
         reference = new ReferedStockMoviment({
            origin: this.curEvent.moviment,
            date: new Date(this.curEvent.eventDate),
            quantity: this.isPosetiveAdjustment ? this.curEvent.posetiveAdjustment : this.curEvent.negativeAdjustment,
            orderNumber: this.curEvent.orderNumber,
            clinic: this.currClinic
          })
        adjustment = new StockReferenceAdjustment({
          adjustedValue: this.isPosetiveAdjustment ? this.curEvent.posetiveAdjustment : this.curEvent.negativeAdjustment,
          operation: StockOperationType.query().where('code', this.isPosetiveAdjustment ? 'AJUSTE_POSETIVO' : 'AJUSTE_NEGATIVO').first()
        })
        reference.adjustments.push(adjustment)
      }

      adjustment.adjustedStock = Stock.query()
                                      .with('clinic.province')
                                      .with('entrance.clinic.province')
                                      .with('center.clinic.province')
                                      .with('drug.form')
                                      .where('id', this.stock.id)
                                      .first()
      if (new Date(this.curEvent.eventDate) < new Date(adjustment.adjustedStock.entrance.dateReceived)) {
        this.displayAlert('error', 'A data do movimento não pode ser menor que a data de entrada do lote.')
      } else if (new Date(this.curEvent.eventDate) > new Date()) {
        this.displayAlert('error', 'A data do movimento não pode ser maior que a data corrente.')
      } else if (this.curEvent.moviment === '') {
        this.displayAlert('error', 'Por favor indicar a Origem/Destino.')
      } else if (Number(adjustment.adjustedValue) <= 0) {
        this.displayAlert('error', 'Por favor indicar uma quantidade válida.')
      } else if ((this.isLossAdjustment || this.isNegativeAdjustment) && (Number(adjustment.adjustedStock.stockMoviment - adjustment.adjustedValue) < 0)) {
         this.displayAlert('error', 'A quantidade que pretende retitar é maior que a quantidade em stock no momento, impossível prosseguir!')
      } else {
        adjustment.clinic = this.currClinic
        adjustment.notes = this.curEvent.notes
        adjustment.captureDate = new Date(this.curEvent.eventDate)
        adjustment.finalized = true
        if (this.isPosetiveAdjustment) {
          adjustment.adjustedStock.stockMoviment = Number(adjustment.adjustedStock.stockMoviment + adjustment.adjustedValue)
        } else {
          adjustment.adjustedStock.stockMoviment = Number(adjustment.adjustedStock.stockMoviment - adjustment.adjustedValue)
        }
        this.doSave(reference, destruction)
      }
    },
    doSave (reference, destruction) {
      console.log(reference)
      console.log(destruction)
      if (this.isPosetiveAdjustment || this.isNegativeAdjustment) {
        ReferedStockMoviment.apiSave(reference).then(resp => {
          this.updateRelatedStock(reference.adjustments[0].adjustedStock)
        }).catch(error => {
          const listErrors = []
          if (error.request.response != null) {
            const arrayErrors = JSON.parse(error.request.response)
            if (arrayErrors.total == null) {
              listErrors.push(arrayErrors.message)
            } else {
              arrayErrors._embedded.errors.forEach(element => {
                listErrors.push(element.message)
              })
            }
          }
          this.displayAlert('error', listErrors)
        })
      } else {
        DestroyedStock.apiSave(destruction).then(resp => {
          this.updateRelatedStock(destruction.adjustments[0].adjustedStock)
        }).catch(error => {
          const listErrors = []
          if (error.request.response != null) {
            const arrayErrors = JSON.parse(error.request.response)
            if (arrayErrors.total == null) {
              listErrors.push(arrayErrors.message)
            } else {
              arrayErrors._embedded.errors.forEach(element => {
                listErrors.push(element.message)
              })
            }
          }
          this.displayAlert('error', listErrors)
        })
      }
    },
    updateRelatedStock (stock) {
      Stock.apiUpdate(stock).then(resp => {
        this.step = 'display'
        this.adjustmentType = ''
        this.displayAlert('info', 'Operação efectuada com sucesso.')
      }).catch(error => {
          const listErrors = []
          if (error.request.response != null) {
            const arrayErrors = JSON.parse(error.request.response)
            if (arrayErrors.total == null) {
              listErrors.push(arrayErrors.message)
            } else {
              arrayErrors._embedded.errors.forEach(element => {
                listErrors.push(element.message)
              })
            }
          }
          this.displayAlert('error', listErrors)
        })
    },
    cancel () {
      const i = this.drugEventList.map(toRemove => toRemove.id).indexOf(this.curEvent.id) // find index of your object
      this.drugEventList.splice(i, 1)
      this.adjustmentType = ''
      this.step = 'display'
    },
    addNewAdjustment (adjustmentType) {
      this.adjustmentType = adjustmentType
      const event = {
            id: null,
            eventDate: '',
            moviment: '',
            orderNumber: '',
            incomes: '',
            outcomes: '',
            posetiveAdjustment: '',
            negativeAdjustment: '',
            loses: '',
            balance: '',
            notes: ''
          }
          console.log(event)
      this.curEvent = event
      this.drugEventList.unshift(event)
      this.step = 'create'
    },
    generateDrugEventList () {
      const lote = Stock.query()
                        .with('adjustments.*')
                        .with('entrance')
                        .with('drug')
                        .with('center')
                        .with('clinic.province')
                        .where('id', this.stock.id)
                        .first()
      this.loadRelatedEntrance(lote.entrance, lote)

      if (lote.adjustments.length > 0) {
        Object.keys(lote.adjustments).forEach(function (k) {
          this.loadRelatedAdjustments(lote.adjustments[k], lote)
        }.bind(this))
      }
      this.drugEventList.sort((a, b) => {
        const d1 = new Date(a.eventDate)
        const d2 = new Date(b.eventDate)
        return d2 - d1
      })
    },
    loadRelatedAdjustments (adjustment, stock) {
      const event = {
            id: '',
            eventDate: '',
            moviment: '',
            orderNumber: '',
            incomes: '',
            outcomes: '',
            posetiveAdjustment: '',
            negativeAdjustment: '',
            loses: '',
            balance: stock.stockMoviment,
            notes: ''
          }
      if (adjustment.type === 'STOCKDESTRUCTIONADJUSTMENT') {
        adjustment.destruction = DestroyedStock.find(adjustment.destruction_id)
        event.id = adjustment.destruction.id
        event.eventDate = adjustment.captureDate
        event.moviment = adjustment.destruction.notes
        event.outcomes = adjustment.adjustedValue
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
          event.outcomes = adjustment.adjustedValue
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
    },
    loadRelatedEntrance (entrance, stock) {
      const event = {
            id: entrance.id,
            eventDate: entrance.dateReceived,
            moviment: stock.center.name,
            orderNumber: entrance.orderNumber,
            incomes: stock.unitsReceived,
            outcomes: '',
            posetiveAdjustment: '',
            negativeAdjustment: '',
            loses: '',
            balance: stock.unitsReceived,
            notes: ''
          }
      this.drugEventList.push(event)
    },
    determineValidade () {
      const expireDate = new Date(this.stock.expireDate)
      if (expireDate < new Date()) {
        this.stockExpiteStatus = 'Expired'
        return 'Expirou aos ' + this.formatDate(this.stock.expireDate)
      } else if (expireDate === new Date()) {
        this.stockExpiteStatus = 'Expiring'
        return 'Expira Hoje!'
      } else if (date.addToDate(new Date(), { months: 2 }) >= expireDate) {
        this.stockExpiteStatus = 'Expiring'
        const diff = date.getDateDiff(expireDate, new Date(), 'days')
        return 'Faltam ' + diff + 'dias para expirar'
      } else {
        this.stockExpiteStatus = 'valid'
        return this.formatDate(this.stock.expireDate)
      }
    },
    displayAlert (type, msg) {
      this.alert.type = type
      this.alert.msg = msg
      this.alert.visible = true
    },
    closeDialog () {
      this.alert.visible = false
    }
  },
  computed: {
    getValidade () {
      return this.determineValidade()
    },
    getValidadeLabelColor () {
      if (this.stockExpiteStatus !== 'valid') {
        return 'text-red-8'
      } else {
        return 'text-green-8'
      }
    },
    doneVisible () {
      return this.step === 'eidt' || this.step === 'create'
    },
    isDisplayStep () {
      return this.step === 'display'
    },
    isPosetiveAdjustment () {
      return this.adjustmentType === 'POSETIVE'
    },
    isNegativeAdjustment () {
      return this.adjustmentType === 'NEGATIVE'
    },
    isLossAdjustment () {
      return this.adjustmentType === 'LOSS'
    },
    currClinic () {
      return Clinic.query()
                  .with('province')
                  .where('id', SessionStorage.getItem('currClinic').id)
                  .first()
    }
  },
  mounted () {
    this.generateDrugEventList()
  },
  components: {
    Dialog: require('components/Shared/Dialog/Dialog.vue').default,
    // TitleBar: require('components/Shared/TitleBar.vue').default,
    ListHeader: require('components/Stock/StockFile/StockFileListHeader.vue').default,
    TextInput: require('components/Shared/Input/TextField.vue').default
  }
}
</script>

<style>

</style>
