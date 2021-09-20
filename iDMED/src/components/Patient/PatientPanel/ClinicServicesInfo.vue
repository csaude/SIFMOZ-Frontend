<template>
  <div>
    <ListHeader
      :addVisible="true"
      :mainContainer="true"
      bgColor="bg-primary"
      @showAdd="addClinicService()">
      Serviços de Saúde
    </ListHeader>
    <EmptyList v-if="identifiers.length <= 0" >Nenhum Serviço de Saúde Adicionado</EmptyList>
    <span
      v-for="identifier in identifiers" :key="identifier.id" >
      <InfoContainer
        :selectedPatient="selectedPatient"
        :identifier="identifier"
        @editClinicService="editClinicService"/>
    </span>
    <q-dialog persistent v-model="showAddEditClinicalService">
        <AddClinicService
          :identifierToEdit="selectedIdentifier"
          :selectedPatient="selectedPatient"
          @close="showAddEditClinicalService = false" />
    </q-dialog>
  </div>
</template>

<script>
export default {
  props: ['identifiers', 'selectedPatient'],
  data () {
    return {
      showAddEditClinicalService: false,
      emptyList: false,
      selectedIdentifier: {}
    }
  },
  methods: {
    editClinicService (curIdentifier) {
      this.selectedIdentifier = Object.assign({}, curIdentifier)
      this.showAddEditClinicalService = true
    },
    addClinicService () {
      this.selectedIdentifier = null
      this.showAddEditClinicalService = true
    }
  },
  components: {
      ListHeader: require('components/Shared/ListHeader.vue').default,
      EmptyList: require('components/Shared/ListEmpty.vue').default,
      AddClinicService: require('components/Patient/PatientPanel/AddClinicService.vue').default,
      InfoContainer: require('components/Patient/PatientPanel/InfoContainer.vue').default
  }
}
</script>

<style>

</style>
