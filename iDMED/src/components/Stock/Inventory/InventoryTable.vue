<template>
  <div> <q-table
            class="col"
            dense
            :rows="inventories"
            :columns="columns"
            row-key="id"
            >
            <template v-slot:no-data="{ icon, filter }">
              <div class="full-width row flex-center text-primary q-gutter-sm text-body2">
                <span>
                  Sem resultados para visualizar
                </span>
                <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
              </div>
            </template>
            <template #body="props">
              <q-tr :props="props">
                <q-td key="order" :props="props">
                </q-td>
                <q-td key="generic" :props="props">
                  {{props.row.getInventoryType()}}
                </q-td>
                <q-td key="startDate" :props="props">
                  {{props.row.getFormatedStartDate()}}
                </q-td>
                <q-td key="endDate" :props="props">
                  {{props.row.getFormatedEndDate()}}
                </q-td>
                <q-td key="open" :props="props">
                  {{props.row.getInventoryStatus()}}
                </q-td>
                <q-td key="options" :props="props">
                  <div class="col">
                    <q-btn flat round
                    color="amber-8"
                    icon="edit"
                    @click="openFile(props.row)">
                    <q-tooltip class="bg-amber-5">Editar</q-tooltip>
                  </q-btn>
                  </div>
                </q-td>
              </q-tr>
            </template>
        </q-table>
  </div>
</template>

<script>
import { SessionStorage } from 'quasar'
import Inventory from '../../../store/models/stockinventory/Inventory'
const columns = [
  { name: 'order', required: true, label: 'Ordem', align: 'left', sortable: false },
  { name: 'generic', align: 'left', label: 'Tipo de Inventário', sortable: true },
  { name: 'startDate', align: 'center', label: 'Data de Abertura', sortable: false },
  { name: 'endDate', align: 'center', label: 'Data de Fecho', sortable: true },
  { name: 'open', align: 'center', label: 'Estado', sortable: true },
  { name: 'options', align: 'center', label: 'Opções', sortable: false }
]
export default {
  data () {
    return {
      columns
    }
  },
  methods: {
    openFile (inventory) {
      SessionStorage.set('currInventory', inventory)
      this.$router.push('/stock/inventory')
    }
  },
  computed: {
    inventories () {
      return Inventory.query().withAll().get()
    }
  }
}
</script>

<style>

</style>
