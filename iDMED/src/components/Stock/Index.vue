<template>
  <div>
    <TitleBar>Gestão de Stock</TitleBar>
    <div class="q-px-xl q-mx-xl q-mt-md">
      <q-tabs
        v-model="tab"
        align="left"
        dense
        inline-label
        class=""
      >
        <q-tab name="stock" label="Stock" />
        <q-tab name="entrance"  label="Entrada" />
        <q-tab name="inventory" label="Inventário" />
      </q-tabs>
      <q-separator color="grey-13" size="1px"/>
      <div class="q-mt-md">
        <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="stock">
              <StockTable />
            </q-tab-panel>
            <q-tab-panel name="entrance">
                <EntranceTable />
            </q-tab-panel>
            <q-tab-panel name="inventory">
              <InventoryTable />
            </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
    <q-page-sticky v-if="tab !== 'stock'" position="bottom-right" :offset="[18, 18]">
        <q-btn class="q-mb-xl q-mr-xl" fab color="primary" icon="add" @click="add"/>
    </q-page-sticky>
    <q-dialog persistent v-model="createEntrance">
        <EntranceRegister
          @close="createEntrance = false" />
    </q-dialog>
    <q-dialog persistent v-model="createInventory">
        <InventoryRegister
          @close="createInventory = false" />
    </q-dialog>
  </div>
</template>

<script>
import { ref } from 'vue'
import StockEntrance from '../../store/models/stockentrance/StockEntrance'

export default {
  data () {
    return {
      tab: ref('stock'),
      createEntrance: false,
      createInventory: false
    }
  },
  methods: {
    add () {
      if (this.tab === 'entrance') {
        this.createEntrance = true
      } else {
        this.createInventory = true
      }
    },
    getAllStockOfClinic () {
      const offset = 0
      const max = 100
      this.doStockEntranceGet(this.clinic.id, offset, max)
    },
    doStockEntranceGet (clinicId, offset, max) {
      StockEntrance.apiGetAllByClinicId(clinicId, offset, max).then(resp => {
        console.log(resp.response.data)
            if (resp.response.data.length > 0) {
              offset = offset + max
              setTimeout(this.doStockEntranceGet(clinicId, offset, max), 2)
            }
        }).catch(error => {
            console.log(error)
        })
    }
  },
  components: {
    TitleBar: require('components/Shared/TitleBar.vue').default,
    StockTable: require('components/Stock/StockTable.vue').default,
    EntranceRegister: require('components/Stock/Entrance/EntranceRegister.vue').default,
    EntranceTable: require('components/Stock/Entrance/EntranceTable.vue').default,
    InventoryTable: require('components/Stock/Inventory/InventoryTable.vue').default,
    InventoryRegister: require('components/Stock/Inventory/InventoryRegister.vue').default
  }

}
</script>

<style>

</style>
