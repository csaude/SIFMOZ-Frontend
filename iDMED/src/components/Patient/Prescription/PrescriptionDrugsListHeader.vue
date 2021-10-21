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
              label-color="white"
              class="col q-ma-sm"
              v-model="curVisitDetails.pack.pickupDate"
              mask="date"
              :rules="['date']"
              ref="pickupDate"
              label="Data de Levantamento">
              <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer" color="white">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="curVisitDetails.pack.pickupDate" >
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
    </q-banner>
</template>

<script>
import { ref } from 'vue'
export default {
    props: ['addVisible', 'bgColor', 'mainContainer', 'visitDetails'],
    setup () {
      return {
        headerClass: '',
        expanded: ref(false),
        curVisitDetails: '',
        date: ''
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
        this.$refs.pickupDate.validate()
        if (!this.$refs.pickupDate.hasError) {
            this.$emit('showAdd', this.curVisitDetails.pack.pickupDate)
        }
      }
    },
    components: {
    },
    created () {
      this.determineHeaderClass()
      this.curVisitDetails = Object.assign({}, this.visitDetails)
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
