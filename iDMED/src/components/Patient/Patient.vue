<template>
  <div>
    <search :clinic="clinic" v-if="isSearch" @showSelected="showSelected"/>
  </div>
</template>

<script>
export default {
    props: ['clinic'],
    setup () {
      return {
        isSearch: true,
        isPatientDetails: false,
        currPatient: {}
      }
    },
    methods: {
      showSelected (patient) {}
    },
    components: {
        search: require('components/Patient/Search.vue').default
    }
}
</script>

<style>

</style>
