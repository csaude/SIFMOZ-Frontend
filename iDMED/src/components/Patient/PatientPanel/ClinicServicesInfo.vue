<template>
  <div>
    <ListHeader
      :addVisible="true"
      :mainContainer="true"
      bgColor="bg-primary"
      @expandLess="expandLess"
      @showAdd="addClinicService()">
      Serviços de Saúde
    </ListHeader>
    <EmptyList v-if="identifiers.length <= 0" >Nenhum Serviço de Saúde Adicionado</EmptyList>
    <div v-show="serviceInfoVisible">
      <span
        v-for="identifier in identifiers" :key="identifier.id" >
        <InfoContainer
          :selectedPatient="selectedPatient"
          :identifier="identifier"
          @editClinicService="editClinicService"/>
      </span>
    </div>
    <q-dialog persistent v-model="showAddEditClinicalService">
        <AddClinicService
          :identifierToEdit="selectedIdentifier"
          :selectedPatient="selectedPatient"
          @close="showAddEditClinicalService = false" />
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
      serviceInfoVisible: false
    }
  },
  methods: {
    editClinicService (curIdentifier) {
      this.selectedIdentifier = Object.assign({}, curIdentifier)
      this.showAddEditClinicalService = true
    },
    addClinicService () {
      this.selectedIdentifier = null
      this.showAddEditClinicalService = true
    },
    expandLess (value) {
      this.serviceInfoVisible = value
      LocalStorage.set('clinicServiceInfoVisible', value)
    }
  },
  computed: {
    clinicServiceInfoVisible () {
      return LocalStorage.getItem('clinicServiceInfoVisible')
    },
    identifiers () {
      return PatientServiceIdentifier.query().with('identifierType|clinicalService|episodes').where('patient_id', this.patient.id).get()
    },
    patient () {
      return new Patient(SessionStorage.getItem('selectedPatient'))
    }
  },
  components: {
      ListHeader: require('components/Shared/ListHeader.vue').default,
      EmptyList: require('components/Shared/ListEmpty.vue').default,
      AddClinicService: require('components/Patient/PatientPanel/AddClinicService.vue').default,
      InfoContainer: require('components/Patient/PatientPanel/InfoContainer.vue').default
  }
}
</script>

<style>

</style>
