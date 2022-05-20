<template>
  <div>
    <TitleBar>Relatórios</TitleBar>
    <q-tabs
      v-model="tab"
      dense
      class="text-grey q-pt-md q-pl-md"
      active-color="primary"
      indicator-color="white"
      align="left"
    >
      <q-tab name="list" label="Listas" :class='tab === "list" ? "tab-menu" : ""'/>
      <q-tab name="graph" label="Análise Gráfica" :class='tab === "graph" ? "tab-menu" : ""' />
    </q-tabs>
    <q-separator style="margin-top: -1px"/>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="list">

        <div class="row">
          <div class="col-3   q-ml-sm q-mr-sm">
              <q-bar dark class="bg-primary text-white">
                  <div class="col text-center text-weight-bold">
                   Listagens
                  </div>
            </q-bar>
          </div>
          <div class="col q-mr-sm">
                   <q-bar dark class="bg-primary text-white">
                  <div class="col text-center text-weight-bold">
                   Resultados
                  </div>
            </q-bar>
          </div>
        </div>

        <div class="row">
          <div class="col-3  q-ml-sm q-mr-sm panel">
            <ListReportMenu
              @changeTab="changeTab"
            />

          </div>
          <div class="col q-mr-sm panel q-pa-sm">
              <!-- <div
              v-if="selectedService!=null"
              class="vertical-middle"
              >
                <q-banner rounded class="bg-orange-1 text-left text-orange-10">
                  Nenhum relatório foi seleccionado.
                </q-banner>
              </div> -->
        <template v-for="comp in components"
         :key="comp.id"
         >
            <component
              :is="comp.name"
              :selectedService="comp.clinicalService"
              :id="comp.id"
               :params="comp.params"
              class="q-mb-sm"
              />
        </template>
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
// import { uuid } from 'uuid'
import { uid, LocalStorage } from 'quasar'
import ClinicalService from '../../store/models/ClinicalService/ClinicalService'
export default {

  setup () {
    return {
      tab: ref('list'),
      model: ref(null),
      activeTab: ref(''),
      selectedService: null
      // params: null
    }
  },
  data () {
    return {
      components: []
    }
  },
  components: {
     TitleBar: require('components/Shared/TitleBar.vue').default,
     ActivesInDrugStore: require('components/Reports/Patient/ActivesInDrugStore.vue').default,
     GuestList: require('components/Reports/Patient/GuestList.vue').default,
     ImportedPatientList: require('components/Reports/Patient/ImportedPatientList.vue').default,
     TransferedFrom: require('components/Reports/Patient/TransferedFrom.vue').default,
     TransferedTo: require('components/Reports/Patient/TransferedTo.vue').default,
     ListReportMenu: require('components/Reports/Menus/ListReportMenu.vue').default,
     Mmia: require('components/Reports/ClinicManagement/Mmia.vue').default,
     ReferredPatients: require('components/Reports/ReferralManagement/ReferredPatients.vue').default,
     ReferredBackPatients: require('components/Reports/ReferralManagement/ReferredBackPatients.vue').default,
     ReferredPatientDispenseHistory: require('components/Reports/ReferralManagement/ReferredPatientDispenseHistory.vue').default,
      AbsentReferredPatients: require('components/Reports/ReferralManagement/AbsentReferredPatients.vue').default,
     ReceivedStock: require('components/Reports/stock/ReceivedStock.vue').default,
     UsedStock: require('components/Reports/stock/UsedStock.vue').default,
     ArvDailyRegister: require('components/Reports/monitoring/ArvDailyRegister.vue').default,
     AbsentPatients: require('components/Reports/ClinicManagement/AbsentPatients.vue').default
    },
     mounted () {
     const array = LocalStorage.getAllKeys()
     for (let index = 0; index < array.length; index++) {
            // Regular expression to check if string is a valid UUID
      const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi
     // check if is uuid
        if (regexExp.test(array[index])) {
      console.log(LocalStorage.getItem(index))
       const item = LocalStorage.getItem(array[index])
        this.selectedService = ClinicalService.query()
                                        .where('id', item.clinicalService)
                                        .first()
      this.changeTab(item.tabName, this.selectedService, item)
        }
 }
  },
    methods: {
   changeTab (tabName, selectedService, params) {
        const uidValue = uid()
        console.log(uidValue)
        const comp = { id: params === undefined ? uidValue : params.id, name: tabName, clinicalService: selectedService, params: params }
        this.components.push(comp)
        }
    }
}
</script>

<style lang="scss">
  .panel {
    border: 1px solid $grey-13;
    border-radius: 0px
  }
  .tab-menu {
    border-top: 1px solid $grey-13;
    border-left: 1px solid $grey-13;
    border-right: 1px solid $grey-13;
    border-radius: 0px
  }
</style>
