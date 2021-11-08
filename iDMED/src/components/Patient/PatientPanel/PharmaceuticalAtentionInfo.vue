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
    <EmptyList v-if="patientVisits.length <= 0" >Nenhuma Atenção Farmacêutica Adicionada</EmptyList>
    <div v-show="infoVisible" >
     <span
        v-for="patientVisit in patientVisits" :key="patientVisit.id" >
        <PharmaceuticalAtentionContainer
          :patientVisit="patientVisit"/>
      </span>
    </div>
    <q-dialog persistent v-model="showAddPharmaceuticalAtention" full-width>
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
      this.infoVisible = value
    }
  },
  created () {
  },
  computed: {
    patient () {
      return new Patient(SessionStorage.getItem('selectedPatient'))
    },
    patientVisits () {
      const patientVis = PatientVisit.query().with('patient.*')
                          .with('vitalSigns')
                          .with('tbScreening')
                          .with('pregnancyScreening')
                          .with('adherenceScreening')
                          .with('ramScreening')
                          .with('patientVisitDetails')
                          .with('clinic').where('patient_id', this.selectedPatient.id).has('clinic').has('vitalSigns').get()
                          return patientVis
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
