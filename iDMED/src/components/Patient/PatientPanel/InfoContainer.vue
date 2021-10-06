<template>
  <div>
    <ListHeader :addVisible="false" bgColor="bg-grey-4" >{{ curIdentifier.clinicalService.description }} </ListHeader>
    <q-card class="noRadius">
      <q-card-section class="row q-pa-none">
        <div class="col-5 bg-white q-pa-md">
          <div class="row ">
            <div class="col text-grey-9 text-weight-medium">Serviço de Saúde:</div>
            <div class="col text-grey-8">{{ curIdentifier.clinicalService.description }}</div>
            <div class="col text-grey-9 text-weight-medium">Data de Admissão:</div>
            <div class="col text-grey-8">{{ curIdentifier.startDate }}</div>
          </div>
          <div class="row ">
            <div class="col text-grey-9 text-weight-medium">Nr Identificador:</div>
            <div class="col text-grey-8">{{ curIdentifier.value }}</div>
            <div class="col text-grey-10"></div>
            <div class="col text-grey-10"></div>
          </div>
          <div class="row ">
            <div class="col text-grey-9 text-weight-medium">Data Fim:</div>
            <div class="col text-grey-8">{{ curIdentifier.endDate }}</div>
            <div class="col text-grey-9 text-weight-medium">Notas de Fim:</div>
            <div class="col text-grey-8">{{ curIdentifier.clinicalService.description }}</div>
          </div>
          <div class="row ">
            <div class="col text-grey-9 text-weight-medium">Estado:</div>
            <div class="col text-grey-8">{{ !isPatientActive ? 'Activo no Serviço' : 'Curado'}}</div>
            <div class="col text-grey-9 text-weight-medium"></div>
            <div class="col text-grey-8"></div>
          </div>
          <q-separator/>
          <div class="row q-my-md">
            <q-space/>
            <q-btn v-if="curIdentifier.endDate === ''" unelevated color="orange-5" label="Editar" @click="$emit('editClinicService', curIdentifier)" class="float-right" />
            <q-btn v-if="curIdentifier.endDate === ''" unelevated color="red" label="Fechar" class="float-right q-ml-sm" />
            <q-btn v-if="curIdentifier.endDate !== ''" unelevated color="blue" label="Reabrir" class="float-right q-ml-sm" />
          </div>
        </div>
        <div class="col q-py-md">
          <ListHeader :addVisible="true" bgColor="bg-primary" @showAdd="showAddEpisode = true">Episódios</ListHeader>
          <EmptyList v-if="curIdentifier.episodes.length <= 0" >Nenhum Episódio Iniciado</EmptyList>
          <span
            v-for="episode in curIdentifier.episodes" :key="episode.id" >
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
          :curIdentifier="identifier"
          :selectedPatient="selectedPatient"
          @close="showAddEditEpisode = false" />
    </q-dialog>
  </div>
</template>

<script>
export default {
  props: ['identifier', 'selectedPatient'],
  data () {
    return {
      curIdentifier: {},
      isPatientActive: false,
      showAddEpisode: false,
      patient: {},
      selectedEpisode: {},
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
    }
  },
  created () {
      this.curIdentifier = Object.assign({}, this.identifier)
      this.patient = Object.assign({}, this.selectedPatient)
  }
}
</script>

<style>
  .noRadius {
    border-radius: 0px
  }
</style>
