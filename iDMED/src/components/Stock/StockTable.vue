<template>
  <div>
    <q-table
            class="col"
            dense
            :rows="drugs"
            :columns="columns"
            :filter="filter"
            row-key="id"
            >
            <template v-slot:top-right>
              <q-input
                outlined
                dense
                style="width: 400px"
                debounce="300"
                v-model="filter"
                placeholder="Pesquisar">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>
            <template v-slot:no-data="{ icon, filter }">
              <div class="full-width row flex-center text-primary q-gutter-sm text-body2">
                <span>
                  Sem resultados para visualizar
                </span>
                <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
              </div>
            </template>
            <template #header="props">
                  <q-tr class="text-left bg-grey-3"  :props="props">
                    <q-th style="width: 70px"  >{{columns[0].label}}</q-th>
                    <q-th class="col" >{{columns[1].label}}</q-th>
                    <q-th class="text-center" style="width: 190px" >{{columns[2].label}}</q-th>
                    <q-th class="text-center" style="width: 190px" >{{columns[3].label}}</q-th>
                    <q-th class="text-center" style="width: 190px" >{{columns[4].label}}</q-th>
                    <q-th class="text-center" style="width: 110px" >{{columns[5].label}}</q-th>
                  </q-tr>
            </template>
            <template #body="props">
              <q-tr :props="props">
                <q-td key="order" :props="props">
                </q-td>
                <q-td key="drug" :props="props">
                  {{props.row.name}}
                </q-td>
                <q-td key="consumeAVG" :props="props">
                  {{props.row.getMonthAVGConsuption()}}
                </q-td>
                <q-td key="currUnits" :props="props">
                  {{props.row.getCurStockAmount()}}
                </q-td>
                <q-td key="state" :props="props">
                  <q-chip color="primary" text-color="white">
                    {{props.row.getConsuptionState()}}
                  </q-chip>
                </q-td>
                <q-td key="options" :props="props">
                  <div class="col">
                    <q-btn flat round
                    color="primary"
                    icon="description"
                    @click="openDrugFile(props.row)">
                    <q-tooltip class="bg-primary">Visualizar Ficha</q-tooltip>
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
import Drug from '../../store/models/drug/Drug'
import { ref } from 'vue'
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
      filter: ref(''),
      columns
    }
  },
  methods: {
    openDrugFile (drug) {
      SessionStorage.set('selectedDrug', drug)
      this.$router.push('/stock/drugFile')
    }
  },
  computed: {
    stockList () {
      return []
    },
    drugs: {
      get () {
        console.log('getDrugs')
        return Drug.query()
                 .with('stocks')
                 .with('packaged_drugs.pack', (query) => {
                        query.where((pack) => {
                          return pack.pickupDate >= date.subtractFromDate(new Date(), { months: 3 })
                        })
                      })
                 .orderBy('name')
                 .get()
      }
    }
  }
}
</script>

<style>

</style>
