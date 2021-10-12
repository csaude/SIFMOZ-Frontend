<template>
  <div>
    <ListHeader :addVisible="false" bgColor="bg-grey-4" >Data de Levantamento: {{currPack.pickupDate}} </ListHeader>
    <q-card flat bordered class="noRadius">
      <q-card-section class="row q-pa-sm">
        <div class="col-10">
          <div class="row ">
            <div class="col text-grey-9 text-weight-medium">Medicamentos:</div>
            <div class="col text-grey-8"></div>
            <div class="col text-grey-9 text-weight-medium">Quantidade:</div>
            <div class="col text-grey-8"></div>
          </div>
          <div class="row ">
            <div class="col text-grey-9 text-weight-medium"></div>
            <div class="col text-grey-8"></div>
            <div class="col text-grey-9 text-weight-medium">Proximo Levantamento:</div>
            <div class="col text-grey-8"></div>
          </div>
        </div>
        <div class="col items-center">
          <q-btn
            v-if="canEdit"
            @click="$emit('editPack', currPack)"
            dense unelevated
            color="orange-5"
            label="Refazer"
            class="float-right" />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  props: ['pack'],
  setup () {
    return {
      canEdit: true,
      currPack: {}
    }
  },
  methods: {

  },
  components: {
    ListHeader: require('components/Shared/ListHeader.vue').default
  },
  created () {
      this.currPack = Object.assign({}, this.pack)
  }
}
</script>

<style>

</style>
