<template>
  <div>
    <ListHeader :addVisible="false" bgColor="bg-grey-4" > Data do Registo: {{ formatDate(patientVisit.visitDate) }}</ListHeader>
    <q-card class="noRadius">
      <q-card-section class="row q-pa-none">
          <div class="col-4 bg-white q-pa-md">
          <div class="column ">
            <div class="col text-grey-9 text-weight-medium">Dados Vitais</div>
             <div class="row ">
            <div class="col text-grey-8">Peso: {{patientVisit.vitalSigns[0].weight}}</div>
            <div class="col text-grey-8">Altura: {{patientVisit.vitalSigns[0].height}}</div>
             <div class="col text-grey-8">Imc: {{Math.round(patientVisit.vitalSigns[0].imc * 100) / 100}}</div>
             <div class="col text-grey-8">Sistole: {{patientVisit.vitalSigns[0].systole}}</div>
             <div class="col text-grey-8">Diastole: {{patientVisit.vitalSigns[0].distort}}</div>
             </div>
          </div>
          </div>
           <div class="col-2 bg-white q-pa-md">
          <div class="column ">
            <div class="col text-grey-9 text-weight-medium">Rastreio TB</div>
            <div class="col text-grey-4">
            <q-btn unelevated text-color="green"  icon="search" @click=" viewTb = true"/>
            </div>
          </div>
          </div>
             <div class="col-2 bg-white q-pa-md" v-if="patient.gender === 'Feminino'">
          <div class="column ">
            <div class="col text-grey-9 text-weight-medium">R. Gravidez</div>
            <div class="col text-grey-8">
            <q-btn unelevated text-color="green" icon="search" @click=" viewPregnancy = true"/>
            </div>
          </div>
          </div>
             <div class="col-2 bg-white q-pa-md">
          <div class="column ">
            <div class="col text-grey-9 text-weight-medium">Monitoria e Reforco a Adesao</div>
            <div class="col text-grey-8">
            <q-btn unelevated text-color="green" icon="search" @click=" viewAdherence = true"/>
            </div>
          </div>
          </div>
            <div class="col-2 bg-white q-pa-md">
          <div class="column ">
            <div class="col text-grey-9 text-weight-medium">Reacoes Adversas</div>
            <div class="col text-grey-8">
             <q-btn unelevated text-color="green" icon="search" @click=" viewRam = true"/>
            </div>
          </div>
          </div>
            <div class="col-1 bg-white q-pa-md">
          <div class="column ">
            <div class="col text-grey-9 ">
            <q-btn unelevated color="orange" label="Editar"  @click="showAddPharmaceuticalAtention = true" class="float-left q-mt-md" rounded/>
            <q-btn unelevated color="red" label="Remover"    @click.stop="promptToConfirm(patientVisit)"  class="float-left q-mt-md" rounded/>
            </div>
          </div>
          </div>
      </q-card-section>
      <q-dialog persistent v-model="viewTb" full-width>
      <tbTable :selectedTbTracing="patientVisit.tbScreening[0]" :onlyView=true @close="viewTb = false"/>
      </q-dialog>
       <q-dialog persistent v-model="viewPregnancy" full-width>
      <pregnancyTable :selectedPregnancyTracing="patientVisit.pregnancyScreening[0]" :onlyView=true @close="viewPregnancy = false"/>
      </q-dialog>
       <q-dialog persistent v-model="viewAdherence" full-width>
      <adherenceTable :selectedAdherenceTracing="patientVisit.adherenceScreening[0]" :onlyView=true @close="viewAdherence = false"/>
      </q-dialog>
       <q-dialog persistent v-model="viewRam" full-width>
      <ramTable :selectedRamTracing="patientVisit.ramScreening[0]" :onlyView=true @close="viewRam = false"/>
      </q-dialog>
       <q-dialog persistent v-model="showAddPharmaceuticalAtention" full-width>
      <AddEditPharmaceuticalAtention
        :editPatientVisit="patientVisit"
        @close="showAddPharmaceuticalAtention= false" />
  </q-dialog>
    </q-card>
  </div>
</template>

<script>
import { SessionStorage, date } from 'quasar'
import Patient from '../../../store/models/patient/Patient'
import PatientServiceIdentifier from '../../../store/models/patientServiceIdentifier/PatientServiceIdentifier'
import PatientVisit from '../../../store/models/patientVisit/PatientVisit'
export default {
  props: ['patientVisit'],
  data () {
    return {
      curIdentifier: {},
      isPatientActive: false,
      showAddEpisode: false,
      selectedEpisode: {},
      showAddEditEpisode: false,
       viewTb: false,
       viewPregnancy: false,
       viewAdherence: false,
      viewRam: false,
      showAddPharmaceuticalAtention: false
    }
  },
  components: {
    ListHeader: require('components/Shared/ListHeader.vue').default,
      tbTable: require('components/Patient/PharmaceuticalAtention/TbQuestionsTable.vue').default,
       pregnancyTable: require('components/Patient/PharmaceuticalAtention/PregnancyQuestionsTable.vue').default,
        adherenceTable: require('components/Patient/PharmaceuticalAtention/MonitoringReinforcementAdherinTable.vue').default,
        ramTable: require('components/Patient/PharmaceuticalAtention/AdverseReactionQuestiosTable.vue').default,
        AddEditPharmaceuticalAtention: require('components/Patient/PharmaceuticalAtention/AddEditPharmaceuticalAtention.vue').default
       //   Dialog: require('components/Shared/Dialog/Dialog.vue').default
  },
  methods: {
    checkPatientStatusOnService () {
      if (this.curIdentifier.endDate !== '') {
        this.isPatientActive = true
      }
    },
    removePharmaceuticalAttention (patientVisit) {
            patientVisit.vitalSigns.splice(0, patientVisit.vitalSigns.length.length)
            patientVisit.tbScreening.push(0, patientVisit.tbScreening.length)
            patientVisit.pregnancyScreening.push(0, patientVisit.pregnancyScreening.length)
            patientVisit.adherenceScreening.push(0, patientVisit.adherenceScreening.length)
            patientVisit.ramScreening.push(0, patientVisit.ramScreening.length)
           if (patientVisit.patientVisitDetails.length > 0) {
             PatientVisit.apiRemove(this.patientVisit).then(resp => {
             this.displayAlert('info', 'Atencao Farmaceutica removida com sucesso.')
             }).catch(error => {
             this.displayAlert('error', error)
          })
           }
    },
     promptToConfirm (patientVisit) {
            this.$q.dialog({ title: 'Confirm', message: 'Deseja Apagar a atencao farmaceutica?', cancel: true, persistent: true }).onOk(() => {
              patientVisit.vitalSigns.splice(0, patientVisit.vitalSigns.length.length)
            patientVisit.tbScreening.push(0, patientVisit.tbScreening.length)
            patientVisit.pregnancyScreening.push(0, patientVisit.pregnancyScreening.length)
            patientVisit.adherenceScreening.push(0, patientVisit.adherenceScreening.length)
            patientVisit.ramScreening.push(0, patientVisit.ramScreening.length)
           if (patientVisit.patientVisitDetails.length >= 0) {
             PatientVisit.apiRemove(patientVisit).then(resp => {
             this.displayAlert('info', 'Atencao Farmaceutica removida com sucesso.')
             }).catch(error => {
             this.displayAlert('error', error)
          })
           } else {
              PatientVisit.apiSave(patientVisit).then(resp => {
             this.displayAlert('info', 'Atencao Farmaceutica efectuada com sucesso.')
             }).catch(error => {
             this.displayAlert('error', error)
          })
           }
        })
      },
    formatDate (dateString) {
      return date.formatDate(dateString, 'DD-MM-YYYY')
    }
  },
  computed: {
    patient () {
      return new Patient(SessionStorage.getItem('selectedPatient'))
    }
  },
  created () {
      this.curIdentifier = new PatientServiceIdentifier(this.identifier)
      this.patient = Object.assign({}, this.selectedPatient)
  }
}
</script>

<style>
  .noRadius {
    border-radius: 0px
  }
</style>
