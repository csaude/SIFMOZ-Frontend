<template>
<div>
  <ListHeader v-if="flagGo"
    :addVisible="showAddButton"
    :mainContainer="true"
    bgColor="bg-primary"
    @expandLess="expandLess"
    @showAdd="selectedVisitDetails='', showAddPrescription = true">Prescrição
  </ListHeader>
  <EmptyList v-if="selectedPatient.identifiers.length <= 0" >Nenhuma Prescrição Adicionada</EmptyList>
  <div v-show="infoVisible" >
    <span
      v-for="identifier in selectedPatient.identifiers" :key="identifier.id" >
      <PrescriptionInfoContainer
        :identifier="identifier"
        @addNewPack="addNewPack"
        @editPack="editPack"/>
    </span>
  </div>

  <q-dialog persistent v-model="showAddPrescription" full-width>
      <AddEditPrescription  v-if="flagGo"
        :patient="selectedPatient"
        :selectedVisitDetails="selectedVisitDetails"
        :step="step"
        @close="showAddPrescription = false" />
  </q-dialog>
</div>
</template>

<script>
import { SessionStorage } from 'quasar'
import Patient from '../../../store/models/patient/Patient'
import Episode from '../../../store/models/episode/Episode'
import PatientVisitDetails from '../../../store/models/patientVisitDetails/PatientVisitDetails'
export default {
  props: ['selectedPatient'],
  data () {
    return {
      showAddPrescription: false,
      infoVisible: true,
      selectedVisitDetails: '',
      step: '',
      flagGo: false
    }
  },
  methods: {
    init () {
      this.identifiers.forEach(identifier => {
        Episode.apiGetAllByIdentifierId(identifier.id).then(resp => {
          resp.response.data.forEach(episode => {
            PatientVisitDetails.apiGetAllByEpisodeId(episode.id).then(resp => {
              resp.response.data.forEach(patientVisitDetails => {
                this.flagGo = true
              })
            })
          })
        })
      })
    },
    expandLess (value) {
      this.infoVisible = value
    },
    addNewPack (patientVisitDetails) {
      this.selectedVisitDetails = patientVisitDetails
      this.step = 'addNewPack'
      this.showAddPrescription = true
    },
    editPack (patientVisitDetails) {
      this.selectedVisitDetails = patientVisitDetails
      this.step = 'editPack'
      this.showAddPrescription = true
    }
  },
  created () {
    this.init()
  },
  mounted () {
  },
  computed: {
    showAddButton () {
      return this.patientHasEpisodes
    },
    identifiers () {
      return this.selectedPatient.identifiers
    },
    patient: {
      get () {
        const selectedP = new Patient(SessionStorage.getItem('selectedPatient'))
      return Patient.query().with('identifiers.*')
                            .with('province')
                            .with('attributes')
                            .with('appointments')
                            .with('district')
                            .with('postoAdministrativo')
                            .with('bairro')
                            .with('clinic')
                            .where('id', selectedP.id).first()
      }
    },
    /*
    patient () {
      const selectedP = new Patient(SessionStorage.getItem('selectedPatient'))
      return Patient.query().with('identifiers.*')
                            .with('province')
                            .with('attributes')
                            .with('appointments')
                            .with('district')
                            .with('postoAdministrativo')
                            .with('bairro')
                            .with('clinic')
                            .where('id', selectedP.id).first()
    }, */
    patientHasEpisodes () {
      if (!this.patient.hasIdentifiers()) return false

      let hasEpisode = false
      Object.keys(this.patient.identifiers).forEach(function (k) {
        const id = this.patient.identifiers[k]
        if (!hasEpisode && id.hasEpisodes()) {
          hasEpisode = true
        }
      }.bind(this))
      return hasEpisode
    }
  },
  components: {
      AddEditPrescription: require('components/Patient/PatientPanel/AddEditPrescription.vue').default,
      ListHeader: require('components/Shared/ListHeader.vue').default,
      EmptyList: require('components/Shared/ListEmpty.vue').default,
      PrescriptionInfoContainer: require('components/Patient/Prescription/PrescriptionInfoContainer.vue').default
  }
}
</script>

<style>

</style>
