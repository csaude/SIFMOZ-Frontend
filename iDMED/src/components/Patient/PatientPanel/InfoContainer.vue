<template>
  <div>
    <ListHeader :addVisible="false" bgColor="bg-grey-4" >TARV </ListHeader>
    <q-card class="noRadius">
      <q-card-section class="row q-pa-none">
        <div class="col-5 bg-white q-pa-md">
          <div class="row ">
            <div class="col text-grey-9 text-weight-medium">Serviço de Saúde:</div>
            <div class="col text-grey-8">TARV</div>
            <div class="col text-grey-9 text-weight-medium">Data de Admissão:</div>
            <div class="col text-grey-8">26/35/2013</div>
          </div>
          <div class="row ">
            <div class="col text-grey-9 text-weight-medium">Nr Identificador:</div>
            <div class="col text-grey-8">0120010101/0203/00365</div>
            <div class="col text-grey-10"></div>
            <div class="col text-grey-10"></div>
          </div>
          <div class="row ">
            <div class="col text-grey-9 text-weight-medium">Data Fim:</div>
            <div class="col text-grey-8">28/06/2021</div>
            <div class="col text-grey-9 text-weight-medium">Notas de Fim:</div>
            <div class="col text-grey-8">-</div>
          </div>
          <div class="row ">
            <div class="col text-grey-9 text-weight-medium">Estado:</div>
            <div class="col text-grey-8">Activo</div>
            <div class="col text-grey-9 text-weight-medium"></div>
            <div class="col text-grey-8"></div>
          </div>
          <q-separator/>
          <div class="row q-my-md">
            <q-space/>
            <q-btn unelevated color="orange-5" label="Editar" class="float-right" />
            <q-btn unelevated color="red" label="Fechar" class="float-right q-ml-sm" />
          </div>
        </div>
        <div class="col q-py-md">
          <ListHeader :addVisible="true" bgColor="bg-primary" @showAdd="showAddClinicService = true">Episódio</ListHeader>
          <Episode/>
          <Episode/>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  components: {
    ListHeader: require('components/Shared/ListHeader.vue').default,
    Episode: require('components/Patient/PatientPanel/Episode.vue').default
  }
}
</script>

<style>
  .noRadius {
    border-radius: 0px
  }
</style>
