<template>
  <div>
    <ListHeader :addVisible="true" :mainContainer="true" bgColor="bg-primary" @showAdd="showAddPharmAttention = true">Atenção Farmacêutica</ListHeader>
    <EmptyList >Nenhuma Atenção Farmacêutica Adicionada</EmptyList>
  </div>
</template>

<script>
export default {
  setup () {
    return {
      showAddPharmAttention: false
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
