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
          <div class="col-3 q-pa-md q-pl-lg q-ml-lg q-mr-lg panel">
          </div>
          <div class="col q-mr-lg panel">
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
      tab: ref('list')
    }
  },
  components: {
    TitleBar: require('components/Shared/TitleBar.vue').default
  }
}
</script>

<style lang="scss">
  .panel {
    border: 1px solid $grey-13;
    border-radius: 3px
  }
</style>
