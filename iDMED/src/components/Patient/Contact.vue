<template>
  <div class="row q-mt-md">
    <PhoneField dense label="Principal"/>
    <PhoneField dense label="Alternativo" class="q-ml-md"/>
  </div>
</template>

<script>
export default {
    components: {
        PhoneField: require('components/Shared/Input/PhoneField.vue').default
    }
}
</script>

<style>

</style>
