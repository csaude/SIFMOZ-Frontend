<template>
  <div>
    <ListHeader :canEdit="true" :addVisible="false" bgColor="bg-grey-4" >Data de Levantamento: {{formatDate(currPack.pickupDate)}} </ListHeader>
    <q-card flat bordered class="noRadius">
      <q-card-section class="row q-pa-sm">
        <div class="col-12">
          <q-table
            class="col"
            dense
            unelevated
            :rows="packagedDrugs"
            :columns="columns"
            row-key="id"
            >
            <template #body="props">
              <q-tr no-hover :props="props">
                <q-td key="drug" :props="props">
                  {{props.row.drug.name}}
                </q-td>
                <q-td key="qty" :props="props">
                  {{props.row.quantitySupplied}} Frasco(s)
                </q-td>
                <q-td auto-width key="nextPickUpDate" :props="props">
                  {{props.row.toContinue ? formatDate(currPack.nextPickUpDate) : 'Não continua'}}
                </q-td>
              </q-tr>
            </template>
        </q-table>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { date } from 'quasar'
import Pack from '../../../store/models/packaging/Pack'
const columns = [
  { name: 'drug', required: true, field: 'row.drug.name', label: 'Medicamento', align: 'left', sortable: true },
  { name: 'qty', align: 'left', field: 'row.quantitySupplied', label: 'Quantidade', sortable: true },
  { name: 'nextPickUpDate', align: 'left', field: 'row.nextPickUpDate', label: 'Próximo Levantamento', sortable: false }
]
export default {
  props: ['pack'],
  setup () {
    return {
      canEdit: true,
      columns
    }
  },
  methods: {
    formatDate (dateString) {
      return date.formatDate(dateString, 'DD-MM-YYYY')
    }
  },
  components: {
    ListHeader: require('components/Patient/Prescription/DispenseListHeader.vue').default
  },
  computed: {
    currPack () {
      return Pack.query().with('packagedDrugs.drug').where('id', this.pack.id).first()
    },
    packagedDrugs () {
      return this.currPack.packagedDrugs
    }
  }
}
</script>

<style>

</style>
