<template>
  <div>
    <TitleBar>Detalhe do Utente/Paciente</TitleBar>
    <div class="row q-mt-md">
      <div class="col-3 q-pa-md q-pl-lg q-ml-lg q-mr-lg panel">
        <PatientInfo :selectedPatient="patient"/>
      </div>
      <div class="col q-mr-lg">
        <ClinicServiceInfo class="q-mb-lg"/>
        <PrescriptionInfo class="q-mb-lg"/>
        <PharmaceuticalAtentionInfo />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['selectedPatient'],
  setup () {
    return {
      patient: {
        clinic: {},
        firstNames: 'Jose',
        middleNames: 'Antonio',
        lastName: 'Silva',
        dateOfBirth: '2021/09/30',
        gender: 'Masculino',
        cellphone: '856326987',
        alternativeCellphone: '826532985',
        address: 'Q.12, Rua 12, Casa 4',
        addressReference: 'Substação'
      }
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
