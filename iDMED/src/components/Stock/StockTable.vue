<template>
  <div>
    <q-table
            class="col"
            dense
            :rows="stockList"
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
                <q-td key="drug" :props="props">
                  {{props.row.drug.name}}
                </q-td>
                <q-td key="consumeAVG" :props="props">
                  {{props.row.getConsumeAVG()}}
                </q-td>
                <q-td key="currUnits" :props="props">
                  {{props.row.stockMoviment}}
                </q-td>
                <q-td key="state" :props="props">
                  {{props.row.getState()}}
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
  { name: 'drug', align: 'left', label: 'Medicamento', sortable: true },
  { name: 'consumeAVG', align: 'center', label: 'Média de Consumo Mensal', sortable: false },
  { name: 'currUnits', align: 'center', label: 'Saldo Actual', sortable: true },
  { name: 'state', align: 'center', label: 'Estado', sortable: true },
  { name: 'options', align: 'center', label: 'Opções', sortable: false }
]
export default {
  data () {
    return {
      columns
    }
  },
  computed: {
    stockList () {
      return []
    }
  }
}
</script>

<style>

</style>
