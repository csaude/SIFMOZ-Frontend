<template>
  <div>
    <ListHeader :addVisible="false" bgColor="bg-grey-4" >Data de {{currEpisode.isStartEpisode() ? 'Início:' : 'Fim:'}} {{formatDate(currEpisode.episodeDate)}} </ListHeader>
    <q-card flat bordered class="noRadius">
      <q-card-section class="row q-pa-sm">
        <div class="col-9">
          <div class="row ">
            <div class="col text-grey-9 text-weight-medium">Sector Clínico:</div>
            <div class="col text-grey-8">{{currEpisode.clinicSector.description}}</div>
            <div class="col text-grey-9 text-weight-medium">{{currEpisode.isStartEpisode() ? 'Data de Início:' : 'Data de Fim:'}}</div>
            <div class="col text-grey-8">{{formatDate(currEpisode.episodeDate)}}</div>
          </div>
          <div class="row ">
            <div class="col-3 text-grey-9 text-weight-medium">Notas de {{currEpisode.isStartEpisode() ? 'Início: ' : 'Fim: '}}</div>
            <div class="col text-grey-8">{{currEpisode.startStopReason.reason}}</div>
          </div>
        </div>
        <div class="col items-center">
          <q-btn
            v-if="canEdit"
            @click="$emit('editEpisode', currEpisode)"
            dense unelevated
            color="orange-5"
            label="Editar"
            class="float-right" />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { date } from 'quasar'
import Episode from '../../../store/models/episode/Episode'
export default {
  props: ['episode'],
  setup () {
    return {
    }
  },
  computed: {
    currEpisode () {
      return Episode.query()
                    .withAll()
                    .where('id', this.episode.id)
                    .first()
    },
    canEdit () {
      return this.canBeEdited()
    }
  },
  methods: {
    formatDate (dateString) {
      return date.formatDate(dateString, 'DD-MM-YYYY')
    },
    canBeEdited () {
      const eps = Episode.query().withAll().where('id', this.episode.id).first()
      return !eps.hasVisits()
    }
  },
  components: {
    ListHeader: require('components/Shared/ListHeader.vue').default
  },
  created () {
      this.currEpisode = Object.assign({}, this.episode)
  }
}
</script>

<style>

</style>
