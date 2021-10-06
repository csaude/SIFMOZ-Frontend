<template>
  <div>
      <ListHeader
          :addVisible="true"
          :mainContainer="true"
          bgColor="bg-primary"
          @showAdd="$emit('addEditDrugs', visitDetails)">Medicamentos para {{visitDetails.episode.patientProgramIdentifier.clinicalService.description}}
      </ListHeader>
      <div class="col prescription-box q-pa-md q-mb-md">
        <q-table
            class="col"
            dense
            :rows="prescribedDrugs"
            :columns="columns"
            row-key="id"
            >
            <template #body="props">
              <q-tr :props="props">
                <q-td key="order" :props="props">
                  {{props.row.index}}
                </q-td>
                <q-td key="drug" :props="props">
                  {{props.row.drug.name}}
                </q-td>
                <q-td key="dosage" :props="props">
                  {{props.row.amtPerTime}}
                </q-td>
                <q-td key="packs" :props="props">
                  {{props.row.packs}}
                </q-td>
                <q-td key="nextPickUpDate" :props="props">

                </q-td>
                <q-td key="packs" :props="props">
                  <q-btn flat round
                    color="red"
                    icon="delete"
                    @click="deleteRow(props.row)"/>
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
  {
    name: 'order',
    required: true,
    label: 'Ordem',
    align: 'center',
    sortable: true
  },
  {
    name: 'drug',
    align: 'left',
    field: 'row.drug.name',
    label: 'Medicamento',
    sortable: true
    },
  {
    name: 'dosage',
    align: 'left',
    field: 'row.amtPerTime',
    label: 'Toma',
    sortable: false
    },
  {
    name: 'packs',
    align: 'center',
    field: 'row.packs',
    label: 'Quantidade em (Frascos)',
    sortable: false
    },
  {
    name: 'nextPickUpDate',
    align: 'left',
    label: 'Próximo Levantamento',
    sortable: false
    },
  {
    name: 'options',
    align: 'center',
    label: 'Opções',
    sortable: false
    }
]
export default {
  props: ['visitDetails'],
  setup () {
    return {
      columns,
      prescribedDrugs: ref([
        {
          id: 'a334c386-1b66-11ec-9621-0242ac130002',
          amtPerTime: '1-0-1',
          timesPerDay: '2',
          packs: '3',
          drug: {
            id: '08S23Z-cd-22ff-4993-9378-335cf43bd5c8',
            name: '[[ATV/RTV] Atazanavir 300mg/Ritonavir 100mg '
          }
        },
        {
          id: 'ab09028e-1b66-11ec-9621-0242ac130002',
          amtPerTime: '1-1-1',
          timesPerDay: '3',
          packs: '2',
          drug: {
            id: '08S18Z-da-b787-4fa1-a2d6-2fda22da6564',
            name: '[LPV/RTV] Lopinavir/Ritonavir 200mg/50mg'
          }
        }
      ])
    }
  },
  methods: {
    deleteRow (row) {
      const i = this.prescribedDrugs.map(toRemove => toRemove.id).indexOf(row.id) // find index of your object
      this.prescribedDrugs.splice(i, 1)
    }
  },
  components: {
    ListHeader: require('components/Shared/ListHeader.vue').default
  }
}
</script>

<style>

</style>
