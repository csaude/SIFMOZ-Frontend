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
                      <TextInput v-model="stockEntrance.orderNumber" label="Número *" dense class="col" />
                      <q-input
                          dense
                          outlined
                          class="col q-ml-md"
                          v-model="dateReceived"
                          mask="date"
                          ref="birthDate"
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
                <q-btn type="submit" label="Submeter" color="primary" />
            </q-card-actions>
        </form>
    </q-card>
</template>

<script>
import { SessionStorage } from 'quasar'
import StockEntrance from '../../../store/models/stockentrance/StockEntrance'
export default {
  data () {
    return {
      dateReceived: '',
      stockEntrance: new StockEntrance()
    }
  },
  components: {
    TextInput: require('components/Shared/Input/TextField.vue').default
  },
  methods: {
    submitForm () {
      SessionStorage.set('currStockEntrance', this.stockEntrance)
      this.$router.push('/stock/entrance')
    }
  }
}
</script>

<style>

</style>
