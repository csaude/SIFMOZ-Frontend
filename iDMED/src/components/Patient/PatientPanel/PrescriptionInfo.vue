<template>
<div>
  <ListHeader :addVisible="false" :mainContainer="true" bgColor="bg-primary" @showAdd="showAddPrescription = true">Prescrição </ListHeader>
  <EmptyList >Nenhuma Prescrição Adicionada</EmptyList>
</div>
</template>

<script>
export default {
  setup () {
    return {
      showAddPrescription: false
    }
  },
  components: {
      ListHeader: require('components/Shared/ListHeader.vue').default,
      EmptyList: require('components/Shared/ListEmpty.vue').default
  }
}
</script>

<style>

</style>
