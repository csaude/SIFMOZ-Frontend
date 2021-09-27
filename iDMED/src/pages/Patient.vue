<template>
  <div>
    <search
      v-if="isSearch"
      @goToPatientPanel="showSelected"/>

    <PatientPanel
      :selectedPatient="currPatient"
      v-if="isPatientDetails" />
  </div>
</template>

<script>
import { LocalStorage } from 'quasar'
import Patient from '../store/models/patient/Patient'
export default {
    data () {
      return {
        isSearch: true,
        isPatientDetails: false,
        currPatient: new Patient()
      }
    },
    methods: {
      showSelected (patient) {
        this.currPatient = Object.assign({}, patient)
        this.isSearch = false
        this.isPatientDetails = true
      }
    },
    computed: {
      clinic () {
        return LocalStorage.getItem('currClinic')
      }
    },
    components: {
        search: require('components/Patient/Search.vue').default,
        PatientPanel: require('components/Patient/PatientPanel/PatientPanel.vue').default
    }
}
</script>

<style>

</style>
