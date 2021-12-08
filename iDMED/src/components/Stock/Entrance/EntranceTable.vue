<template>
  <div> <q-table
            class="col"
            dense
            :rows="stockEntrances"
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
                <q-td key="orderNumber" :props="props">
                  {{props.row.drug.orderNumber}}
                </q-td>
                <q-td key="dateReceived" :props="props">
                  {{props.row.dateReceived}}
                </q-td>
                <q-td key="options" :props="props">
                  <div class="col">
                    <q-btn flat round
                    color="amber-8"
                    icon="edit"
                    @click="editPatient(props.row)">
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
const columns = [
  { name: 'order', required: true, label: 'Ordem', align: 'left', sortable: false },
  { name: 'orderNumber', align: 'left', label: 'Nr. de Guia', sortable: true },
  { name: 'dateReceived', align: 'left', label: 'Data de Entrada', sortable: false },
  { name: 'options', align: 'center', label: 'Opções', sortable: false }
]
export default {
  data () {
    return {
      columns
    }
  },
  computed: {
    stockEntrances () {
      return []
    }
  }
}
</script>

<style>

</style>
