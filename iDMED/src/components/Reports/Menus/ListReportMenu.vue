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
                   v-for="item in menu.menuItem"
                   :key="item.id"
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
                           { description: 'Activos na Farmácia', tabName: 'ActivesInDrugStore', id: '1' },
                           { description: 'Lista de transferidos PARA', tabName: 'TransferedTo', id: '2' },
                           { description: 'Lista de transferidos DE', tabName: 'TransferedFrom', id: '3' },
                           { description: 'Lista de Visitantes', tabName: 'GuestList', id: '4' },
                           { description: 'Lista de pacientes importados de outros Sistemas', tabName: 'ImportedPatientList', id: '5' }
                          ]
                },
                {
                description: 'Gestão de Farmácia',
                id: 2,
                menuItem: [
                           { description: 'Submenu 12', tabName: 'ActivesInDrugStore', id: '6' },
                           { description: 'Lista de transferidos PARA', tabName: 'TransferedTo', id: '7' },
                           { description: 'Lista de transferidos DE', tabName: 'TransferedFrom', id: '8' },
                           { description: 'Lista de Visitantes', tabName: 'GuestList', id: '9' },
                           { description: 'Lista de pacientes importados de outros Sistemas', tabName: 'ImportedPatientList', id: '10' }
                          ]
                },
                {
                description: 'Referências',
                id: 3,
                menuItem: [
                           { description: ' Exemplo 1', tabName: 'ActivesInDrugStore', id: '11' },
                           { description: 'Exemplo 2', tabName: 'TransferedTo', id: '12' },
                           { description: 'Exemplo 3', tabName: 'TransferedFrom', id: '13' },
                           { description: 'Lista de Visitantes', tabName: 'GuestList', id: '14' },
                           { description: 'Lista de pacientes importados de outros Sistemas', tabName: 'ImportedPatientList', id: '15' }
                          ]
                },
               {
                description: 'Stock',
                id: 4,
                menuItem: [
                           { description: 'Submenu 1', tabName: 'ActivesInDrugStore', id: '16' },
                           { description: 'Lista de transferidos PARA', tabName: 'TransferedTo', id: '17' },
                           { description: 'Lista de transferidos DE', tabName: 'TransferedFrom', id: '18' },
                           { description: 'Lista de Visitantes', tabName: 'GuestList', id: '19' },
                           { description: 'Lista de pacientes importados de outros Sistemas', tabName: 'ImportedPatientList', id: '20' }
                          ]
                },
                {
                description: 'Monitoria e Avaliação',
                id: 5,
                menuItem: [
                           { description: 'Submenu 2', tabName: 'ActivesInDrugStore', id: '21' },
                           { description: 'Lista de transferidos PARA', tabName: 'TransferedTo', id: '22' },
                           { description: 'Lista de transferidos DE', tabName: 'TransferedFrom', id: '23' },
                           { description: 'Lista de Visitantes', tabName: 'GuestList', id: '24' },
                           { description: 'Lista de pacientes importados de outros Sistemas', tabName: 'ImportedPatientList', id: '25' }
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
