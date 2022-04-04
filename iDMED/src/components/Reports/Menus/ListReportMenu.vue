<template>
  <div>
    <q-select
      class="q-ma-sm"
      dense outlined filled
      ref="clinicalService"
      v-model="selectedService"
      :options="clinicalServices"
      option-value="id"
      option-label="code"
      label="Serviço de Saúde" />
    <q-separator  />

    <div class="q-pa-md" style="max-width: 1000px">
      <q-list bordered v-if="selectedService !== null">
        <q-expansion-item
          group="somegroup"
          label="Pacientes"
          header-class="bg-green-1 text-black"
          expand-icon-class="text-black"
        >
          <q-card class="bg-white">
            <div class="q-pa-sm no-margin no-padding full-height" style="max-width: 1000px">
                <q-list bordered separator>
                  <q-item clickable v-ripple :active="true" class="bg-orange-1 q-ma-sm text-black" @click="changeTab('ActivesInDrugStore')">
                    <q-item-section>Activos na Farmácia</q-item-section>
                  </q-item>
                  <q-item clickable v-ripple :active="false" class="bg-orange-1 q-ma-sm text-black" @click="changeTab('TransferedTo')">
                    <q-item-section>Lista de transferidos PARA</q-item-section>
                  </q-item>
                  <q-item clickable v-ripple :active="true" class="bg-orange-1  q-ma-sm text-black" @click="changeTab('TransferedFrom')">
                    <q-item-section>Lista de transferidos DE</q-item-section>
                  </q-item>

                  <q-item clickable v-ripple :active="true" class="bg-orange-1  q-ma-sm text-black" @click="changeTab('GuestList')">
                    <q-item-section>Lista de Visitantes</q-item-section>
                  </q-item>

                  <q-item clickable v-ripple :active="true" class="bg-orange-1  q-ma-sm text-black" @click="changeTab('ImportedPatientList')">
                    <q-item-section>Lista de pacientes importados de outros Sistemas</q-item-section>
                  </q-item>
                </q-list>
              </div>
          </q-card>
        </q-expansion-item>
      </q-list>
      <div v-else class="vertical-middle">
            <q-banner rounded class="bg-orange-1 text-left text-orange-10">
              Nenhum Serviço de Saúde foi Seleccionado!.
            </q-banner>
          </div>
    </div>
  </div>
</template>

<script>
import ClinicalService from '../../../store/models/ClinicalService/ClinicalService'
export default {
  data () {
    return {
      currTab: '',
      selectedService: null
      }
  },
  methods: {
    changeTab (tabName) {
      this.currTab = tabName
      this.$emit('changeTab', tabName, this.selectedService)
    }
  },
  computed: {
    clinicalServices: {
      get () {
        return ClinicalService.all()
      }
    }
  }
}
</script>

<style>

</style>
