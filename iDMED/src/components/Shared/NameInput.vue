<template>
      <q-input
        outlined
        label="Nome"
        dense
        ref="nome"
        class="col"
        :value="name"
        @input="(event) => $emit('update:name', event.target.value)"
        :rules="[ val => !!val || 'Por favor indicar o nome']"
        lazy-rules/>
</template>

<script>
export default {
    props: ['name']
}
</script>

<style>

</style>
