<template>
<div>
  <ListHeader
    :addVisible="showAddButton"
    :mainContainer="true"
    bgColor="bg-primary"
    @expandLess="expandLess"
    @showAdd="selectedVisitDetails='', showAddPrescription = true">Prescrição
  </ListHeader>
  <EmptyList v-if="selectedPatient.identifiers.length <= 0" >Nenhuma Prescrição Adicionada</EmptyList>
  <div v-show="infoVisible" >
    <span
      v-for="identifier in selectedPatient.identifiers" :key="identifier.id" >
      <PrescriptionInfoContainer
        :identifier="identifier"
        @addNewPack="addNewPack"
        @editClinicService="editClinicService"/>
    </span>
  </div>

  <q-dialog persistent v-model="showAddPrescription" full-width>
      <AddEditPrescription
        :patient="selectedPatient"
        :selectedVisitDetails="selectedVisitDetails"
        @close="showAddPrescription = false" />
  </q-dialog>
</div>
</template>

<script>
export default {
  props: ['selectedPatient'],
  data () {
    return {
      showAddPrescription: false,
      infoVisible: true,
      selectedVisitDetails: ''
    }
  },
  methods: {
    expandLess (value) {
      this.infoVisible = value
    },
    addNewPack (patientVisitDetails) {
      this.selectedVisitDetails = patientVisitDetails
      this.showAddPrescription = true
    }
  },
  computed: {
    showAddButton () {
      return this.selectedPatient.identifiers.length > 0
    }
  },
  components: {
      AddEditPrescription: require('components/Patient/PatientPanel/AddEditPrescription.vue').default,
      ListHeader: require('components/Shared/ListHeader.vue').default,
      EmptyList: require('components/Shared/ListEmpty.vue').default,
      PrescriptionInfoContainer: require('components/Patient/Prescription/PrescriptionInfoContainer.vue').default
  }
}
</script>

<style>

</style>
