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
export default {
    components: {
    },
    methods: {
      loadAppParameters () {
        Province.apiGetAll()
        District.apiGetAll()
        ClinicalServiceAttributeType.apiGetAll()
        ClinicalService.apiGetAll()
        ClinicSector.apiGetAll()
        IdentifierType.apiGetAll()
        EpisodeType.apiGetAll()
        StartStopReason.apiGetAll()
        ClinicalServiceAttribute.apiGetAll()
      },
      saveCurrClinic () {
        Clinic.apiFetchById('ff8081817c668dcc017c66dc3d330002').then(resp => {
          SessionStorage.set('currClinic', resp.response.data)
        })
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
      this.getAllEpisodesOfClinic()
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
