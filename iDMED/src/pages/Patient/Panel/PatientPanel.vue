<template>
  <div>
    <TitleBar>Detalhe do Utente/Paciente</TitleBar>
    <div class="row q-mt-md"  v-if="patient !== null">
      <div class="col-3 q-pa-md q-pl-lg q-ml-lg q-mr-lg panel" style="max-width: 500px">
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
          <PharmaceuticalAtentionInfo :selectedPatient="patient"/>
        </q-scroll-area>
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
      contentStyle: {
        backgroundColor: '#ffffff',
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
    init () {
      if (this.patient === null) {
        Patient.apiFetchById(SessionStorage.getItem('selectedPatient').id)
      }
    }
  },
  computed: {
    clinic: {
        get () {
          return Clinic.query()
                    .with('province')
                    .where('id', SessionStorage.getItem('currClinic').id)
                    .first()
        }
      },
    patient: {
      get () {
      const selectedP = SessionStorage.getItem('selectedPatient')
      return Patient.query().with(['identifiers', 'identifiers.identifierType', 'identifiers.service.identifierType', 'identifiers.clinic.province'])
                            .with('province')
                            .with('attributes')
                            .with('appointments')
                            .with('district.*')
                            .with('postoAdministrativo')
                            .with('bairro')
                            .with(['clinic.province', 'clinic.district.province']).where('id', selectedP.id).first()
                              },
      set (patient) {
        this.$emit('update:patient', '')
        Patient.update(patient)
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
    this.init()
  }
}
</script>

<style lang="scss">
  .panel {
    border: 1px solid $grey-13;
    border-radius: 10px
  }
</style>
