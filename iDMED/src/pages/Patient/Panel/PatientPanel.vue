<template>
  <div>
    <TitleBar>Detalhe do Utente/Paciente</TitleBar>
    <div class="row q-mt-md">
      <div class="col-3 q-pa-md q-pl-lg q-ml-lg q-mr-lg panel">
        <PatientInfo :selectedPatient="patient"/>
      </div>
      <div class="col q-mr-lg">
        <q-scroll-area
          :thumb-style="thumbStyle"
          :content-style="contentStyle"
          :content-active-style="contentActiveStyle"
          style="height: 700px;"
          class="q-pr-md"
        >
          <ClinicServiceInfo :selectedPatient="patient" :identifiers="patient.identifiers" class="q-mb-lg"/>
          <PrescriptionInfo :selectedPatient="patient" class="q-mb-lg"/>
          <PharmaceuticalAtentionInfo :patientVisits="patientVisits" />
        </q-scroll-area>
      </div>
    </div>
  </div>
</template>

<script>
import { SessionStorage } from 'quasar'
import Patient from '../../../store/models/patient/Patient'
import Clinic from '../../../store/models/clinic/Clinic'
import PatientVisit from '../../../store/models/patientVisit/PatientVisit'
export default {
  setup () {
    return {
      contentStyle: {
        backgroundColor: 'rgba(0,0,0,0.02)',
        color: '#555'
      },

      contentActiveStyle: {
        backgroundColor: '#eee',
        color: 'black'
      },

      thumbStyle: {
        right: '2px',
        borderRadius: '5px',
        backgroundColor: '#0ba58b',
        width: '5px',
        opacity: 0.75
      }
    }
  },
  methods: {
       getPatientVisits () {
        PatientVisit.apiGetAllByPatientId(this.patient.id)
       }
  },
  mounted () {
    // this.getPatientVisits()
  },
  computed: {
    clinic () {
        return new Clinic(SessionStorage.getItem('currClinic'))
      },
    patient () {
      const selectedP = new Patient(SessionStorage.getItem('selectedPatient'))
      return Patient.query().with('identifiers.*')
                            .with('province')
                            .with('attributes')
                            .with('appointments')
                            .with('district')
                            .with('postoAdministrativo')
                            .with('bairro')
                            .with('clinic').where('id', selectedP.id).first()
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
     this.getPatientVisits()
   //  console.log(this.getPatientVisits())
  }
}
</script>

<style lang="scss">
  .panel {
    border: 1px solid $grey-13;
    border-radius: 10px
  }
</style>
