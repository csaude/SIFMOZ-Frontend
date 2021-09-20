<template>
  <div>
    <ListHeader :addVisible="false" bgColor="bg-grey-4" >Data de Início: {{currEpisode.startDate}} </ListHeader>
    <q-card flat bordered class="noRadius">
      <q-card-section class="row q-pa-sm">
        <div class="col-9">
          <div class="row ">
            <div class="col text-grey-9 text-weight-medium">Sector Clínico:</div>
            <div class="col text-grey-8">{{currEpisode.clinicSector.description}}</div>
            <div class="col text-grey-9 text-weight-medium">Data de Início:</div>
            <div class="col text-grey-8">{{currEpisode.startDate}}</div>
          </div>
          <div class="row ">
            <div class="col text-grey-9 text-weight-medium">Notas de Iníncio:</div>
            <div class="col text-grey-8">{{currEpisode.episodeType.description}}</div>
            <div class="col text-grey-9 text-weight-medium">Data Fim:</div>
            <div class="col text-grey-8">{{ currEpisode.stopDate}}</div>
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
          <div v-else class="col text-grey-9"><span>Notas de Fim:</span><span>{{ currEpisode.startStopReason.reason}}</span></div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  props: ['episode'],
  setup () {
    return {
      canEdit: true,
      currEpisode: {}
    }
  },
  methods: {

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
