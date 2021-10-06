<template>
  <div>
    <TitleBar>Detalhe do Utente/Paciente</TitleBar>
    <div class="row q-mt-md">
      <div class="col-3 q-pa-md q-pl-lg q-ml-lg q-mr-lg panel">
        <PatientInfo :selectedPatient="patient"/>
      </div>
      <div class="col q-mr-lg">
        <ClinicServiceInfo :selectedPatient="patient" :identifiers="patient.identifiers" class="q-mb-lg"/>
        <PrescriptionInfo :selectedPatient="patient" class="q-mb-lg"/>
        <PharmaceuticalAtentionInfo />
      </div>
    </div>
  </div>
</template>

<script>
import { SessionStorage } from 'quasar'
import Patient from '../../../store/models/patient/Patient'
import Clinic from '../../../store/models/clinic/Clinic'
export default {
  setup () {
    return {
    }
  },
  computed: {
    clinic () {
        return new Clinic(SessionStorage.getItem('currClinic'))
      },
    patient () {
        return new Patient(SessionStorage.getItem('selectedPatient'))
      }
  },
  components: {
      TitleBar: require('components/Shared/TitleBar.vue').default,
      PatientInfo: require('components/Patient/PatientPanel/PatientInfo.vue').default,
      ClinicServiceInfo: require('components/Patient/PatientPanel/ClinicServicesInfo.vue').default,
      PrescriptionInfo: require('components/Patient/PatientPanel/PrescriptionInfo.vue').default,
      PharmaceuticalAtentionInfo: require('components/Patient/PatientPanel/PharmaceuticalAtentionInfo.vue').default
  },
  created () {
    // this.patient = Object.assign({}, this.selectedPatient)
  }
}
</script>

<style lang="scss">
  .panel {
    border: 1px solid $grey-13;
    border-radius: 10px
  }
</style>
