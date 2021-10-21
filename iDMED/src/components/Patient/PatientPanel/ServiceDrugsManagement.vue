<template>
  <div>
      <PrescriptionDrugsLestHeader
          :addVisible="true"
          :mainContainer="true"
          bgColor="bg-primary"
          :visitDetails="visitDetails"
          @showAdd="addEditDrugs">Medicamentos para {{visitDetails.episode.patientServiceIdentifier.service.description}}
      </PrescriptionDrugsLestHeader>
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
                  <q-select
                      class="" dense outlined
                      v-model="props.row.qtyPrescribed"
                      use-input
                      :options="nums"/>
                </q-td>
                <q-td key="nextPickUpDate" :props="props">
                  <div class="row">
                    <q-input
                    v-if="props.row.toContinue"
                      dense
                      outlined
                      class="input-color q-ma-sm"
                      v-model="props.row.nextPickUpDate"
                      mask="date"
                      label="Proximo Levantamento">
                      <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer" color="primary">
                          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                              <q-date v-model="props.row.nextPickUpDate" >
                              <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                              </div>
                              </q-date>
                          </q-popup-proxy>
                          </q-icon>
                      </template>
                    </q-input>
                    <q-toggle v-model="props.row.toContinue" label="Continua" />
                  </div>
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
import PrescribedDrug from '../../../store/models/prescriptionDrug/PrescribedDrug'
const columns = [
  { name: 'order', required: true, label: 'Ordem', align: 'center', sortable: true },
  { name: 'drug', align: 'left', field: 'row.drug.name', label: 'Medicamento', sortable: true },
  { name: 'dosage', align: 'left', field: 'row.amtPerTime', label: 'Toma', sortable: false },
  { name: 'packs', align: 'center', style: 'width: 20px', field: 'row.qtyPrescribed', label: 'Quantidade em (Frascos)', sortable: false },
  { name: 'nextPickUpDate', align: 'left', abel: 'Próximo Levantamento', sortable: false },
  { name: 'options', align: 'center', label: 'Opções', sortable: false }
]
export default {
  props: ['visitDetails'],
  setup () {
    return {
      columns,
      curVisitDetails: '',
      prescribedDrugs: ref([
        new PrescribedDrug({
          id: 'a334c386-1b66-11ec-9621-0242ac130002',
          amtPerTime: '1-0-1',
          timesPerDay: '2',
          qtyPrescribed: '3',
          drug: {
            id: '08S23Z-cd-22ff-4993-9378-335cf43bd5c8',
            name: '[[ATV/RTV] Atazanavir 300mg/Ritonavir 100mg '
          }
        }),
        new PrescribedDrug({
            id: 'ab09028e-1b66-11ec-9621-0242ac130002',
            amtPerTime: '1-1-1',
            timesPerDay: '3',
            qtyPrescribed: '2',
            drug: {
              id: '08S18Z-da-b787-4fa1-a2d6-2fda22da6564',
              name: '[LPV/RTV] Lopinavir/Ritonavir 200mg/50mg'
            }
          })
      ]),
      nums: Array(10).fill().map((x, i) => i + 1)
    }
  },
  methods: {
    deleteRow (row) {
      const i = this.prescribedDrugs.map(toRemove => toRemove.id).indexOf(row.id) // find index of your object
      this.prescribedDrugs.splice(i, 1)
    },
    addEditDrugs (pickupDate) {
      this.$emit('addEditDrugs', pickupDate)
    }
  },
  created () {
    this.curVisitDetails = Object.assign({}, this.visitDetails)
  },
  components: {
    PrescriptionDrugsLestHeader: require('components/Patient/Prescription/PrescriptionDrugsListHeader.vue').default
  }
}
</script>

<style>

</style>
