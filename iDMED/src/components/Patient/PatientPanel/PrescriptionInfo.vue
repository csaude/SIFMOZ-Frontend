<template>
<div>
  <ListHeader
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
        @editPack="editPack"
        @editClinicService="editClinicService"/>
    </span>
  </div>

  <q-dialog persistent v-model="showAddPrescription" full-width>
      <AddEditPrescription
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
export default {
  props: ['selectedPatient'],
  data () {
    return {
      showAddPrescription: false,
      infoVisible: true,
      selectedVisitDetails: '',
      step: ''
    }
  },
  methods: {
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
  computed: {
    showAddButton () {
      return this.patientHasEpisodes
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
                            .with('clinic')
                            .where('id', selectedP.id).first()
    },
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
