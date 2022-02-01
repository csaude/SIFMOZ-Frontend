<template>
  <q-card style="width: 800px; max-width: 90vw;" class="q-pt-lg">
        <form @submit.prevent="submitForm" >
            <q-card-section class="q-px-md">
                <div class="q-mt-lg text-center">
                    <div class="row items-center q-mb-md text-center">
                        <span class="text-subtitle2">Inventário</span>
                    </div>
                    <q-separator color="grey-13" size="1px"/>
                </div>
                <div class="q-mt-md">
                    <div class="row">
                      <q-input
                        dense
                        outlined
                        class="col q-ml-md"
                        v-model="startDate"
                        mask="date"
                        ref="startDate"
                        :rules="['date']"
                        lazy-rules
                        label="Data do Inventário *">
                        <template v-slot:append>
                            <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                <q-date v-model="startDate" >
                                <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                                </q-date>
                            </q-popup-proxy>
                            </q-icon>
                        </template>
                    </q-input>
                    </div>
                </div>
                <div class="row">
                    <div class="col q-ml-md"  tabindex="0"> Tipo de Inventário:
                        <q-radio keep-color color="primary" v-model="currInventory.generic"  v-bind:val="true" label="Geral" />
                        <q-radio keep-color color="primary" v-model="currInventory.generic"  v-bind:val="false" label="Parcial"/>
                    </div>
                </div>
                <div
                  v-if="!currInventory.generic"
                  class="row q-mt-md">
                  <q-table
                    class="col"
                    dense
                    title="Medicamentos"
                    :rows="drugs"
                    :columns="columns"
                    :filter="filter"
                    row-key="id"
                    :selected-rows-label="getSelectedString"
                    selection="multiple"
                    v-model:selected="selected"
                  >
                    <template v-slot:top-right class="bg-grey-3">
                      <q-input
                        outlined
                        dense
                        style="width: 400px"
                        debounce="300"
                        v-model="filter"
                        placeholder="Pesquisar">
                        <template v-slot:append>
                          <q-icon name="search" />
                        </template>
                      </q-input>
                    </template>
                    <template #header="props">
                  <q-tr class="text-left bg-grey-3"  :props="props">
                    <q-th style="width: 70px"  ></q-th>
                    <q-th style="width: 120px" >{{columns[0].label}}</q-th>
                    <q-th class="col" >{{columns[1].label}}</q-th>
                  </q-tr>
            </template>
                  </q-table>
                </div>
            </q-card-section>
           <q-card-actions align="right" class="q-mb-md q-mr-sm">
                <q-btn label="Cancelar" color="red" @click="$emit('close')"/>
                <q-btn type="submit" label="Avançar" color="primary" />
            </q-card-actions>
        </form>
        <q-dialog v-model="alert.visible" persistent>
          <Dialog :type="alert.type" @closeDialog="closeDialog">
            <template v-slot:title> Informação</template>
            <template v-slot:msg> {{alert.msg}} </template>
          </Dialog>
        </q-dialog>
    </q-card>
</template>

<script>
import Inventory from '../../../store/models/stockinventory/Inventory'
import { ref } from 'vue'
import Drug from '../../../store/models/drug/Drug'
import { date, SessionStorage } from 'quasar'
import Clinic from '../../../store/models/clinic/Clinic'
import { InventoryStockAdjustment } from '../../../store/models/stockadjustment/InventoryStockAdjustment'
import Stock from '../../../store/models/stock/Stock'
import StockOperationType from '../../../store/models/stockoperation/StockOperationType'
const columns = [
  { name: 'code', required: true, label: 'Código FNM', field: 'fnmCode', align: 'left', sortable: false },
  { name: 'drug', align: 'left', label: 'Medicamento', field: 'name', sortable: true }
]
export default {
  data () {
    return {
      filter: ref(''),
      alert: ref({
        type: '',
        visible: false,
        msg: ''
      }),
      columns,
      currInventory: new Inventory(),
      selected: ref([])
    }
  },
  methods: {
    formatDate (dateString) {
      return date.formatDate(dateString, 'YYYY-MM-DD')
    },
    displayAlert (type, msg) {
      this.alert.type = type
      this.alert.msg = msg
      this.alert.visible = true
    },
    closeDialog () {
      this.alert.visible = false
    },
    getSelectedString () {
      return this.selected.length === 0 ? '' : `${this.selected.length} registo${this.selected.length > 1 ? 's' : ''} selecionado de ${this.drugs.length}`
    },
    submitForm () {
      if (date.isValid(this.currInventory.startDate)) {
        if (this.currInventory.generic) {
          this.initInventory()
        } else {
          if (this.selected.length <= 0) {
            this.displayAlert('error', 'Por favor selecionar os medicamentos a inventariar uma vez seleccionada a opção para inventário parcial.')
          } else {
            this.initInventory()
          }
        }
      } else {
        this.displayAlert('error', 'Por favor indicar uma data de início válida!')
      }
    },
    async initInventory () {
      if (!this.currInventory.generic) {
        this.doBeforeSave()
      }
      console.log(this.currInventory)
      this.currInventory.clinic = this.currClinic
      await Inventory.apiSave(this.currInventory).then(resp => {
        SessionStorage.set('currInventory', resp.response.data)
        Inventory.apiFetchById(resp.response.data.id)
        this.$router.push('/stock/inventory')
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
    doBeforeSave () {
      Object.keys(this.selected).forEach(function (k) {
        const drug = this.selected[k]
        Object.keys(drug.stocks).forEach(function (i) {
          this.initNewAdjustment(drug.stocks[i], drug)
        }.bind(this))
      }.bind(this))
    },
    initNewAdjustment (stock, drug) {
      const newAdjustment = new InventoryStockAdjustment({
        adjustedStock: Stock.query()
                            .with('clinic.province')
                            .with('entrance.clinic.province')
                            .with('center.clinic.province')
                            .where('id', stock.id)
                            .first(),
        clinic: this.currClinic,
        captureDate: new Date(),
        operation: StockOperationType.query().where('code', 'AJUSTE_NEGATIVO').first()
      })
      newAdjustment.adjustedStock.drug = drug
      this.currInventory.adjustments.push(newAdjustment)
    }
  },
  components: {
    Dialog: require('components/Shared/Dialog/Dialog.vue').default
  },
  computed: {
    startDate: {
      get () {
        return this.formatDate(this.currInventory.startDate)
      },
      set (value) {
        this.currInventory.startDate = new Date(value)
      }
    },
    drugs () {
      return Drug.query()
                 .with('stocks')
                 .with('form')
                 .has('stocks')
                 .where('active', true)
                 .get()
    },
    currClinic () {
      return Clinic.query()
                  .with('province')
                  .where('id', SessionStorage.getItem('currClinic').id)
                  .first()
    }
  }
}
</script>

<style>

</style>
