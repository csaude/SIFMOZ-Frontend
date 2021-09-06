<template>
  <div>
    <div class="row q-mt-md">
        <q-select class="col" dense outlined v-model="model" :options="options" label="Provincia" />
        <q-select class="col q-ml-md" dense outlined v-model="model" :options="options" label="Distrito" />
        <q-select class="col q-ml-md" dense outlined v-model="model" :options="options" label="Posto Administrativo" />
    </div>
    <div class="row q-mt-md">
        <q-select class="col" dense outlined v-model="model" :options="options" label="Bairo" />
        <TextInput label="Morada" dense class="col col q-ml-md" />
        <TextInput label="Ponto de Referência" dense class="col col q-ml-md" />
    </div>
  </div>
</template>

<script>
export default {
    components: {
        TextInput: require('components/Shared/Input/TextField.vue').default
    }
}
</script>

<style>

</style>
