<template>
  <div class="row q-ma-xl q-pa-xl text-center">
    <div class="col">
        <q-btn icon="person_outline" round stack color="brown-9" class="q-py-md q-px-lg q-ma-xl" no-caps>
            <div class="text-center">
                Pacientes<br>Utentes
            </div>
        </q-btn>
        <q-btn icon="person_outline" round stack color="brown-9" class="q-py-md q-px-lg q-ma-xl" no-caps>
            <div class="text-center">
                Grupos<br/>&nbsp;
            </div>
        </q-btn>
        <q-btn icon="person_outline" round stack color="brown-9" class="q-py-md q-px-lg q-ma-xl" no-caps>
            <div class="text-center">
                Stock
            </div>
        </q-btn>
        <br/>
        <q-btn icon="person_outline" round stack color="brown-9" class="q-py-md q-px-lg q-ma-xl" no-caps>
            <div class="text-center">
                Administração
            </div>
        </q-btn>
        <q-btn icon="person_outline" round stack color="brown-9" class="q-py-md q-px-lg q-ma-xl" no-caps>
            <div class="text-center">
                Pacientes<br>Utentes
            </div>
        </q-btn>
        <q-btn icon="person_outline" round stack color="brown-9" class="q-py-md q-px-lg q-ma-xl" no-caps>
            <div class="text-center">
                Pacientes<br>Utentes
            </div>
        </q-btn>
    </div>
  </div>
</template>

<script>
import { SessionStorage } from 'quasar'
import Clinic from '../../store/models/clinic/Clinic'
import District from '../../store/models/district/District'
import Province from '../../store/models/province/Province'
import Patient from '../../store/models/patient/Patient'
import ClinicalService from '../../store/models/ClinicalService/ClinicalService'
import ClinicSector from '../../store/models/clinicSector/ClinicSector'
import IdentifierType from '../../store/models/identifierType/IdentifierType'
import PatientServiceIdentifier from '../../store/models/patientServiceIdentifier/PatientServiceIdentifier'
import EpisodeType from '../../store/models/episodeType/EpisodeType'
import StartStopReason from '../../store/models/startStopReason/StartStopReason'
import Episode from '../../store/models/episode/Episode'
import ClinicalServiceAttributeType from '../../store/models/ClinicalServiceAttributeType/ClinicalServiceAttributeType'
import ClinicalServiceAttribute from '../../store/models/ClinicalServiceAttribute/ClinicalServiceAttribute'
import Drug from '../../store/models/drug/Drug'
import TherapeuticRegimen from '../../store/models/therapeuticRegimen/TherapeuticRegimen'
import TherapeuticLine from '../../store/models/therapeuticLine/TherapeuticLine'
import Form from '../../store/models/form/Form'
import Duration from '../../store/models/Duration/Duration'
import Doctor from '../../store/models/doctor/Doctor'
import DispenseType from '../../store/models/dispenseType/DispenseType'
import PatientVisit from '../../store/models/patientVisit/PatientVisit'
import PatientVisitDetails from '../../store/models/patientVisitDetails/PatientVisitDetails'
import Pack from '../../store/models/packaging/Pack'
import Prescription from '../../store/models/prescription/Prescription'
import PackagedDrug from '../../store/models/packagedDrug/PackagedDrug'
import PrescribedDrug from '../../store/models/prescriptionDrug/PrescribedDrug'
import PrescriptionDetail from '../../store/models/prescriptionDetails/PrescriptionDetail'
export default {
    components: {
    },
    methods: {
      loadAppParameters () {
        Duration.apiGetAll()
        Province.apiGetAll()
        District.apiGetAll()
        ClinicalServiceAttributeType.apiGetAll()
        ClinicalService.apiGetAll()
        ClinicSector.apiGetAll()
        IdentifierType.apiGetAll()
        EpisodeType.apiGetAll()
        StartStopReason.apiGetAll()
        ClinicalServiceAttribute.apiGetAll()
        Drug.apiGetAll()
        TherapeuticRegimen.apiGetAll()
        TherapeuticLine.apiGetAll()
        Form.apiGetAll()
        Doctor.apiFetchByClinicId(this.clinic.id)
        DispenseType.apiGetAll()
        Clinic.apiGetAll()
      },
      saveCurrClinic () {
        Clinic.apiFetchById('ff8081817c668dcc017c66dc3d330002').then(resp => {
          SessionStorage.set('currClinic', resp.response.data)
        })
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
    },
    mounted () {
      this.loadAppParameters()
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
    },
    created () {
      this.saveCurrClinic()
    },
    computed: {
      clinic () {
        return new Clinic(SessionStorage.getItem('currClinic'))
      }
    }
}
</script>

<style>

</style>
