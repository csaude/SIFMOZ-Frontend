<template>
  <div>
    <ListHeader :addVisible="false" :bgColor="clinicalServiceHeaderColor" >{{ (curIdentifier.service === null || curIdentifier.service === undefined) ? 'Sem Info' : curIdentifier.service.code }} </ListHeader>
    <q-card class="noRadius">
      <q-card-section class="row q-pa-none">
        <div class="col-5 bg-white q-pa-md">
          <div class="row ">
            <div class="col-4 text-grey-9 text-weight-medium">Serviço de Saúde:</div>
            <div class="col text-grey-8">{{ (curIdentifier.service === null || curIdentifier.service === undefined) ? 'Sem Info' : curIdentifier.service.description  }}</div>
          </div>
          <div class="row ">
            <div class="col-4 text-grey-9 text-weight-medium">Data de Admissão:</div>
            <div class="col text-grey-8">{{ formatDate(curIdentifier.startDate) }}</div>
          </div>
          <div class="row ">
            <div class="col-4 text-grey-9 text-weight-medium">Nr Identificador:</div>
            <div class="col text-grey-8">{{ curIdentifier.value }}</div>
          </div>
          <div v-show="showEndDetails" class="row ">
            <div class="col-4 text-grey-9 text-weight-medium">Data Fim:</div>
            <div class="col text-grey-8">{{ formatDate(curIdentifier.endDate) }}</div>
          </div>
          <div v-show="showEndDetails" class="row ">
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
            <q-btn v-if="!showEndDetails" unelevated color="orange-5" label="Editar" @click="editClinicService()" class="float-right" />
            <q-btn v-if="!showEndDetails" unelevated color="red" label="Fechar" @click="$emit('closeClinicService', curIdentifier)" class="float-right q-ml-sm" />
            <q-btn v-if="showEndDetails" unelevated color="blue" label="Reabrir" @click="$emit('reopenClinicService', curIdentifier)" class="float-right q-ml-sm" />
          </div>
        </div>
        <div class="col q-py-md">
          <ListHeader :addVisible="!showEndDetails" bgColor="bg-primary" @showAdd="showAddEditEpisode = true, step='create'">Episódios</ListHeader>
          <EmptyList v-if="curIdentifier.episodes.length <= 0" >Nenhum Episódio Iniciado</EmptyList>
          <span
            v-for="episode in episodes" :key="episode.id" >
            <Episode
              @editEpisode="editEpisode"
              @removeEpisode="removeEpisode"
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
          :stepp="step"
          @close="showAddEditEpisode = false" />
    </q-dialog>
    <q-dialog v-model="alert.visible">
      <Dialog :type="alert.type" @closeDialog="closeDialog">
        <template v-slot:title> Informação</template>
        <template v-slot:msg> {{alert.msg}} </template>
      </Dialog>
    </q-dialog>
  </div>
</template>

<script>
import { ref } from 'vue'
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
      alert: ref({
        type: '',
        visible: false,
        msg: ''
      }),
      isPatientActive: false,
      showAddEpisode: false,
      selectedEpisode: new Episode(),
      showAddEditEpisode: false,
      step: ''
    }
  },
  components: {
    ListHeader: require('components/Shared/ListHeader.vue').default,
    EmptyList: require('components/Shared/ListEmpty.vue').default,
    Episode: require('components/Patient/PatientPanel/Episode.vue').default,
    Dialog: require('components/Shared/Dialog/Dialog.vue').default,
    AddEditEpisode: require('components/Patient/PatientPanel/AddEditEpisode.vue').default
  },
  methods: {
    init () {
      PatientServiceIdentifier.apiFetchById(this.curIdentifier.id)
      Episode.apiGetAllByIdentifierId(this.curIdentifier.id)
    },
    checkPatientStatusOnService () {
      if (this.curIdentifier.endDate !== '') {
        this.isPatientActive = true
      }
    },
    editClinicService () {
      if (!this.canEdit) {
        this.displayAlert('error', 'Não pode fazer alterações sobre este serviço de saúde pois o mesmo ja possui registos de visitas do paciente/utente associados.')
      } else {
        this.$emit('editClinicService', this.curIdentifier)
      }
    },
    editEpisode (episode) {
      const eps = Episode.query().withAll().where('id', episode.id).first()
      if (eps.hasVisits()) {
        this.displayAlert('error', 'Não pode fazer alterações sobre este episódio pois o mesmo ja possui registos de visitas do paciente/utente associados.')
      } else {
        this.step = 'edit'
        this.selectedEpisode = Object.assign({}, episode)
        this.showAddEditEpisode = true
      }
    },
    removeEpisode (episode) {
      const eps = Episode.query().withAll().where('id', episode.id).first()
      if (eps.hasVisits()) {
        this.displayAlert('error', 'Não pode remover este episódio pois o mesmo ja possui registos de visitas do paciente/utente associados.')
      } else {
        Episode.apiRemove(episode).then(resp => {
          Episode.delete(episode.id)
          const i = this.curIdentifier.episodes.map(toRemove => toRemove.id).indexOf(episode.id) // find index of your object
          this.curIdentifier.splice(i, 1)
        }).catch(error => {
          const listErrors = []
          if (error.request.response != null) {
            const arrayErrors = JSON.parse(error.request.response)
            if (arrayErrors.total == null) {
              listErrors.push(arrayErrors.message)
            } else {
              arrayErrors._embedded.errors.forEach(element => {
                listErrors.push(element.message)
              })
            }
          }
          this.displayAlert('error', listErrors)
        })
      }
    },
    formatDate (dateString) {
      return date.formatDate(dateString, 'DD-MM-YYYY')
    },
    canEditIdentifier () {
      const identifier = PatientServiceIdentifier.query()
                                                .with('episodes.patientVisitDetails')
                                                .where('id', this.identifier.id)
                                                .first()
      return identifier.canBeEdited()
    },
    displayAlert (type, msg) {
      this.alert.type = type
      this.alert.msg = msg
      this.alert.visible = true
    },
    closeDialog () {
      this.alert.visible = false
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    identifiers: {
      get () {
        return this.selectedPatient.identifiers
      }
    },
    /*
    curIdentifier: {
      get () {
        return PatientServiceIdentifier.query()
                                      .with('identifierType')
                                      .with('service')
                                      .with('episodes.*', (query) => {
                                              query.orderBy('creationDate', 'desc')
                                            })
                                      .where('id', this.identifier.id).first()
    }
      }, */
      curIdentifier: {
        get () {
          return PatientServiceIdentifier.query()
                                      .with('identifierType')
                                      .with('service')
                                      .with('episodes.*', (query) => {
                                              query.orderBy('creationDate', 'desc')
                                            })
                                      .where('id', this.identifier.id).first()
        }
      },
      /*
    curIdentifier () {
      return PatientServiceIdentifier.query()
                                      .with('identifierType')
                                      .with('service')
                                      .with('episodes.*', (query) => {
                                              query.orderBy('creationDate', 'desc')
                                            })
                                      .where('id', this.identifier.id).first()
    },
    */
    clinicalServiceHeaderColor () {
      if (!this.showEndDetails) {
        return 'bg-grey-4'
      } else {
        return 'bg-red-7'
      }
    },
    episodes: {
      get () {
          const episodes = Episode.query()
                                .withAll()
                                .with('episodeType')
                                .with('clinicSector')
                                .where('patientServiceIdentifier_id', this.curIdentifier.id)
                                .orderBy('creationDate', 'desc')
                                .limit(2)
                                .get()
        if (episodes.length > 0) {
          episodes[0].isLast = true
        }
        return episodes
      }
    },
    /*
    episodes () {
      const episodes = Episode.query()
                              .withAll()
                              .where('patientServiceIdentifier_id', this.curIdentifier.id)
                              .orderBy('creationDate', 'desc')
                              .limit(2)
                              .get()
      if (episodes.length > 0) {
        episodes[0].isLast = true
      }
      return episodes
    }, */
    services: {
      get () {
        return ClinicalService.query().hasNot('code').get()
      }
    },
    /*
    services () {
      return ClinicalService.query().hasNot('code').get()
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
    },
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
    }, */
    episodeTypes: {
      get () {
        return EpisodeType.all()
      }
    },
    /*
    episodeTypes () {
      return EpisodeType.all()
    }, */
    lastEpisode: {
      get () {
        return Episode.query()
                    .withAll()
                    .where('patientServiceIdentifier_id', this.curIdentifier.id)
                    .orderBy('creationDate', 'desc')
                    .first()
      }
    },
    /*
    lastEpisode () {
      return Episode.query()
                    .withAll()
                    .where('patientServiceIdentifier_id', this.curIdentifier.id)
                    .orderBy('creationDate', 'desc')
                    .first()
    }, */
    showEndDetails () {
      return this.lastEpisode !== null && this.lastEpisode.isCloseEpisode()
    },
    canEdit () {
      return this.canEditIdentifier()
    }
  },
  created () {
    PatientServiceIdentifier.apiGetAllByPatientId(SessionStorage.getItem('selectedPatient').id)
  }
}
</script>

<style>
  .noRadius {
    border-radius: 0px
  }
</style>
