<template>
  <div>
      <PrescriptionDrugsLestHeader
          :addVisible="true"
          :mainContainer="true"
          bgColor="bg-primary"
          :visitDetails="visitDetails"
          @showAdd="addEditDrugs">
        Medicamentos para {{visitDetails.episode.patientServiceIdentifier.service.description}}
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
              <q-tr no-hover :props="props">
                <q-td auto-width key="order" :props="props">
                  {{props.row.index}}
                </q-td>
                <q-td key="drug" :props="props">
                  {{props.row.drug.name}}
                </q-td>
                <q-td key="dosage" :props="props">
                  {{props.row.amtPerTime + ' - ' + props.row.timesPerDay + ' X por ' + props.row.form}}
                </q-td>
                <q-td auto-width key="packs" :props="props">
                  <q-select
                    style="width: 70px;"
                    class="q-pa-none"
                    dense outlined
                    v-model="props.row.qtyPrescribed"
                    :options="nums"/>
                </q-td>
                <q-td key="nextPickUpDate" :props="props">
                  <div class="row">
                    <q-toggle v-model="props.row.toContinue" label="Continua" />
                  </div>
                </q-td>
                <q-td key="options" :props="props">
                  <q-btn flat round
                    color="red"
                    icon="delete"
                    @click="deleteRow(props.row)"/>
                </q-td>
              </q-tr>
            </template>
        </q-table>
      </div>
      <q-dialog persistent v-model="showAddEditDrug">
        <AddEditPrescribedDrug
          @addPrescribedDrug="addPrescribedDrug"
          :visitDetails="curVisitDetails"
          :hasTherapeuticalRegimen="hasTherapeuticalRegimen"
          @close="showAddEditDrug = false" />
    </q-dialog>
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
  { name: 'nextPickUpDate', align: 'left', field: 'row.toContinue', label: 'Próx. Levantamento', sortable: false },
  { name: 'options', align: 'center', label: 'Opções', sortable: false }
]
export default {
  props: ['visitDetails', 'hasTherapeuticalRegimen', 'oldPrescribedDrugs'],
  data () {
    return {
      columns,
      showAddEditDrug: false,
      curVisitDetails: '',
      nextPUpDate: '',
      pickupDate: '',
      prescribedDrugs: ref([]),
      nums: Array(4).fill().map((x, i) => i + 1)
    }
  },
  methods: {
    addEditDrugs (pickupDate, nextPDate) {
      this.nextPUpDate = nextPDate
      this.pickupDate = new Date(pickupDate)
      this.curVisitDetails.packs[0].pickupDate = this.pickupDate
      this.curVisitDetails.packs[0].nextPickUpDate = this.nextPUpDate
      this.showAddEditDrug = true
    },
    deleteRow (row) {
      const i = this.prescribedDrugs.map(toRemove => toRemove.id).indexOf(row.id) // find index of your object
      this.prescribedDrugs.splice(i, 1)
      this.$emit('updatePrescribedDrugs', this.prescribedDrugs)
    },
    addPrescribedDrug (prescribedDrug) {
      this.showAddEditDrug = false
      prescribedDrug.nextPickUpDate = this.nextPUpDate
      this.prescribedDrugs.push(new PrescribedDrug(prescribedDrug))
      this.$emit('updatePrescribedDrugs', this.prescribedDrugs)
    }
  },
  mounted () {
    if (this.oldPrescribedDrugs !== null) this.prescribedDrugs = this.oldPrescribedDrugs
  },
  created () {
    this.curVisitDetails = Object.assign({}, this.visitDetails)
  },
  components: {
    AddEditPrescribedDrug: require('components/Patient/PatientPanel/AddEditPrescribedDrug.vue').default,
    PrescriptionDrugsLestHeader: require('components/Patient/Prescription/PrescriptionDrugsListHeader.vue').default
  }
}
</script>

<style>

</style>
