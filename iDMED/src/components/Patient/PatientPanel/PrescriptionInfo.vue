<template>
<div>
  <ListHeader
    :addVisible="true"
    :mainContainer="true"
    bgColor="bg-primary"
    @showAdd="showAddPrescription = true">Prescrição
  </ListHeader>
  <EmptyList >Nenhuma Prescrição Adicionada</EmptyList>

  <q-dialog persistent v-model="showAddPrescription" full-width>
        <AddEditPrescription
        :patient="selectedPatient"
          @close="showAddPrescription = false" />
    </q-dialog>
</div>
</template>

<script>
export default {
  props: ['selectedPatient'],
  data () {
    return {
      showAddPrescription: false
    }
  },
  components: {
      AddEditPrescription: require('components/Patient/PatientPanel/AddEditPrescription.vue').default,
      ListHeader: require('components/Shared/ListHeader.vue').default,
      EmptyList: require('components/Shared/ListEmpty.vue').default
  }
}
</script>

<style>

</style>
