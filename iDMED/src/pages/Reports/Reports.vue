<template>
  <div>
    <TitleBar>Relatórios</TitleBar>
    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="left"
      narrow-indicator
    >
      <q-tab name="list" label="Listas" />
      <q-tab name="graph" label="Análise Gráfica" />
    </q-tabs>
    <q-separator />
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="list">

        <div class="row">
          <div class="col-3   q-ml-sm q-mr-sm panel">
              <q-bar dark class="bg-primary text-white">
                  <div class="col text-center text-weight-bold">
                   Listagens
                  </div>
            </q-bar>
          </div>
          <div class="col q-mr-lg panel">
                   <q-bar dark class="bg-primary text-white">
                  <div class="col text-center text-weight-bold">
                   Resultados
                  </div>
            </q-bar>
          </div>
        </div>

        <div class="row">
          <div class="col-3  q-ml-sm q-mr-sm panel">
             <q-select square filled v-model="model" :options="options" label="Tipo de Serviço" class ="q-ma-sm" />
            <q-separator  />

        <div class="q-pa-md" style="max-width: 1000px">
        <q-list bordered>
          <q-expansion-item
            group="somegroup"
            label="Pacientes"
            header-class="bg-green-1 text-black"
            expand-icon-class="text-black"
          >
                      <q-card class="bg-white">
                          <div class="q-pa-sm no-margin no-padding full-height" style="max-width: 1000px">
                              <q-list bordered separator>
                                <q-item clickable v-ripple :active="true" class="bg-orange-1 q-ma-sm text-black" @click="activeTab = 'ActivesInDrugStore'">
                                  <q-item-section>Activos na Farmácia</q-item-section>
                                </q-item>
                                <q-item clickable v-ripple :active="false" class="bg-orange-1 q-ma-sm text-black" @click="activeTab = 'TransferedTo'">
                                  <q-item-section>Lista de transferidos PARA</q-item-section>
                                </q-item>
                                <q-item clickable v-ripple :active="true" class="bg-orange-1  q-ma-sm text-black" @click="activeTab = 'TransferedFrom'">
                                  <q-item-section>Lista de transferidos DE</q-item-section>
                                </q-item>

                                <q-item clickable v-ripple :active="true" class="bg-orange-1  q-ma-sm text-black" @click="activeTab = 'GuestList'">
                                  <q-item-section>Lista de Visitantes</q-item-section>
                                </q-item>

                                <q-item clickable v-ripple :active="true" class="bg-orange-1  q-ma-sm text-black" @click="activeTab = 'ImportedPatientList'">
                                  <q-item-section>Lista de pacientes importados de outros Sistemas</q-item-section>
                                </q-item>
                              </q-list>
                            </div>
                      </q-card>
                    </q-expansion-item>
                  </q-list>
                </div>

          </div>
          <div class="col q-mr-lg panel">
                <component :is="activeTab"/>
          </div>
        </div>
      </q-tab-panel>

      <q-tab-panel name="graph">
         <div class="row">
          <div class="col-3 q-pa-md q-pl-lg q-ml-lg q-mr-lg panel">
          </div>
          <div class="col q-mr-lg panel">
          </div>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import { ref } from 'vue'
export default {

  setup () {
    return {
      tab: ref('list'),
      model: ref(null),
      options: [
        'Serviço TARV', 'Serviço TPT'
      ]
    }
  },
  components: {
     TitleBar: require('components/Shared/TitleBar.vue').default,
     ActivesInDrugStore: require('components/Report/patient/ActivesInDrugStore.vue').default,
     GuestList: require('components/Report/patient/GuestList.vue').default,
     ImportedPatientList: require('components/Report/patient/ImportedPatientList.vue').default,
     TransferedFrom: require('components/Report/patient/TransferedFrom.vue').default,
     TransferedTo: require('components/Report/patient/TransferedTo.vue').default

    },
    data () {
      return {
        activeTab: 'ActivesInDrugStore'
      }
      },
    methods: {
      addReport () {
      }

    }
}
</script>

<style lang="scss">
  .panel {
    border: 1px solid $grey-13;
    border-radius: 3px
  }
</style>
