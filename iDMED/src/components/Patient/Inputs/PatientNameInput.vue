<template>
    <q-input
        outlined
        label="Nome"
        dense
        ref="nome"
        class="col"
        :value="firstName"
        @input="(event) => $emit('update:firstName', event.target.value)"
        :rules="[ val => !!val || 'Por favor indicar o nome']"
        lazy-rules/>
</template>

<script>
export default {
    props: ['firstName']
}
</script>

<style>

</style>
