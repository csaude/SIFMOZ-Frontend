<template>
  <div>
    <ListHeader
      :addVisible="true"
      :mainContainer="true"
      bgColor="bg-primary"
      @expandLess="expandLess"
      @showAdd="addClinicService()">
      Serviços de Saúde da Farmácia
    </ListHeader>
    <EmptyList v-if="identifiers.length <= 0" >Nenhum Serviço de Saúde Adicionado</EmptyList>
    <div v-show="serviceInfoVisible">
      <span
        v-for="identifier in identifiers" :key="identifier.id" >
        <InfoContainer
          :selectedPatient="selectedPatient"
          :identifier="identifier"
          @reopenClinicService="reopenClinicService"
          @closeClinicService="closeClinicService"
          @editClinicService="editClinicService"/>
      </span>
    </div>
    <q-dialog persistent v-model="showAddEditClinicalService">
        <AddClinicService
          :identifierToEdit="selectedIdentifier"
          :selectedPatient="selectedPatient"
          :step="step"
          @createFirstEpisode="createFirstEpisode"
          @close="showAddEditClinicalService = false" />
    </q-dialog>
    <q-dialog persistent v-model="showAddEditEpisode">
        <AddEditEpisode
          :episodeToEdit="selectedEpisode"
          :curIdentifier="selectedIdentifier"
          @close="showAddEditEpisode = false" />
    </q-dialog>
  </div>
</template>

<script>
import { LocalStorage, SessionStorage } from 'quasar'
import PatientServiceIdentifier from '../../../store/models/patientServiceIdentifier/PatientServiceIdentifier'
import Patient from '../../../store/models/patient/Patient'
export default {
  props: ['selectedPatient'],
  data () {
    return {
      showAddEditClinicalService: false,
      emptyList: false,
      selectedIdentifier: new PatientServiceIdentifier(),
      showAddEditEpisode: false,
      serviceInfoVisible: true,
      step: ''
    }
  },
  methods: {
    editClinicService (curIdentifier) {
      this.selectedIdentifier = Object.assign({}, curIdentifier)
      this.step = 'edit'
      this.showAddEditClinicalService = true
    },
    closeClinicService (curIdentifier) {
      this.selectedIdentifier = Object.assign({}, curIdentifier)
      this.step = 'close'
      this.showAddEditClinicalService = true
    },
    reopenClinicService (curIdentifier) {
      this.selectedIdentifier = Object.assign({}, curIdentifier)
      this.step = 'reOpen'
      this.showAddEditClinicalService = true
    },
    addClinicService () {
      this.selectedIdentifier = null
      this.step = 'create'
      this.showAddEditClinicalService = true
    },
    expandLess (value) {
      this.serviceInfoVisible = value
      LocalStorage.set('clinicServiceInfoVisible', value)
    },
    createFirstEpisode (identifier) {
      this.selectedIdentifier = identifier
      this.showAddEditClinicalService = false
      this.showAddEditEpisode = true
    }
  },
  created () {
  },
  mounted () {
  },
  computed: {
    clinicServiceInfoVisible () {
      return LocalStorage.getItem('clinicServiceInfoVisible')
    },
    canEdit () {
      return this.canEditIdentifier()
    },
    identifiers: {
      get () {
        return this.patient.identifiers
      }
    },
    /*
    identifiers () {
      return this.patient.identifiers
    }, */
    patient: {
      get () {
      const selectedP = new Patient(SessionStorage.getItem('selectedPatient'))
      return Patient.query().with(['identifiers.identifierType', 'identifiers.service.identifierType', 'identifiers.clinic.province'])
                            .with('province')
                            .with('attributes')
                            .with('appointments')
                            .with('district')
                            .with('postoAdministrativo')
                            .with('bairro')
                            .with('clinic').where('id', selectedP.id).first()
      }
    }
    /*
    patient () {
      const selectedP = new Patient(SessionStorage.getItem('selectedPatient'))
      return Patient.query().with(['identifiers.identifierType', 'identifiers.service.identifierType', 'identifiers.clinic.province'])
                            .with('province')
                            .with('attributes')
                            .with('appointments')
                            .with('district')
                            .with('postoAdministrativo')
                            .with('bairro')
                            .with('clinic').where('id', selectedP.id).first()
      } */
  },
  components: {
      ListHeader: require('components/Shared/ListHeader.vue').default,
      EmptyList: require('components/Shared/ListEmpty.vue').default,
      AddClinicService: require('components/Patient/PatientPanel/AddClinicService.vue').default,
      AddEditEpisode: require('components/Patient/PatientPanel/AddEditEpisode.vue').default,
      InfoContainer: require('components/Patient/PatientPanel/InfoContainer.vue').default
  }
}
</script>

<style>

</style>
