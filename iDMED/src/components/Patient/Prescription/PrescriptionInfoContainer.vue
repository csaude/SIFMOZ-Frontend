<template>
  <div>
    <ListHeader :addVisible="false" bgColor="bg-grey-4" >{{ identifier.service.code }} </ListHeader>
    <q-card
      v-if="curIdentifier.lastVisit() !== null"
      class="noRadius">
      <q-card-section class="row q-pa-none">
        <div class="col-5 bg-white q-pa-md">
          <div class="row ">
            <div class="col text-grey-9 text-weight-medium">Regime Terapêutico:</div>
            <div class="col text-grey-8">{{ curIdentifier.lastVisit().prescription.prescriptionDetail.therapeuticRegimen.description }}</div>
            <div class="col text-grey-9 text-weight-medium">Tipo Paciente:</div>
            <div class="col text-grey-8">Manutenção</div>
          </div>
          <div class="row ">
            <div v-if="curIdentifier.lastVisit().prescription.prescriptionDetail.therapeuticLine !== null" class="col text-grey-9 text-weight-medium">Linha Terapêutica:</div>
            <div v-if="curIdentifier.lastVisit().prescription.prescriptionDetail.therapeuticLine !== null" class="col text-grey-8">{{ curIdentifier.lastVisit().prescription.prescriptionDetail.therapeuticLine.description }}</div>
            <div class="col text-grey-10">Clínico:</div>
            <div class="col text-grey-10">Generico</div>
          </div>
          <div class="row ">
            <div class="col text-grey-9 text-weight-medium">Tipo Dispensa:</div>
            <div class="col text-grey-8">{{ curIdentifier.lastVisit().prescription.prescriptionDetail.dispenseType.description }}</div>
            <div class="col text-grey-9 text-weight-medium">Validade:</div>
            <div class="col text-grey-8">{{ curIdentifier.lastVisit().prescription.duration }}</div>
          </div>
          <div class="row ">
            <div class="col text-grey-9 text-weight-medium">Duração:</div>
            <div class="col text-grey-8">{{ curIdentifier.lastVisit().prescription.duration }}</div>
            <div class="col text-grey-9 text-weight-medium"></div>
            <div class="col text-grey-8"></div>
          </div>
          <q-separator/>
          <div class="row q-my-md">
            <q-space/>
            <q-btn v-if="curIdentifier.endDate === ''" unelevated color="red" label="Remover" class="float-right q-ml-sm" />
          </div>
        </div>
        <div class="col q-py-md">
          <ListHeader :addVisible="true" bgColor="bg-primary" @showAdd="showAddEpisode = true">Dispensa</ListHeader>
          <EmptyList v-if="curIdentifier.episodes.length <= 0" >Nenhum registo de Levantamentos</EmptyList>
          <span>
            <PackInfo
              @editPack="editPack"
              :pack="curIdentifier.lastVisit().pack"/>
          </span>
        </div>
      </q-card-section>
    </q-card>
    <EmptyList v-else >Nenhuma Prescrição Adicionada para o serviço {{identifier.service.code}}</EmptyList>
  </div>
</template>

<script>
import { SessionStorage } from 'quasar'
import Patient from '../../../store/models/patient/Patient'
import PatientServiceIdentifier from '../../../store/models/patientServiceIdentifier/PatientServiceIdentifier'
export default {
  props: ['identifier'],
  data () {
    return {
      curIdentifier: {},
      isPatientActive: false,
      showAddEpisode: false,
      selectedEpisode: {},
      showAddEditEpisode: false
    }
  },
  components: {
    ListHeader: require('components/Shared/ListHeader.vue').default,
    EmptyList: require('components/Shared/ListEmpty.vue').default,
    PackInfo: require('components/Patient/Prescription/PackInfo.vue').default
  },
  methods: {
    checkPatientStatusOnService () {
      if (this.curIdentifier.endDate !== '') {
        this.isPatientActive = true
      }
    },
    editPack (episode) {
      this.selectedEpisode = Object.assign({}, episode)
      this.showAddEditEpisode = true
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
