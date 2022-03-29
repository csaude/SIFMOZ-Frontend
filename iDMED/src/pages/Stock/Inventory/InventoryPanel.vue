<template>
  <div>
    <TitleBar>Detalhes do Inventário</TitleBar>
    <div class="row">
      <div class="col-3 q-pa-md q-pl-lg q-ml-lg q-mr-lg">
        <div>
          <ListHeader
            :addVisible="false"
            :mainContainer="true"
            bgColor="bg-primary">Notas do Inventário
          </ListHeader>
          <div class="box-border q-pt-md">
            <TextInput
              v-model="inventoryType"
              label="Tipo de Inventário"
              disable
              dense
              class="col q-ma-sm" />
            <q-input
                dense
                outlined
                disable
                class="col q-ma-sm"
                v-model="startDate"
                ref="dateReceived"
                label="Data de Abertura">
                <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                        <q-date v-model="startDate" mask="DD-MM-YYYY">
                        <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                        </q-date>
                    </q-popup-proxy>
                    </q-icon>
                </template>
            </q-input>
            <q-separator class="q-mx-sm"/>
            <div class="row q-pa-sm">
              <q-btn unelevated color="blue" class="col" label="Voltar" @click="goBack"/>
              <q-space v-if="currInventory.open"/>
              <q-btn
                v-if="currInventory.open"
                unelevated
                color="red"
                class="q-ml-md col"
                @click="initInventoryClosure()"
                label="Fechar Inventário" />
            </div>
          </div>
        </div>
      </div>
      <div class="col q-pt-md q-mr-lg">
        <q-scroll-area
            :thumb-style="thumbStyle"
            :content-style="contentStyle"
            :content-active-style="contentActiveStyle"
            style="height: 700px;"
            class="q-pr-md"
          >
          <span
            v-for="drug in drugs" :key="drug.id" >
            <AdjustmentTable
              :drug="drug"
              :inventory="currInventory" />
          </span>
        </q-scroll-area>
      </div>
    </div>
    <q-dialog v-model="alert.visible" persistent>
      <Dialog :type="alert.type" @closeDialog="closeDialog" @commitOperation="closeInventory">
        <template v-slot:title> {{dialogTitle}}</template>
        <template v-slot:msg> {{alert.msg}} </template>
      </Dialog>
    </q-dialog>
  </div>
</template>

<script>
import Drug from '../../../store/models/drug/Drug'
import { ref } from 'vue'
import { date, QSpinnerBall, SessionStorage } from 'quasar'
import Inventory from '../../../store/models/stockinventory/Inventory'
import Clinic from '../../../store/models/clinic/Clinic'
import { InventoryStockAdjustment } from '../../../store/models/stockadjustment/InventoryStockAdjustment'
import Stock from '../../../store/models/stock/Stock'
import StockEntrance from '../../../store/models/stockentrance/StockEntrance'
import moment from 'moment'

export default {
  data () {
    return {
      alert: ref({
        type: '',
        visible: false,
        msg: ''
      }),
      dialogTitle: 'Informação',
      adjustments: ref([]),
      step: 'display',
      processedAdjustments: [],
      contentStyle: {
        backgroundColor: '#ffffff',
        color: '#555'
      },

      contentActiveStyle: {
        backgroundColor: '#eee',
        color: 'black'
      },

      thumbStyle: {
        right: '2px',
        borderRadius: '5px',
        backgroundColor: '#0ba58b',
        width: '5px',
        opacity: 0.75
      }
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    initInventoryClosure () {
      this.dialogTitle = 'Confirmação do fecho do inventário.'
      this.displayAlert('confirmation', 'Nota: Ao encerrar o presente inventário o stock será actualizado para os dados informados e está operação não poderá ser desfeita. Continuar?')
    },
    closeInventory () {
      this.$q.loading.show({
        message: 'A fechar inventário ...',
        spinnerColor: 'grey-4',
        spinner: QSpinnerBall
        // delay: 400 // ms
      })

      setTimeout(() => {
        this.$q.loading.hide()
      }, 800)
      console.log('close invenctory')
      Inventory.apiFetchById(this.currInventory.id).then(resp => {
        this.doProcessAndClose()
      })
    },
    doProcessAndClose () {
      const offset = 0
      const max = 100
      const inventory = Inventory.query()
                                 .with('adjustments.*')
                                 .with('clinic.province')
                                 .where('id', this.currInventory.id)
                                 .first()
      inventory.endDate = new Date()
      inventory.open = false
      inventory.adjustments.forEach((adjustment) => {
        this.processAdjustment(adjustment, inventory)
      })
      this.doSaveAdjustment(0)
      console.log(inventory)
      console.log(this.currInventory)
      Inventory.apiUpdate(inventory).then(resp => {
        this.step = 'display'
        this.currInventory.open = false
        Inventory.apiFetchById(this.currInventory.id)
        this.getAllStockOfClinic(this.currClinic.id)
        Stock.apiGetAll(offset, max)
        Drug.apiGetAll(offset, max)
        this.displayAlert('info', 'Operação efectuada com sucesso.')
      })
    },
    doSaveAdjustment (i) {
      if (this.processAdjustment[i] !== undefined && this.processAdjustment[i] !== null) {
        InventoryStockAdjustment.apiUpdate(this.processAdjustment[i]).then(resp => {
          i = i + 1
          setTimeout(this.doSaveAdjustment(i), 2)
        })
      }
    },
    processAdjustment (adjustment, inventory) {
      const iv = Object.assign({}, inventory)
      iv.adjustments = []
      adjustment.inventory = iv
      adjustment.clinic = this.currClinic
      adjustment.finalised = true
      adjustment.adjustedStock = Stock.query()
                                      .with('entrance.clinic.province')
                                      .with('drug.form')
                                      .with('center.clinic.province')
                                      .with('clinic.province')
                                      .where('id', adjustment.adjusted_stock_id)
                                      .first()
      adjustment.adjustedStock.stockMoviment = adjustment.balance
      this.processedAdjustments.push(adjustment)
    },
    formatDate (dateString) {
      return date.formatDate(dateString, 'YYYY-MM-DD')
    },
    getAllStockOfClinic () {
      const offset = 0
      const max = 100
      this.doStockEntranceGet(this.currClinic.id, offset, max)
    },
    doStockEntranceGet (clinicId, offset, max) {
      StockEntrance.apiGetAllByClinicId(clinicId, offset, max).then(resp => {
            if (resp.response.data.length > 0) {
              offset = offset + max
              setTimeout(this.doStockEntranceGet(clinicId, offset, max), 2)
            }
        }).catch(error => {
            console.log(error)
        })
    },
    getDrugs () {
      if (this.currInventory.generic) {
        return Drug.query()
                   .with('stocks.*')
                   .with('form')
                   .where('active', true)
                   .get()
      } else {
        return this.currInventory.drugs
      }
    },
    displayAlert (type, msg) {
      this.alert.type = type
      this.alert.msg = msg
      this.alert.visible = true
    },
    closeDialog () {
      this.alert.visible = false
    },
    retriveRelatedDrug (adjustment, drugList) {
      let isNewDrug = true
      console.log(adjustment)
      if (adjustment.adjustedStock === null) {
        adjustment.adjustedStock = Stock.query()
                                        .where('id', adjustment.adjusted_stock_id)
                                        .first()
      }
      const drug = Drug.query()
                      .with('stocks')
                      .with('form')
                      .where('id', adjustment.adjustedStock.drug_id)
                      .first()
      if (drugList.length <= 0) {
        drugList.push(drug)
      } else {
        Object.keys(drugList).forEach(function (i) {
          if (drugList[i].id === drug.id) {
            isNewDrug = false
          }
        })
        if (isNewDrug) drugList.push(drug)
      }
    },
    getJSDateFromDDMMYYY (dateString) {
      const dateParts = dateString.split('-')
      return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0])
    },
    getDDMMYYYFromJSDate (jsDate) {
      return moment(jsDate).format('DD-MM-YYYY')
    }
  },
  computed: {
    startDate: {
      get () {
        return this.getDDMMYYYFromJSDate(this.currInventory.startDate)
      },
      set (value) {
        this.currInventory.startDate = value
      }
    },
    isDisplayStep () {
      return this.step === 'display'
    },
    isEditionStep () {
      return this.step === 'edit'
    },
    isCreationStep () {
      return this.step === 'create'
    },
    isDeletionStep () {
      return this.step === 'delete'
    },
    enableFields () {
      return this.isEditionStep || this.isCreationStep
    },
    currInventory () {
      const e = new Inventory(SessionStorage.getItem('currInventory'))
      return Inventory.query()
                      .with('clinic.province')
                      .with('adjustments.adjustedStock')
                      .where('id', e.id)
                      .first()
    },
    drugs () {
      if (this.currInventory.generic) {
        return Drug.query()
                   .with('stocks')
                   .with('form')
                   .has('stocks')
                   .where('active', true)
                   .get()
      } else {
        const drugList = []
        console.log(this.currInventory)
        Object.keys(this.currInventory.adjustments).forEach(function (i) {
          this.currInventory.adjustments[i].adjustedStock = Stock.query()
                                                                 .with('drug.form')
                                                                 .with('center.clinic')
                                                                 .with('entrance.clinic')
                                                                 .where('id', this.currInventory.adjustments[i].adjusted_stock_id)
                                                                 .first()
          console.log(this.currInventory.adjustments[i])
          this.retriveRelatedDrug(this.currInventory.adjustments[i], drugList)
        }.bind(this))
        return drugList
      }
    },
    inventoryType () {
      return this.currInventory.getInventoryType()
    },
    currClinic () {
      return Clinic.query()
                  .with('province')
                  .where('id', SessionStorage.getItem('currClinic').id)
                  .first()
    }
  },
  components: {
    Dialog: require('components/Shared/Dialog/Dialog.vue').default,
    TitleBar: require('components/Shared/TitleBar.vue').default,
    ListHeader: require('components/Shared/ListHeader.vue').default,
    TextInput: require('components/Shared/Input/TextField.vue').default,
    AdjustmentTable: require('components/Stock/Inventory/InventoryAdjustmentsContainer.vue').default
  }
}
</script>

<style lang="scss">
  .box-border {
    border: 1px solid $grey-4
  }
</style>
