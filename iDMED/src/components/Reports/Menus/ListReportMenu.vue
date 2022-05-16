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
          v-for="menu in menu"
          :key="menu.id"
          group="somegroup"
          :label="menu.description"
          header-class="bg-green-1 text-black"
          expand-icon-class="text-black"
          class="q-ma-sm "
        >
          <q-card class="bg-white">
            <div class="q-pa-sm no-margin no-padding full-height" style="max-width: 1000px">
                <q-list bordered separator>
                  <q-item
                   v-for="(item, index) in menu.menuItem"
                   :key="index"
                   clickable v-ripple :active="true"
                   class="bg-orange-1 q-ma-sm text-black"
                   @click="changeTab(item.tabName)" >
                    <q-item-section> {{ item.description }} </q-item-section>
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
      selectedService: null,
      menu: [
              {
                description: 'Pacientes',
                id: 1,
                menuItem: [
                           { description: 'Activos na Farmácia', tabName: 'ActivesInDrugStore' },
                           { description: 'Lista de transferidos PARA', tabName: 'TransferedTo' },
                           { description: 'Lista de transferidos DE', tabName: 'TransferedFrom' },
                           { description: 'Lista de Visitantes', tabName: 'GuestList' },
                           { description: 'Lista de pacientes importados de outros Sistemas', tabName: 'ImportedPatientList' }
                          ]
                },
                {
                description: 'Gestão de Farmácia',
                id: 2,
                menuItem: [
                           { description: 'Submenu 12', tabName: 'ActivesInDrugStore' },
                           { description: 'Mapa Mensal de Informação de ARV (MMIA)', tabName: 'Mmia' },
                           { description: 'Lista de transferidos DE', tabName: 'TransferedFrom' },
                           { description: 'Lista de Visitantes', tabName: 'GuestList' },
                           { description: 'Lista de pacientes importados de outros Sistemas', tabName: 'ImportedPatientList' }
                          ]
                },
                {
                description: 'Referências',
                id: 3,
                menuItem: [
                           { description: 'Lista de Pacientes Referidos Para outras Farmacias', tabName: 'ReferredPatients' },
                           { description: 'Lista de Pacientes que voltaram da Referencia', tabName: 'ReferredBackPatients' },
                           { description: 'Lista de Pacientes referidos faltosos em outras Farmacias', tabName: 'AbsentReferredPatients' },
                           { description: 'Historico de Levantamentos de Pacientes Referidos', tabName: 'ReferredPatientDispenseHistory' }
                          ]
                },
               {
                description: 'Stock',
                id: 4,
                menuItem: [
                           { description: 'Submenu 1', tabName: 'ActivesInDrugStore' },
                           { description: 'Lista de transferidos PARA', tabName: 'TransferedTo' },
                           { description: 'Lista de transferidos DE', tabName: 'TransferedFrom' },
                           { description: 'Lista de Visitantes', tabName: 'GuestList' },
                           { description: 'Lista de pacientes importados de outros Sistemas', tabName: 'ImportedPatientList' }
                          ]
                },
                {
                description: 'Monitoria e Avaliação',
                id: 5,
                menuItem: [
                           { description: 'Submenu 2', tabName: 'ActivesInDrugStore' },
                           { description: 'Lista de transferidos PARA', tabName: 'TransferedTo' },
                           { description: 'Lista de transferidos DE', tabName: 'TransferedFrom' },
                           { description: 'Lista de Visitantes', tabName: 'GuestList' },
                           { description: 'Lista de pacientes importados de outros Sistemas', tabName: 'ImportedPatientList' }
                          ]
                }

            ]
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
