<template>
  <div>
      <ListHeader
          :addVisible="true"
          :mainContainer="true"
          bgColor="bg-primary"
          @showAdd="$emit('addEditDrugs', visitDetails)">Medicamentos para {{visitDetails.episode.patientProgramIdentifier.clinicalService.description}}
      </ListHeader>
      <div class="col prescription-box q-pa-md q-mb-md">xcvxcvxcv
      </div>
  </div>
</template>

<script>
export default {
  props: ['visitDetails'],
  components: {
    ListHeader: require('components/Shared/ListHeader.vue').default
  }
}
</script>

<style>

</style>
