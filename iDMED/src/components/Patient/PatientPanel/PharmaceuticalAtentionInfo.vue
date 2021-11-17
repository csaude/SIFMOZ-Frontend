<template>
  <div>
    <ListHeader
      :addVisible="showAddButton"
      :mainContainer="true"
      bgColor="bg-primary"
      @expandLess="expandLess"
      @showAdd="showAddPharmaceuticalAtention = true">
      Atenção Farmacêutica
    </ListHeader>
    <EmptyList v-if="lastPatientVisit === null" >Nenhuma Atenção Farmacêutica Adicionada</EmptyList>
    <div v-if="infoVisible && lastPatientVisit !== null" >
     <span>
        <PharmaceuticalAtentionContainer
          :selectedPatientVisit="lastPatientVisit"/>
      </span>
    </div>
    <q-dialog persistent v-model="showAddPharmaceuticalAtention">
      <AddEditPharmaceuticalAtention
        @close="showAddPharmaceuticalAtention= false"
       :editMode=false />
  </q-dialog>
  </div>
</template>

<script>
import { SessionStorage } from 'quasar'
import Patient from '../../../store/models/patient/Patient'
import PatientVisit from '../../../store/models/patientVisit/PatientVisit'
export default {
  props: ['selectedPatient'],
  data () {
    return {
      showAddPharmAttention: false,
      infoVisible: true,
      showAddPharmaceuticalAtention: false
    }
  },
  methods: {
    expandLess (value) {
      this.infoVisible = true
    }
  },
  created () {
  },
  computed: {
    patient () {
      return new Patient(SessionStorage.getItem('selectedPatient'))
    },
    lastPatientVisit () {
      return PatientVisit.query()
                          .where('patient_id', this.selectedPatient.id)
                          .has('clinic')
                          .has('vitalSigns')
                          .orderBy('visitDate', 'desc')
                          .first()
    },
    showAddButton () {
      return this.selectedPatient.identifiers.length > 0
    }
  },
  components: {
      ListHeader: require('components/Shared/ListHeader.vue').default,
      EmptyList: require('components/Shared/ListEmpty.vue').default,
      AddEditPharmaceuticalAtention: require('components/Patient/PharmaceuticalAtention/AddEditPharmaceuticalAtention.vue').default,
      PharmaceuticalAtentionContainer: require('components/Patient/PharmaceuticalAtention/PharmaceuticalAtentionContainer.vue').default
  }
}
</script>

<style>

</style>
