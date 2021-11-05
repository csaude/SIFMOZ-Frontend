<template>
   <q-banner
    dense
    inline-actions
    :class="[bgColor, headerClass]"
    class="text-white q-pa-none">
        <span class="text-bold text-subtitle1 vertical-middle q-pl-md"><slot></slot></span>
        <template v-slot:action class="items-center">
          <q-input
              dense
              outlined
              bg-color="white"
              style="margin:2px; width: 200px"
              v-model="pickupDate"
              @update:model-value="determineNextPickUpDate()"
              mask="date"
              ref="pickupDate"
              label="Data de Levantamento">
              <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="pickupDate" @update:model-value="determineNextPickUpDate()" >
                      <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                      </q-date>
                  </q-popup-proxy>
                  </q-icon>
              </template>
          </q-input>

          <q-select
            dense
            style="width: 200px"
            class="q-mx-sm"
            bg-color="white"
            @update:model-value="determineNextPickUpDate()"
            outlined
            v-model="drugsDuration"
            :options="durations"
            option-value="id"
            option-label="description"
            label="Dispensa para" />

          <q-input
            outlined dense
            v-model="nextPDate"
            label="Proximo Levantamento"
            bg-color="white"
            style="margin:2px; width: 200px"
            mask="date"
            ref="nextPickupDate">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="nextPDate">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <q-btn dense flat round color="white" :icon="expanded ? 'expand_less' : 'expand_more'" class="float-right" @click="expand"/>
          <q-btn dense v-if="addVisible" flat round color="white" icon="add" class="float-right q-mx-sm" @click="showAdd"/>
        </template>

        <q-dialog v-model="alert.visible">
          <Dialog :type="alert.type" @closeDialog="closeDialog">
            <template v-slot:title> Informação</template>
            <template v-slot:msg> {{alert.msg}} </template>
          </Dialog>
        </q-dialog>
    </q-banner>
</template>

<script>
import { ref } from 'vue'
import { date } from 'quasar'
import Duration from '../../../store/models/Duration/Duration'
export default {
    props: ['addVisible', 'bgColor', 'mainContainer', 'visitDetails'],
    data () {
      return {
        alert: ref({
          type: '',
          visible: false,
          msg: ''
        }),
        headerClass: '',
        expanded: ref(false),
        curVisitDetails: '',
        nextPDate: '',
        pickupDate: '',
        drugsDuration: ''
      }
    },
    methods: {
      determineHeaderClass () {
        if (this.mainContainer) {
          this.headerClass = 'list-header'
        } else {
          this.headerClass = ''
        }
      },
      expand () {
        this.expanded = !this.expanded
        this.$emit('expandLess', this.expanded)
      },
      showAdd () {
        // this.$refs.pickupDate.validate()
        // this.$refs.nextPickupDate.validate()
        console.log(this.nextPDate)
        if (!date.isValid(this.pickupDate)) {
          this.displayAlert('error', 'A data de levantamento é inválida')
        } else if (!date.isValid(this.nextPDate)) {
          this.displayAlert('error', 'A data do próximo levantamento é inválida')
        } else if (this.drugsDuration === '') {
          this.displayAlert('error', 'Por favor indicar a duração da medicação a dispensar.')
        } else if (new Date(this.pickupDate) < this.curVisitDetails.prescriptions[0].prescriptionDate) {
          this.displayAlert('error', 'A data de levantamento indicada é menor que a data da prescrição')
        } else if (new Date(this.pickupDate) > new Date()) {
          this.displayAlert('error', 'A data de levantamento indicada é maior que a data da corrente')
        } else if (new Date(this.pickupDate) > new Date(this.nextPDate)) {
          this.displayAlert('error', 'A data do levantamento é maior que a data do próximo levantamento')
        } else {
          this.$emit('showAdd', this.pickupDate, this.nextPDate)
        }
      },
      determineNextPickUpDate () {
        console.log(this.drugsDuration)
        if (date.isValid(this.pickupDate) && this.drugsDuration !== '') {
          const newDate = new Date(this.pickupDate)
          const daysToAdd = parseInt(this.drugsDuration.weeks * 7)
          this.nextPDate = this.formatDate(date.addToDate(newDate, { days: daysToAdd }))
          console.log(this.nextPDate)
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
      formatDate (dateString) {
        return date.formatDate(dateString, 'YYYY-MM-DD')
      }
    },
    components: {
      Dialog: require('components/Shared/Dialog/Dialog.vue').default
    },
    created () {
      this.determineHeaderClass()
      this.curVisitDetails = Object.assign({}, this.visitDetails)
    },
    computed: {
      durations () {
        return Duration.all()
      }
    }
}
</script>

<style scoped>
    .list-header {
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
    }
    .input-color {
      border: 1px solid white;
      border-radius: 5px;
      color: white;
    }
</style>
