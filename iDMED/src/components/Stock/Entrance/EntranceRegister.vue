<template>
  <q-card style="width: 800px; max-width: 90vw;" class="">
        <div class="q-pt-lg bg-green-2">
            <div class="row items-center q-mb-md q-ml-md">
                <q-icon name="subject" size="sm"/>
                <span class="q-pl-sm text-subtitle1">Dados da Guia</span>
            </div>
            <q-separator color="grey-13" size="1px"/>
        </div>
        <form @submit.prevent="submitForm" >
            <q-card-section class="q-px-md">
                <div class="q-mt-md">
                    <div class="row">
                      <TextInput
                        v-model="stockEntrance.orderNumber"
                        label="Número *"
                        ref="orderNumber"
                        :rules="[ val => !!val || 'Por favor indicar o número da guia']"
                        dense class="col" />
                      <q-input
                          dense
                          outlined
                          class="col q-ml-md"
                          v-model="dateReceived"
                          label="Data de Criação *">
                          <template v-slot:append>
                              <q-icon name="event" class="cursor-pointer">
                              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                  <q-date v-model="dateReceived" mask="DD-MM-YYYY" >
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
            </q-card-section>
           <q-card-actions align="right" class="q-mb-md q-mr-sm">
                <q-btn label="Cancelar" color="red" @click="$emit('close')"/>
                <q-btn type="submit" label="Avançar" color="primary"  />
            </q-card-actions>
        </form>
        <q-dialog v-model="alert.visible" persistent>
          <Dialog :type="alert.type" @closeDialog="closeDialog" @commitOperation="doRemove">
            <template v-slot:title> Informação</template>
            <template v-slot:msg> {{alert.msg}} </template>
          </Dialog>
        </q-dialog>
    </q-card>
</template>

<script>
import { QSpinnerBall, useQuasar, date, SessionStorage } from 'quasar'
import StockEntrance from '../../../store/models/stockentrance/StockEntrance'
import Clinic from '../../../store/models/clinic/Clinic'
import moment from 'moment'
import { ref } from 'vue'
export default {
  data () {
    return {
      alert: ref({
        type: '',
        visible: false,
        msg: ''
      }),
      $q: useQuasar(),
      stockEntrance: new StockEntrance({
        dateReceived: new Date()
      }),
      dateReceived: this.getDDMMYYYFromJSDate(new Date())
    }
  },
  components: {
    Dialog: require('components/Shared/Dialog/Dialog.vue').default,
    TextInput: require('components/Shared/Input/TextField.vue').default
  },
  methods: {
    getJSDateFromDDMMYYY (dateString) {
      const dateParts = dateString.split('-')
      return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0])
    },
    getDDMMYYYFromJSDate (jsDate) {
      return moment(jsDate).format('DD-MM-YYYY')
    },
    formatDate (dateString) {
      return date.formatDate(dateString, 'YYYY-MM-DD')
    },
    showloading () {
       this.$q.loading.show({
          spinner: QSpinnerBall,
          spinnerColor: 'gray',
          spinnerSize: 140,
          message: 'Processando, aguarde por favor...',
          messageColor: 'white'
        })
    },
    hideLoading () {
      this.$q.loading.hide()
    },
    displayAlert (type, msg) {
      this.alert.type = type
      this.alert.msg = msg
      this.alert.visible = true
    },
    closeDialog () {
      this.alert.visible = false
    },
    async submitForm () {
      this.submitting = true
      this.stockEntrance.dateReceived = this.getJSDateFromDDMMYYY(this.dateReceived)
      if (this.stockEntrance.dateReceived > new Date()) {
        this.displayAlert('error', 'A data de criação da guia não pode ser superior a data corrente.')
      } else {
        this.$refs.orderNumber.$refs.ref.validate()
        if (!this.$refs.orderNumber.$refs.ref.hasError) {
          this.showloading()
          this.stockEntrance.clinic = this.currClinic
          await StockEntrance.apiSave(this.stockEntrance).then(resp => {
          SessionStorage.set('currStockEntrance', resp.response.data)
          this.hideLoading()
          this.$router.push('/stock/entrance')
          this.$emit('close')
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
      }
    }
  },
  computed: {
    currClinic () {
      return Clinic.query()
                  .with('province')
                  .with('facilityType')
                  .with('district.province')
                  .where('id', SessionStorage.getItem('currClinic').id)
                  .first()
    }
  }
}
</script>

<style>

</style>
