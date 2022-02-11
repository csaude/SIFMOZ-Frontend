<template>
  <div>
    <ListHeader
      :addVisible="true"
      :mainContainer="true"
      @showAdd="$emit('newPacking')"
      bgColor="bg-primary">Dispensas Efectuadas
    </ListHeader>
    <div class="q-mb-md box-border">
      <q-table
          class="col"
          dense
          flat
          :rows="grupPacks"
          :columns="columns"
          row-key="id"
          >
          <template v-slot:no-data="{ icon, filter }">
            <div class="full-width row flex-center text-primary q-gutter-sm text-body2">
              <span>
                Nenhuma dispensa efectuada
              </span>
              <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
            </div>
          </template>
          <template #body="props">
            <q-tr :props="props">
              <q-td key="order" :props="props">
              </q-td>
              <q-td key="id" :props="props">
              </q-td>
              <q-td key="lastDispenseDate" :props="props">
              </q-td>
              <q-td key="nextPickupDate" :props="props">
              </q-td>
              <q-td key="duration" :props="props">
              </q-td>
              <q-td key="pickUpDays" :props="props">
              </q-td>
              <q-td key="options" :props="props">
                <div class="col">
                  <q-btn flat round
                  color="red-8"
                  icon="group_remove"
                  @click="removePatient(props.row)">
                  <q-tooltip class="bg-red-5">Remover</q-tooltip>
                </q-btn>
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
const columns = [
  { name: 'order', align: 'left', label: 'Ordem', sortable: false },
  { name: 'lastDispenseDate', align: 'left', label: 'Data da Última Dispensa', sortable: false },
  { name: 'nextPickupDate', align: 'left', label: 'Data do Próximo Levantamento', sortable: false },
  { name: 'duration', align: 'left', label: 'Período Dispensado', sortable: false },
  { name: 'pickUpDays', align: 'left', label: 'Dias de Levantamento', sortable: false },
  { name: 'options', align: 'left', label: 'Opções', sortable: false }
]
export default {
  data () {
    return {
      grupPacks: ref([]),
      columns
    }
  },
  components: {
    ListHeader: require('components/Shared/ListHeader.vue').default
  }
}
</script>

<style>

</style>
