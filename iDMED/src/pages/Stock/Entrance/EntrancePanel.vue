<template>
  <div>
    <TitleBar>Detalhe da Guia</TitleBar>
    <div class="row" v-if="mobile">
       <div class="col q-mx-md q-mt-md">
        <ListHeader
            :addVisible="false"
            :mainContainer="true"
            bgColor="bg-primary">Notas da Guia
          </ListHeader>
          <div class="box-border row q-pt-sm ">
                    <TextInput
                      v-model="currStockEntrance.orderNumber"
                      label="Número"
                      :rules="[ val => !!val || 'Por favor indicar o número da guia']"
                      :disable="!isGuiaEditionStep"
                      dense
                       class="col q-mx-md" />
                    <q-input
                        dense
                        outlined
                        :disable="!isGuiaEditionStep"
                         class="col q-mx-md"
                        v-model="dateReceived"
                        label="Data de Criação">
                        <template v-slot:append>
                            <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                <q-date v-model="dateReceived" mask="DD-MM-YYYY">
                                <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                                </q-date>
                            </q-popup-proxy>
                            </q-icon>
                        </template>
                    </q-input>
                    <div class="row q-mx-sm  items-center " v-if="isGuiaDisplayStep">
                      <q-btn unelevated color="blue" class="col q-ma-sm" label="Voltar" @click="goBack"  size="12px"/>
                      <q-btn unelevated color="orange-5" class="q-ml-md col" label="Editar" @click="initGuiaEdition"  size="12px" />
                      <q-btn unelevated color="red" class="q-ml-md col" label="Remover" @click="removeGuia"  size="12px"/>
                    </div>
                    <div class="row q-pa-sm" v-if="isGuiaEditionStep">
                      <q-btn unelevated color="blue" class="col" label="Cancelar" @click="cancelOperation" size="10px"/>
                      <q-btn unelevated color="orange-5" class="q-ml-md col" label="Gravar" @click="doSaveGuia" size="10px"/>
                    </div>
                  </div>
      </div>
      <div  class="col-12 q-px-md">
      <div>
          <ListHeader
            :addVisible="isGuiaDisplayStep"
            :mainContainer="true"
            @showAdd="initNewStock"
            bgColor="bg-primary">Medicamentos
          </ListHeader>
          <div class="box-border q-pb-md">
            <q-table
                class="col"
                dense
                flat
                :rows="stockList"
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
                  <q-tr class="text-left bg-grey-3"  :props="props">
                    <q-th style="width: 70px" >{{columns[0].label}}</q-th>
                    <q-th class="col" >{{columns[1].label}}</q-th>
                    <q-th style="width: 190px" >{{columns[2].label}}</q-th>
                    <q-th style="width: 190px" >{{columns[3].label}}</q-th>
                    <q-th style="width: 190px" >{{columns[4].label}}</q-th>
                    <q-th style="width: 120px" >{{columns[5].label}}</q-th>
                    <q-th style="width: 150px; text-align: center" >{{columns[6].label}}</q-th>
                  </q-tr>

                </template>
                <template #body="props">
                  <q-tr :props="props">
                    <q-td key="order" :props="props">
                    {{index}}
                    </q-td>
                    <q-td key="drug" :props="props">
                      <q-select
                        class="col"
                        dense outlined
                        :disable="!props.row.enabled"
                        ref="drug"
                        v-model="props.row.drug"
                        :options="drugs"
                        option-value="id"
                        option-label="name"
                        label="Medicamento"
                        @filter="filterFn"
                        use-input
                        hide-selected
                        fill-input
                        input-debounce="0">
                        <template v-slot:no-option>
                          <q-item>
                            <q-item-section class="text-grey">
                              Sem Resultados
                            </q-item-section>
                          </q-item>
                        </template>
                      </q-select>
                    </q-td>
                     <q-td key="manufacture" :props="props">
                      <TextInput
                        v-model="props.row.manufacture"
                        :disable="!props.row.enabled"
                        label="Fabricante"
                        dense
                        class="col" />
                    </q-td>
                    <q-td key="batchNumber" :props="props">
                      <TextInput
                        v-model="props.row.batchNumber"
                        :disable="!props.row.enabled"
                        label="Lote"
                        dense
                        class="col" />
                    </q-td>
                    <q-td key="expireDate" :props="props">
                      <q-input
                        dense
                        :disable="!props.row.enabled"
                        outlined
                        class="col"
                        v-model="props.row.auxExpireDate"
                        ref="expireDate"
                        label="Data de Validade">
                        <template v-slot:append>
                            <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                <q-date v-model="props.row.auxExpireDate" mask="DD-MM-YYYY">
                                <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                                </q-date>
                            </q-popup-proxy>
                            </q-icon>
                        </template>
                    </q-input>
                    </q-td>
                    <q-td key="unitsReceived" :props="props">
                      <TextInput
                        v-model="props.row.unitsReceived"
                        :disable="!props.row.enabled"
                        label="Quantidade"
                        dense
                        class="col" />
                    </q-td>
                    <q-td key="options" :props="props">
                      <div class="col" v-if="!props.row.isInUse()">
                        <q-btn v-if="props.row.enabled" :loading="submitting" flat dense round color="primary" icon="done" @click="validateStock(props.row)"/>
                        <q-btn v-if="props.row.enabled" flat dense round color="red" icon="clear" @click="cancel(props.row)"/>
                        <q-btn v-if="!props.row.enabled" flat dense round color="orange-5" icon="edit"  @click="initStockEdition(props.row)" />
                        <q-btn v-if="!props.row.enabled" flat dense round color="red" icon="delete_forever" class="q-ml-sm"  @click="promptStockDeletion(props.row)"/>
                      </div>
                      <div class="col" v-else>
                        <q-chip color="info" text-color="white">
                          Em Uso
                        </q-chip>
                      </div>
                    </q-td>
                  </q-tr>
                </template>
            </q-table>
          </div>
          <div class="row">
                <q-banner
                  dense
                  inline-actions
                  style="padding-top: 2px; padding-bottom: 2px;"
                  class="col text-white q-pa-none bg-orange-4 q-pr-sm">
                    <template v-slot:action class="items-center">
                        <q-btn dense unelevated color="primary" class="col" label="Imprimir" />
                    </template>
                </q-banner>
              </div>
        </div>
      </div>
    </div>

    <div class="row" v-if="website">
      <div class="col-3 q-pa-md q-pl-lg q-ml-lg q-mr-lg">
        <div>
          <ListHeader
            :addVisible="false"
            :mainContainer="true"
            bgColor="bg-primary">Notas da Guia
          </ListHeader>
          <div class="box-border q-pt-md">
            <TextInput
              v-model="currStockEntrance.orderNumber"
              label="Número"
              :rules="[ val => !!val || 'Por favor indicar o número da guia']"
              :disable="!isGuiaEditionStep"
              dense
              class="col q-ma-sm" />
            <q-input
                dense
                outlined
                :disable="!isGuiaEditionStep"
                class="col q-ma-sm"
                v-model="dateReceived"
                label="Data de Criação">
                <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                        <q-date v-model="dateReceived" mask="DD-MM-YYYY">
                        <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                        </q-date>
                    </q-popup-proxy>
                    </q-icon>
                </template>
            </q-input>
            <q-separator class="q-mx-sm"/>
            <div class="row q-pa-sm" v-if="isGuiaDisplayStep">
              <q-btn unelevated color="blue" class="col" label="Voltar" @click="goBack"/>
              <q-btn unelevated color="orange-5" class="q-ml-md col" label="Editar" @click="initGuiaEdition"/>
              <q-btn unelevated color="red" class="q-ml-md col" label="Remover" @click="removeGuia"/>
            </div>
            <div class="row q-pa-sm" v-if="isGuiaEditionStep">
              <q-btn unelevated color="blue" class="col" label="Cancelar" @click="cancelOperation"/>
              <q-btn unelevated color="orange-5" class="q-ml-md col" label="Gravar" @click="doSaveGuia"/>
            </div>
          </div>
        </div>
      </div>
      <div class="col q-pt-md q-mr-lg">
      <div>
          <ListHeader
            :addVisible="isGuiaDisplayStep"
            :mainContainer="true"
            @showAdd="initNewStock"
            bgColor="bg-primary">Medicamentos
          </ListHeader>
          <div class="box-border q-pb-md">
            <q-table
                class="col"
                dense
                flat
                :rows="stockList"
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
                  <q-tr class="text-left bg-grey-3"  :props="props">
                    <q-th style="width: 70px" >{{columns[0].label}}</q-th>
                    <q-th class="col" >{{columns[1].label}}</q-th>
                    <q-th style="width: 190px" >{{columns[2].label}}</q-th>
                    <q-th style="width: 190px" >{{columns[3].label}}</q-th>
                    <q-th style="width: 190px" >{{columns[4].label}}</q-th>
                    <q-th style="width: 120px" >{{columns[5].label}}</q-th>
                    <q-th style="width: 150px; text-align: center" >{{columns[6].label}}</q-th>
                  </q-tr>

                </template>
                <template #body="props">
                  <q-tr :props="props">
                    <q-td key="order" :props="props">
                    {{index}}
                    </q-td>
                    <q-td key="drug" :props="props">
                      <q-select
                        class="col"
                        dense outlined
                        :disable="!props.row.enabled"
                        ref="drug"
                        v-model="props.row.drug"
                        :options="drugs"
                        option-value="id"
                        option-label="name"
                        label="Medicamento"
                        @filter="filterFn"
                        use-input
                        hide-selected
                        fill-input
                        input-debounce="0">
                        <template v-slot:no-option>
                          <q-item>
                            <q-item-section class="text-grey">
                              Sem Resultados
                            </q-item-section>
                          </q-item>
                        </template>
                      </q-select>
                    </q-td>
                     <q-td key="manufacture" :props="props">
                      <TextInput
                        v-model="props.row.manufacture"
                        :disable="!props.row.enabled"
                        label="Fabricante"
                        dense
                        class="col" />
                    </q-td>
                    <q-td key="batchNumber" :props="props">
                      <TextInput
                        v-model="props.row.batchNumber"
                        :disable="!props.row.enabled"
                        label="Lote"
                        dense
                        class="col" />
                    </q-td>
                    <q-td key="expireDate" :props="props">
                      <q-input
                        dense
                        :disable="!props.row.enabled"
                        outlined
                        class="col"
                        v-model="props.row.auxExpireDate"
                        ref="expireDate"
                        label="Data de Validade">
                        <template v-slot:append>
                            <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                <q-date v-model="props.row.auxExpireDate" mask="DD-MM-YYYY">
                                <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                                </q-date>
                            </q-popup-proxy>
                            </q-icon>
                        </template>
                    </q-input>
                    </q-td>
                    <q-td key="unitsReceived" :props="props">
                      <TextInput
                        v-model="props.row.unitsReceived"
                        :disable="!props.row.enabled"
                        label="Quantidade"
                        dense
                        class="col" />
                    </q-td>
                    <q-td key="options" :props="props">
                      <div class="col" v-if="!props.row.isInUse()">
                        <q-btn v-if="props.row.enabled" :loading="submitting" flat dense round color="primary" icon="done" @click="validateStock(props.row)"/>
                        <q-btn v-if="props.row.enabled" flat dense round color="red" icon="clear" @click="cancel(props.row)"/>
                        <q-btn v-if="!props.row.enabled" flat dense round color="orange-5" icon="edit"  @click="initStockEdition(props.row)" />
                        <q-btn v-if="!props.row.enabled" flat dense round color="red" icon="delete_forever" class="q-ml-sm"  @click="promptStockDeletion(props.row)"/>
                      </div>
                      <div class="col" v-else>
                        <q-chip color="info" text-color="white">
                          Em Uso
                        </q-chip>
                      </div>
                    </q-td>
                  </q-tr>
                </template>
            </q-table>
          </div>
          <div class="row">
                <q-banner
                  dense
                  inline-actions
                  style="padding-top: 2px; padding-bottom: 2px;"
                  class="col text-white q-pa-none bg-orange-4 q-pr-sm">
                    <template v-slot:action class="items-center">
                        <q-btn dense unelevated color="primary" class="col" label="Imprimir" />
                    </template>
                </q-banner>
              </div>
        </div>
      </div>
    </div>
    <q-dialog v-model="alert.visible" persistent>
      <Dialog :type="alert.type" @closeDialog="closeDialog" @commitOperation="doRemove">
        <template v-slot:title> Informação</template>
        <template v-slot:msg> {{alert.msg}} </template>
      </Dialog>
    </q-dialog>
  </div>
</template>

<script>
import Drug from '../../../store/models/drug/Drug'
import Stock from '../../../store/models/stock/Stock'
import StockEntrance from '../../../store/models/stockentrance/StockEntrance'
import { ref } from 'vue'
import StockCenter from '../../../store/models/stockcenter/StockCenter'
import { date, SessionStorage } from 'quasar'
import Clinic from '../../../store/models/clinic/Clinic'
import moment from 'moment'
import mixinplatform from 'src/mixins/mixin-system-platform'
// import { v4 as uuidv4 } from 'uuid'

const columns = [
  { name: 'order', required: true, label: 'Ordem', field: 'index', align: 'left', sortable: false },
  { name: 'drug', align: 'left', label: 'Medicamento', sortable: true },
  { name: 'manufacture', align: 'left', label: 'Fabricante', sortable: true },
  { name: 'batchNumber', align: 'left', label: 'Lote', sortable: true },
  { name: 'expireDate', align: 'left', label: 'Data de Validade', sortable: false },
  { name: 'unitsReceived', align: 'left', label: 'Quantidade', sortable: true },
  { name: 'options', align: 'center', label: 'Opções', sortable: false }
]
export default {
   mixins: [mixinplatform],
  data () {
    return {
      alert: ref({
        type: '',
        visible: false,
        msg: ''
      }),
      submitting: false,
      columns,
      dateReceived: '',
      step: 'display',
      guiaStep: 'display',
      selectedStock: '',
      drugs: ref([]),
      stockList: ref([])
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    filterFn (val, update, abort) {
      if (val === '') {
          update(() => {
             this.drugs = this.activeDrugs
          })
          return
        }

      update(() => {
        this.drugs = this.activeDrugs.filter((drug) => { return this.stringContains(drug.name, val) })
      })
    },
    stringContains (stringToCheck, stringText) {
        if (stringText === '') return false
        return stringToCheck.toLowerCase().includes(stringText.toLowerCase())
    },
    init () {
      this.dateReceived = this.getDDMMYYYFromJSDate(this.currStockEntrance.dateReceived)
    },
    cancelOperation () {
      this.guiaStep = 'display'
    },
    doSaveGuia () {
          this.currStockEntrance.dateReceived = moment(this.dateReceived).format() // this.getJSDateFromDDMMYYY()
          console.log(this.currStockEntrance)
          this.currStockEntrance.clinic = this.currClinic
          if (this.website) {
            StockEntrance.apiSave(this.currStockEntrance).then(resp => {
            SessionStorage.set('currStockEntrance', resp.response.data)
            this.guiaStep = 'display'
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
          } else {
            this.currStockEntrance.syncStatus = 'U'
            StockEntrance.localDbUpdate(this.currStockEntrance).then(stockEnt => {
              StockEntrance.update(this.currStockEntrance)
              this.guiaStep = 'display'
              this.displayAlert('info', 'Operação efectuada com sucesso.')
               })
          }
    },
    initGuiaEdition () {
      if (this.currStockEntrance.stocks.length > 0 || this.stockList.length > 0) {
        this.displayAlert('error', 'Não pode editar os dados da guia, pois ja existem registos de lotes associados.')
      } else {
        this.guiaStep = 'edit'
      }
    },
    removeGuia () {
      if (this.currStockEntrance.stocks.length > 0 || this.stockList.length > 0) {
        this.displayAlert('error', 'Não pode remover esta guia, pois ja existem registos de lotes associados.')
      } else {
        this.guiaStep = 'delete'
        this.displayAlert('confirmation', 'Deseja remover a presente guia de entrada de stock?')
      }
    },
    doRemoveGuia () {
      StockEntrance.apiRemove(this.currStockEntrance.id).then(resp => {
        this.goBack()
        this.displayAlert('info', 'Operação efectuada com sucesso.')
      })
    },
    formatDate (dateString) {
      return date.formatDate(dateString, 'YYYY-MM-DD')
    },
    getJSDateFromDDMMYYY (dateString) {
      const dateParts = dateString.split('-')
      return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0])
    },
    getDDMMYYYFromJSDate (jsDate) {
      return moment(jsDate).format('DD-MM-YYYY')
    },
    doRemove () {
      if (!this.isGuiaDeletionStep) {
        this.doRemoveStock()
      } else {
        this.doRemoveGuia()
      }
    },
    doRemoveStock () {
      this.step = 'delete'
      if (this.website) {
          Stock.apiRemove(this.selectedStock.id).then(resp => {
          Stock.delete(this.selectedStock.id)
          this.removeFromList(this.selectedStock)
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
      } else {
         const targetStock = this.selectedStock
          this.removeFromList(targetStock)
        if (this.selectedStock.syncStatus === 'S') {
              targetStock.syncStatus = 'D'
              Stock.localDbUpdate(targetStock).then(stock => {
                Stock.update(targetStock)
            })
           } else {
            Stock.localDbDelete(targetStock).then(stock => {
                Stock.delete(targetStock.id)
            })
           }
        }
        this.step = 'display'
    },
    initNewStock () {
      if (this.isEditionStep || this.isCreationStep) {
        this.displayAlert('error', 'Por favor concluir ou cancelar a operação em curso antes de iniciar a adição de novo registo.')
      } else {
        this.step = 'create'
        const newStock = new Stock({
          drug: new Drug(),
          center: this.stockCenter,
          enabled: true,
          clinic: this.currClinic,
          entrance: this.currStockEntrance
        })
        this.stockList.push(newStock)
      }
    },
    validateStock (stock) {
      this.submitting = true
      stock.expireDate = this.getJSDateFromDDMMYYY(stock.auxExpireDate)
      if (stock.drug.id === null) {
        this.submitting = false
        this.displayAlert('error', 'Por favor indicar o medicamento')
      } else if (stock.manufacture === '') {
        this.submitting = false
        this.displayAlert('error', 'Por favor indicar o fabricante!')
      } else if (stock.batchNumber === '') {
        this.submitting = false
        this.displayAlert('error', 'Por favor indicar o lote!')
      } else if (!date.isValid(stock.expireDate)) {
        this.submitting = false
        this.displayAlert('error', 'Por favor indicar uma data de validade válida!')
      } else if (stock.expireDate.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
        this.submitting = false
        this.displayAlert('error', 'A data de validade não pode ser anterior a data corrente!')
      } else if (Number(stock.unitsReceived) <= 0) {
        this.submitting = false
        this.displayAlert('error', 'Por favor indicar uma quantidade válida!')
      } else {
        this.doSave(stock)
      }
    },
    async doSave (stock) {
      stock.stockMoviment = stock.unitsReceived
      if (this.mobile) {
      await Stock.apiSave(stock).then(resp => {
        stock.id = resp.response.data.id
        this.submitting = false
        stock.enabled = false
        this.step = 'display'
        this.displayAlert('info', 'Operação efectuada com sucesso.')
      }).catch(error => {
          this.submitting = false
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
                   //  const targetCopy = new Stock(JSON.parse(JSON.stringify(stock)))
                   stock.entrance_id = this.currStockEntrance.id // stock.entrance.id
                   stock.drug_id = stock.drug.id
                   stock.clinic = this.currClinic
                   stock.clinic_id = this.currClinic.id
                   stock.enabled = false
                   stock.center = StockCenter.query().where('clinic_id', stock.clinic_id).first()
                   stock.stock_center_id = stock.center.id
                   stock.entrance.clinic_id = this.currClinic.id
                   stock.center.clinic = this.currClinic
                  // const uuid = uuidv4
                    const targetCopy = JSON.parse(JSON.stringify(stock))
                   Stock.localDbAddOrUpdate(targetCopy, this.step).then(stock1 => {
                     Stock.insert(
                  {
                    data: stock1.data.data
                  })
                  StockEntrance.localDbGetById(this.currStockEntrance.id).then(entrance => {
                      entrance.stocks.push(targetCopy)
                      StockEntrance.localDbUpdate(entrance)
                  })
                  /* if (stock.id === null) {
                  stock.id = stock1.data.data.id
                  } */
                    this.submitting = false
                    this.step = 'display'
                    this.displayAlert('info', 'Operação efectuada com sucesso.')
                  }).catch(error => {
                this.displayAlert('error', error)
              })
      }
    },
    async fetchStockEntrance () {
      await StockEntrance.apiFetchById(this.currStockEntrance.id).then(resp => {
        this.currStockEntrance = resp.response.data
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
    cancel (stock) {
      if (this.isEditionStep) {
        stock.drug = this.selectedStock.drug
        stock.expireDate = this.selectedStock.expireDate
        stock.batchNumber = this.selectedStock.batchNumber
        stock.unitsReceived = this.selectedStock.unitsReceived
        stock.enabled = false
      } else if (this.isCreationStep) {
        this.removeFromList(stock)
      }
      this.step = 'display'
    },
    removeFromList (stock) {
      const i = this.stockList.map(toRemove => toRemove.id).indexOf(stock.id) // find index of your object
      this.stockList.splice(i, 1)
    },
    initStockEdition (stock) {
      this.selectedStock = Object.assign({}, stock)
      if (this.isEditionStep || this.isCreationStep) {
        this.displayAlert('error', 'Por favor concluir ou cancelar a operação em curso antes de iniciar a edição deste registo.')
      } else {
        stock.enabled = true
        this.step = 'edit'
      }
    },
    promptStockDeletion (stock) {
      if (this.isEditionStep || this.isCreationStep) {
        this.displayAlert('error', 'Por favor concluir ou cancelar a operação em curso antes de iniciar a remoção deste registo.')
      } else {
        this.selectedStock = stock
        this.displayAlert('confirmation', 'Confirma a remoção do lote [' + stock.batchNumber + ']?')
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
    getCurrStockEntrance () {
      const e = SessionStorage.getItem('currStockEntrance')
      // e.clinic = SessionStorage.getItem('currClinic')
      // e.clinic.district.province_id = e.clinic.province.id
      // e.clinic.district.province = e.clinic.province
      if (this.website) return e
      return StockEntrance.query()
                          .with('stocks')
                          .with(['clinic.province', 'clinic.district.province', 'clinic.facilityType'])
                          .where('id', e.id)
                          .first()
    },
    loadStockList () {
      if (this.currStockEntrance.stocks.length > 0) {
        Object.keys(this.currStockEntrance.stocks).forEach(function (k) {
          const stock = Stock.query()
                                   .with('clinic.province')
                                   .with('entrance.clinic.province')
                                   .with('center.clinic.province')
                                   .with('packagedDrugs')
                                   .with('adjustments')
                                   .with('drug.form')
                                   .where('id', this.currStockEntrance.stocks[k].id)
                                   .first()
          stock.auxExpireDate = this.getDDMMYYYFromJSDate(stock.expireDate)
          this.stockList.push(stock)
        }.bind(this))
      }
    }
  },
  created () {
      this.drugs = this.activeDrugs
    console.log(this.drugs)
  },
  mounted () {
    this.init()
    this.loadStockList()
  },
  computed: {
    currStockEntrance () {
      return this.getCurrStockEntrance()
    },
    activeDrugs () {
      return Drug.query().with('form').where('active', true).get()
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
    isGuiaDeletionStep () {
      return this.guiaStep === 'delete'
    },
    isGuiaEditionStep () {
      return this.guiaStep === 'edit'
    },
    isGuiaDisplayStep () {
      return this.guiaStep === 'display'
    },
    stockCenter () {
      return StockCenter.query()
                        .with(['clinic.province', 'clinic.district.province', 'clinic.facilityType'])
                        .first()
    },
    currClinic () {
        return Clinic.query()
                    .with('province')
                    .with('facilityType')
                    .with('district.province')
                    .where('id', SessionStorage.getItem('currClinic').id)
                    .first()
      }
  },
  components: {
    Dialog: require('components/Shared/Dialog/Dialog.vue').default,
    TitleBar: require('components/Shared/TitleBar.vue').default,
    ListHeader: require('components/Shared/ListHeader.vue').default,
    TextInput: require('components/Shared/Input/TextField.vue').default
  }
}
</script>

<style lang="scss">
  .box-border {
    border: 1px solid $grey-4
  }
</style>
