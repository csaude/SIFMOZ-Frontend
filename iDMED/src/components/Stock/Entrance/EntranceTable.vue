<template>
  <div>
        <q-table
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
                  {{props.row.orderNumber}}
                </q-td>
                <q-td key="dateReceived" :props="props">
                  {{formatDate(props.row.dateReceived)}}
                </q-td>
                <q-td key="options" :props="props">
                  <div class="col">
                    <q-btn flat round
                    color="amber-8"
                    icon="edit"
                    @click="editStockEntrance(props.row)">
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
import { date, SessionStorage } from 'quasar'
import StockEntrance from '../../../store/models/stockentrance/StockEntrance'
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
  methods: {
    formatDate (dateString) {
      return date.formatDate(dateString, 'DD-MM-YYYY')
    },
    editStockEntrance (currStockEntrance) {
      SessionStorage.set('currStockEntrance', currStockEntrance)
      this.$router.push('/stock/entrance')
    }
  },
  computed: {
    stockEntrances () {
      return StockEntrance.query().withAll().get()
    }
  }
}
</script>

<style>

</style>
