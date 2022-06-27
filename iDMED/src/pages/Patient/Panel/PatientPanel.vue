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
import Duration from 'src/store/models/Duration/Duration'
import Province from 'src/store/models/province/Province'
import District from 'src/store/models/district/District'
import ClinicalServiceAttributeType from 'src/store/models/ClinicalServiceAttributeType/ClinicalServiceAttributeType'
import ClinicalService from 'src/store/models/ClinicalService/ClinicalService'
import ClinicSector from 'src/store/models/clinicSector/ClinicSector'
import IdentifierType from 'src/store/models/identifierType/IdentifierType'
import EpisodeType from 'src/store/models/episodeType/EpisodeType'
import FacilityType from 'src/store/models/facilityType/FacilityType'
import StartStopReason from 'src/store/models/startStopReason/StartStopReason'
import ClinicalServiceAttribute from 'src/store/models/ClinicalServiceAttribute/ClinicalServiceAttribute'
import Drug from 'src/store/models/drug/Drug'
import TherapeuticRegimen from 'src/store/models/therapeuticRegimen/TherapeuticRegimen'
import TherapeuticLine from 'src/store/models/therapeuticLine/TherapeuticLine'
import Form from 'src/store/models/form/Form'
import Doctor from 'src/store/models/doctor/Doctor'
import DispenseType from 'src/store/models/dispenseType/DispenseType'
import RAMScreening from 'src/store/models/screening/RAMScreening'
import AdherenceScreening from 'src/store/models/screening/AdherenceScreening'
import PregnancyScreening from 'src/store/models/screening/PregnancyScreening'
import TBScreening from 'src/store/models/screening/TBScreening'
import VitalSignsScreening from 'src/store/models/screening/VitalSignsScreening'
import InteroperabilityType from 'src/store/models/interoperabilityType/InteroperabilityType'
import InteroperabilityAttribute from 'src/store/models/interoperabilityAttribute/InteroperabilityAttribute'
import HealthInformationSystem from 'src/store/models/healthInformationSystem/HealthInformationSystem'
import Pack from 'src/store/models/packaging/Pack'
import Prescription from 'src/store/models/prescription/Prescription'
import Episode from 'src/store/models/episode/Episode'
import PatientVisitDetails from 'src/store/models/patientVisitDetails/PatientVisitDetails'
import PatientVisit from 'src/store/models/patientVisit/PatientVisit'
import PatientServiceIdentifier from 'src/store/models/patientServiceIdentifier/PatientServiceIdentifier'
// import PackagedDrug from 'src/store/models/packagedDrug/PackagedDrug'
// import PrescribedDrug from 'src/store/models/prescriptionDrug/PrescribedDrug'
// import PrescriptionDetail from 'src/store/models/prescriptionDetails/PrescriptionDetail'
// import PatientVisit from '../../../store/models/patientVisit/PatientVisit'
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
    },
    loadAppParameters () {
      const offset = 0
      const max = 0
        Duration.apiGetAll(offset, max)
        Province.apiGetAll(offset, max)
        District.apiGetAll(offset, max)
        ClinicalServiceAttributeType.apiGetAll(offset, max)
        ClinicalService.apiGetAll(offset, max)
        ClinicSector.apiGetAll(offset, max)
        IdentifierType.apiGetAll(offset, max)
        EpisodeType.apiGetAll(offset, max)
        FacilityType.apiGetAll(offset, max)
        StartStopReason.apiGetAll(offset, max)
        ClinicalServiceAttribute.apiGetAll(offset, max)
        Drug.apiGetAll(offset, max)
        TherapeuticRegimen.apiGetAll(offset, max)
        TherapeuticLine.apiGetAll(offset, max)
        Form.apiGetAll(offset, max)
        Doctor.apiFetchByClinicId(this.clinic.id)
        DispenseType.apiGetAll(offset, max)
        Clinic.apiGetAll(offset, max)
        RAMScreening.apiGetAll(offset, max)
        AdherenceScreening.apiGetAll(offset, max)
        PregnancyScreening.apiGetAll(offset, max)
        TBScreening.apiGetAll(offset, max)
        VitalSignsScreening.apiGetAll(offset, max)
        InteroperabilityType.apiGetAll(offset, max)
        InteroperabilityAttribute.apiGetAll(offset, max)
        HealthInformationSystem.apiGetAll(offset, max)
      },
       getAllPacksOfClinic () {
        const offset = 0
        const max = 100
        this.doPackGet(this.clinic.id, offset, max)
      },
      getAllPrescriptionOfClinic () {
        const offset = 0
        const max = 100
        this.doPrescriptionkGet(this.clinic.id, offset, max)
      },
      getAllPatientVisitsOfClinic () {
        const offset = 0
        const max = 100
        this.doPatientVisitGet(this.clinic.id, offset, max)
      },
      getAlPatientVisitDetailsOfClinic () {
        const offset = 0
        const max = 100
        this.doPatientVisitDetailsGet(this.clinic.id, offset, max)
      },
      getAllPatientsOfClinic () {
        const offset = 0
        const max = 100
        this.doPatientGet(this.clinic.id, offset, max)
      },
      getAllIdentifiersOfClinic () {
        const offset = 0
        const max = 100
        this.doIdentifiersGet(this.clinic.id, offset, max)
      },
      getAllEpisodesOfClinic () {
        const offset = 0
        const max = 100
        this.doEpisodeGet(this.clinic.id, offset, max)
      },
      doPackGet (clinicId, offset, max) {
        Pack.apiGetAllByClinicId(clinicId, offset, max).then(resp => {
              if (resp.response.data.length > 0) {
                offset = offset + max
                setTimeout(this.doPackGet(clinicId, offset, max), 2)
              }
          }).catch(error => {
              console.log(error)
          })
      },
      doPrescriptionkGet (clinicId, offset, max) {
        Prescription.apiGetAllByClinicId(clinicId, offset, max).then(resp => {
              if (resp.response.data.length > 0) {
                offset = offset + max
                setTimeout(this.doPrescriptionkGet(clinicId, offset, max), 2)
              }
          }).catch(error => {
              console.log(error)
          })
      },
      doEpisodeGet (clinicId, offset, max) {
        Episode.apiGetAllByClinicId(clinicId, offset, max).then(resp => {
              if (resp.response.data.length > 0) {
                offset = offset + max
                setTimeout(this.doEpisodeGet(clinicId, offset, max), 2)
              }
          }).catch(error => {
              console.log(error)
          })
      },
      doPatientVisitDetailsGet (clinicId, offset, max) {
        PatientVisitDetails.apiGetAllByClinicId(clinicId, offset, max).then(resp => {
              if (resp.response.data.length > 0) {
                offset = offset + max
                setTimeout(this.doPatientVisitDetailsGet(clinicId, offset, max), 2)
              }
          }).catch(error => {
              console.log(error)
          })
      },
      doPatientGet (clinicId, offset, max) {
        Patient.apiGetAllByClinicId(clinicId, offset, max).then(resp => {
              if (resp.response.data.length > 0) {
                offset = offset + max
                setTimeout(this.doPatientGet(clinicId, offset, max), 2)
              }
          }).catch(error => {
              console.log(error)
          })
      },
      doPatientVisitGet (clinicId, offset, max) {
        PatientVisit.apiGetAllByClinicId(clinicId, offset, max).then(resp => {
              if (resp.response.data.length > 0) {
                offset = offset + max
                setTimeout(this.doPatientVisitGet(clinicId, offset, max), 2)
              }
          }).catch(error => {
              console.log(error)
          })
      },
      doIdentifiersGet (clinicId, offset, max) {
        PatientServiceIdentifier.apiGetAllByClinicId(clinicId, offset, max).then(resp => {
              if (resp.response.data.length > 0) {
                offset = offset + max
                setTimeout(this.doIdentifiersGet(clinicId, offset, max), 2)
              }
          }).catch(error => {
              console.log(error)
          })
      }
 //      getPatientVisits () {
 //       PatientVisit.apiGetAllByPatientId(this.patient.id)
  //     }
  },
  mounted () {
    /* this.loadAppParameters()
    this.getAllPatientsOfClinic()
    this.getAllIdentifiersOfClinic()
    this.getAllPrescriptionOfClinic()
    this.getAllEpisodesOfClinic()
    this.getAllPatientVisitsOfClinic()
    this.getAllPacksOfClinic()
    this.getAlPatientVisitDetailsOfClinic()
    PackagedDrug.apiGetAll()
    PrescribedDrug.apiGetAll()
    PrescriptionDetail.apiGetAll()
    // this.getPatientVisits() */
  },
  computed: {
    /* clinic: {
        get () {
          return new Clinic(SessionStorage.getItem('currClinic'))
        }
      }, */
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
