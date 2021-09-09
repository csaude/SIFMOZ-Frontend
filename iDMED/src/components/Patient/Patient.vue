<template>
  <div>
    <search :clinic="clinic" v-if="isSearch" @showSelected="showSelected"/>
    <PatientPanel :selectedPatient="currPatient" v-if="isPatientDetails"/>
  </div>
</template>

<script>
export default {
    props: ['clinic'],
    setup () {
      return {
        isSearch: false,
        isPatientDetails: true,
        currPatient: {}
      }
    },
    methods: {
      showSelected (patient) {}
    },
    components: {
        search: require('components/Patient/Search.vue').default,
        PatientPanel: require('components/Patient/PatientPanel/PatientPanel.vue').default
    }
}
</script>

<style>

</style>
