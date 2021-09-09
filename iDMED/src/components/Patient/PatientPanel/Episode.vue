<template>
  <div>
    <ListHeader :addVisible="false" bgColor="bg-grey-4" >Data de Início: 21-01-2021 </ListHeader>
    <q-card flat bordered class="noRadius">
      <q-card-section class="row q-pa-sm">
        <div class="col-9">
          <div class="row ">
            <div class="col text-grey-9 text-weight-medium">Sector Clínico:</div>
            <div class="col text-grey-8">Atendimento Normal</div>
            <div class="col text-grey-9 text-weight-medium">Data de Início:</div>
            <div class="col text-grey-8">26/35/2013</div>
          </div>
          <div class="row ">
            <div class="col text-grey-9 text-weight-medium">Notas de Iníncio:</div>
            <div class="col text-grey-8">Novo Paciente</div>
            <div class="col text-grey-9 text-weight-medium">Data Fim:</div>
            <div class="col text-grey-8">-</div>
          </div>
        </div>
        <div class="col items-center">
          <q-btn v-if="canEdit" dense unelevated color="orange-5" label="Editar" class="float-right" />
          <div v-else class="col text-grey-9"><span>Notas de Fim:</span><span>Terminou Tratamento</span></div>
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
      canEdit: true
    }
  },
  components: {
    ListHeader: require('components/Shared/ListHeader.vue').default
  }
}
</script>

<style>

</style>
