<template>
  <div>
    <ListHeader :addVisible="false" bgColor="bg-grey-4" >{{ curIdentifier.service.code }} </ListHeader>
    <q-card class="noRadius">
      <q-card-section class="row q-pa-none">
        <div class="col-5 bg-white q-pa-md">
          <div class="row ">
            <div class="col-4 text-grey-9 text-weight-medium">Serviço de Saúde:</div>
            <div class="col text-grey-8">{{ curIdentifier.service.description }}</div>
          </div>
          <div class="row ">
            <div class="col-4 text-grey-9 text-weight-medium">Data de Admissão:</div>
            <div class="col text-grey-8">{{ formatDate(curIdentifier.startDate) }}</div>
          </div>
          <div class="row ">
            <div class="col-4 text-grey-9 text-weight-medium">Nr Identificador:</div>
            <div class="col text-grey-8">{{ curIdentifier.value }}</div>
          </div>
          <div class="row ">
            <div class="col-4 text-grey-9 text-weight-medium">Data Fim:</div>
            <div class="col text-grey-8">{{ formatDate(curIdentifier.endDate) }}</div>
          </div>
          <div class="row ">
            <div class="col-4 text-grey-9 text-weight-medium">Notas de Fim:</div>
            <div class="col text-grey-8">{{lastEpisode !== null && lastEpisode.isCloseEpisode() ? lastEpisode.startStopReason.reason : ''}}</div>
          </div>
          <div class="row ">
            <div class="col-4 text-grey-9 text-weight-medium">Estado:</div>
            <div class="col text-grey-8">{{ !isPatientActive ? 'Activo no Serviço' : 'Curado'}}</div>
          </div>
          <q-separator/>
          <div class="row q-my-md">
            <q-space/>
            <q-btn v-if="curIdentifier.endDate === ''" unelevated color="orange-5" label="Editar" @click="$emit('editClinicService', curIdentifier)" class="float-right" />
            <q-btn v-if="curIdentifier.endDate === ''" unelevated color="red" label="Fechar" @click="$emit('closeClinicService', curIdentifier)" class="float-right q-ml-sm" />
            <q-btn v-if="curIdentifier.endDate !== ''" unelevated color="blue" label="Reabrir" @click="$emit('reopenClinicService', curIdentifier)" class="float-right q-ml-sm" />
          </div>
        </div>
        <div class="col q-py-md">
          <ListHeader :addVisible="true" bgColor="bg-primary" @showAdd="showAddEditEpisode = true">Episódios</ListHeader>
          <EmptyList v-if="curIdentifier.episodes.length <= 0" >Nenhum Episódio Iniciado</EmptyList>
          <span
            v-for="episode in episodes" :key="episode.id" >
            <Episode
              @editEpisode="editEpisode"
              :episode="episode"/>
          </span>
        </div>
      </q-card-section>
    </q-card>
    <q-dialog persistent v-model="showAddEditEpisode">
        <AddEditEpisode
          :episodeToEdit="selectedEpisode"
          :curIdentifier="curIdentifier"
          :selectedPatient="selectedPatient"
          @close="showAddEditEpisode = false" />
    </q-dialog>
  </div>
</template>

<script>
import { SessionStorage, date } from 'quasar'
import Patient from '../../../store/models/patient/Patient'
import PatientServiceIdentifier from '../../../store/models/patientServiceIdentifier/PatientServiceIdentifier'
import Episode from '../../../store/models/episode/Episode'
import EpisodeType from '../../../store/models/episodeType/EpisodeType'
import ClinicalService from '../../../store/models/ClinicalService/ClinicalService'
export default {
  props: ['identifier', 'selectedPatient'],
  data () {
    return {
      isPatientActive: false,
      showAddEpisode: false,
      selectedEpisode: new Episode(),
      showAddEditEpisode: false
    }
  },
  components: {
    ListHeader: require('components/Shared/ListHeader.vue').default,
    EmptyList: require('components/Shared/ListEmpty.vue').default,
    Episode: require('components/Patient/PatientPanel/Episode.vue').default,
    AddEditEpisode: require('components/Patient/PatientPanel/AddEditEpisode.vue').default
  },
  methods: {
    checkPatientStatusOnService () {
      if (this.curIdentifier.endDate !== '') {
        this.isPatientActive = true
      }
    },
    editEpisode (episode) {
      this.selectedEpisode = Object.assign({}, episode)
      this.showAddEditEpisode = true
    },
    formatDate (dateString) {
      return date.formatDate(dateString, 'DD-MM-YYYY')
    }
  },
  computed: {
    curIdentifier () {
      return PatientServiceIdentifier.query()
                                      .with('identifierType')
                                      .with('service')
                                      .with('episodes.*', (query) => {
                                              query.orderBy('creationDate', 'desc')
                                            })
                                      .where('id', this.identifier.id).first()
    },
    episodes () {
      return Episode.query()
                    .withAll()
                    .where('patientServiceIdentifier_id', this.curIdentifier.id)
                    .orderBy('creationDate', 'desc')
                    .get()
    },
    services () {
      return ClinicalService.query().hasNot('code').get()
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
                            .with('clinic').where('id', selectedP.id).first()
    },
    episodeTypes () {
      return EpisodeType.all()
    },
    lastEpisode () {
      return Episode.query()
                    .withAll()
                    .where('patientServiceIdentifier_id', this.curIdentifier.id)
                    .orderBy('creationDate', 'desc')
                    .first()
    }
  },
  created () {
  }
}
</script>

<style>
  .noRadius {
    border-radius: 0px
  }
</style>
