<template>
  <div>
    <ListHeader
      :addVisible="true"
      :mainContainer="true"
      bgColor="bg-primary"
      @showAdd="showAddClinicService = true">
      Serviços de Saúde
    </ListHeader>
    <EmptyList v-if="emptyList" >Nenhum Serviço de Saúde Adicionado</EmptyList>
    <InfoContainer/>
    <q-dialog v-model="showAddClinicService">
        <AddClinicService @close="showAddClinicService = false" />
    </q-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      showAddClinicService: false,
      emptyList: false
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
