<template>
  <div>
    <TitleBar>Procurar ou adicionar Utentes/Pacientes</TitleBar>
    <search />
  </div>
</template>

<script>
export default {
    props: ['clinic'],
    components: {
        TitleBar: require('components/Shared/TitleBar.vue').default,
        search: require('components/Patient/Search.vue').default
    }
}
</script>

<style>

</style>
