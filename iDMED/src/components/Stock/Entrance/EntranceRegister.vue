<template>
  <q-card style="width: 800px; max-width: 90vw;" class="q-pt-lg">
        <form @submit.prevent="submitForm" >
            <q-card-section class="q-px-md">
                <div class="q-mt-lg">
                    <div class="row items-center q-mb-md">
                        <q-icon name="subject" size="sm"/>
                        <span class="q-pl-sm text-subtitle2">Dados da Guia</span>
                    </div>
                    <q-separator color="grey-13" size="1px"/>
                </div>
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
                          mask="date"
                          ref="dateReceived"
                          :rules="['date']"
                          label="Data de Criação *">
                          <template v-slot:append>
                              <q-icon name="event" class="cursor-pointer">
                              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                  <q-date v-model="dateReceived" >
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
                <q-btn type="submit" label="Avançar" color="primary" />
            </q-card-actions>
        </form>
    </q-card>
</template>

<script>
import { date, SessionStorage } from 'quasar'
import StockEntrance from '../../../store/models/stockentrance/StockEntrance'
import Clinic from '../../../store/models/clinic/Clinic'
export default {
  data () {
    return {
      stockEntrance: new StockEntrance()
    }
  },
  components: {
    TextInput: require('components/Shared/Input/TextField.vue').default
  },
  methods: {
    formatDate (dateString) {
      return date.formatDate(dateString, 'YYYY-MM-DD')
    },
    async submitForm () {
      this.$refs.dateReceived.validate()
      this.$refs.orderNumber.$refs.ref.validate()
      if (!this.$refs.orderNumber.$refs.ref.hasError) {
        this.stockEntrance.clinic = this.currClinic
        await StockEntrance.apiSave(this.stockEntrance).then(resp => {
        SessionStorage.set('currStockEntrance', resp.response.data)
        this.$router.push('/stock/entrance')
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
  },
  computed: {
    dateReceived: {
      get () {
        return this.formatDate(this.stockEntrance.dateReceived)
      },
      set (value) {
        this.stockEntrance.dateReceived = new Date(value)
      }
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
