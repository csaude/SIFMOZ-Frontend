<template>
  <div>
    <InfoTitleBar
      v-if="mobile"
      :sex="patient.gender"
      :name="patient.fullName"
      :nid="patient.preferedIdentifierValue()"
      @showPatientDetails="showPatientDetails"
      >
      Detalhe do Utente/Paciente
    </InfoTitleBar>
    <TitleBar v-else >Detalhe do Utente/Paciente</TitleBar>

    <div class="row q-mt-md"  v-if="patient !== null">
      <q-drawer
        v-model="showPatientInfo"
        :width="405"
        :breakpoint="500"
        overlay
        bordered
        behavior="mobile"
        class="bg-grey-1 q-pl-md q-py-md"
        v-if="mobile"
      >
        <q-scroll-area
          :thumb-style="thumbStyle"
          :content-style="contentStyle"
          :content-active-style="contentActiveStyle"
          style="height: 690px;"
          class="q-pr-md"
        >
          <PatientInfo :selectedPatient="patient"/>
        </q-scroll-area>
      </q-drawer>
      <div v-else class="col-3 q-pa-md q-pl-lg q-ml-lg q-mr-lg panel" style="max-width: 500px">
        <PatientInfo :selectedPatient="patient"/>
      </div>
      <div class="col q-mx-lg">
        <q-toolbar v-if="mobile" class="bg-primary text-white q-mb-sm rounded-borders">

          <div class="col text-center">
            <q-tabs v-model="tab" shrink>
              <q-tab name="clinicService" label="Serviços de Saúde" />
              <q-tab name="prescription" label="Prescrição" />
              <q-tab name="screening" label="Atenção Farmacêutica" />
            </q-tabs>
          </div>
        </q-toolbar>
        <div class="" v-if="mobile">
        <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="clinicService">
            <q-scroll-area
                :thumb-style="thumbStyle"
                :content-style="contentStyle"
                :content-active-style="contentActiveStyle"
                style="height: 440px;"
                class="q-pr-md"
              >
              <ClinicServiceInfo :selectedPatient="patient" :identifiers="patient.identifiers" class="q-mb-lg"/>
              </q-scroll-area>
            </q-tab-panel>
            <q-tab-panel name="prescription">
                  <q-scroll-area
                :thumb-style="thumbStyle"
                :content-style="contentStyle"
                :content-active-style="contentActiveStyle"
                style="height: 440px;"
                class="q-pr-md"
              >
                <PrescriptionInfo :selectedPatient="patient" class="q-mb-lg"/>
            </q-scroll-area>
            </q-tab-panel>
            <q-tab-panel name="screening">
                  <q-scroll-area
                :thumb-style="thumbStyle"
                :content-style="contentStyle"
                :content-active-style="contentActiveStyle"
                style="height: 440px;"
                class="q-pr-md"
              >
              <PharmaceuticalAtentionInfo :selectedPatient="patient"/>
            </q-scroll-area>
            </q-tab-panel>
        </q-tab-panels>
      </div>
        <q-scroll-area
          :thumb-style="thumbStyle"
          :content-style="contentStyle"
          :content-active-style="contentActiveStyle"
          style="height: 700px;"
          class="q-pr-md"
           v-if="website"
        >

          <ClinicServiceInfo v-if="website" :selectedPatient="patient" :identifiers="patient.identifiers" class="q-mb-lg"/>
          <PrescriptionInfo v-if="website" :selectedPatient="patient" class="q-mb-lg"/>
          <PharmaceuticalAtentionInfo v-if="website" :selectedPatient="patient"/>
        </q-scroll-area>
      </div>
    </div>
  </div>
</template>

<script>
import { SessionStorage } from 'quasar'
import { ref } from 'vue'
import Patient from '../../../store/models/patient/Patient'
import Clinic from '../../../store/models/clinic/Clinic'
import mixinplatform from 'src/mixins/mixin-system-platform'
export default {
   mixins: [mixinplatform],
  setup () {
    return {
      tab: ref('clinicService'),
      showPatientInfo: ref(false),
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
      if (this.website) {
        this.showPatientInfo = ref(true)
      }
      if (this.patient === null) {
        Patient.apiFetchById(SessionStorage.getItem('selectedPatient').id)
      }
    },
    showPatientDetails () {
      console.log('showPatientDetails')
      this.showPatientInfo = !this.showPatientInfo
    }
  },
  computed: {
    contentHeight () {
      if (this.mobile) return 'height: 400px;'
      return 'height: 700px;'
    },
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
      InfoTitleBar: require('components/Patient/PatientPanel/PanelTitleBar.vue').default,
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
