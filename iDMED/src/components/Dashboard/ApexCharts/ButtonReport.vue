<template>
<div class="col q-ml-md">
  <q-btn color="green" @click="setServiceCode('TARV')" >
      <q-icon left size="6em" name="health_and_safety" />
       <div >Servico  {{item.code}} <br> {{this.patientTarv.length}} Pacientes Activos ao Tratamento </div>
    </q-btn>
    </div>
</template>

<script>
export default {
    props: ['serviceCode' , 'item']
}
</script>

<style>

</style>