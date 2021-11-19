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
            @blur="determineNextPickUpDate()"
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
    props: ['addVisible', 'bgColor', 'mainContainer', 'visitDetails', 'newPickUpDate', 'duration'],
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
      tryToDetermineDefaultTakePeriod () {
        if (this.duration !== null) {
          this.drugsDuration = this.duration
          this.determineNextPickUpDate()
        }
      },
      expand () {
        this.expanded = !this.expanded
        this.$emit('expandLess', this.expanded)
      },
      showAdd () {
        // this.$refs.pickupDate.validate()
        // this.$refs.nextPickupDate.validate()
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
        } else if (this.newPickUpDate !== '' && (new Date(this.pickupDate) < this.newPickUpDate)) {
          this.displayAlert('error', 'A data de levantamento não pode ser anterior a ' + this.formatDate(this.newPickUpDate) + ', pois na data indicada o paciente ainda possui medicamntos da dispensa anterior.')
        } else {
          this.$emit('showAdd', this.pickupDate, this.nextPDate, this.drugsDuration)
        }
      },
      determineNextPickUpDate () {
        if (date.isValid(this.pickupDate) && this.drugsDuration !== '') {
          const newDate = new Date(this.pickupDate)
          let lostDays = parseInt((this.drugsDuration.weeks / 4) * 2)
          if (this.drugsDuration.weeks <= 1) lostDays = 0
          const daysToAdd = parseInt((this.drugsDuration.weeks * 7) + lostDays)
          this.nextPDate = this.formatDate(date.addToDate(newDate, { days: daysToAdd }))
          this.$emit('updateQtyPrescribed', this.drugsDuration, this.pickupDate, this.nextPDate)
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
      },
      init () {
        if (this.newPickUpDate !== '') {
          this.pickupDate = this.newPickUpDate
          this.tryToDetermineDefaultTakePeriod()
        }
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
    },
    mounted () {
      this.init()
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
