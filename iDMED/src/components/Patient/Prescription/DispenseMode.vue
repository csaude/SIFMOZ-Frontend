<template>
  <q-banner
    dense
    inline-actions
    :class="[bgColor, headerClass]"
    class="text-white q-pa-none">
      <span class="text-bold text-subtitle1 vertical-middle q-pl-md"><slot></slot></span>
      <template v-slot:action class="items-center">
          <q-select
            class="col q-my-md"
            dense outlined
            v-model="dispenseMode"
            :options="dispenseModes"
            label="Modo de dispensa" />
      </template>
  </q-banner>
</template>

<script>
export default {
  data () {
    return {
      dispenseMode: '',
      dispenseModes: ['Farmácia Pública - Hora Normal', 'Farmácia Pública - Fora Hora Normal', 'FARMAC/Farmácia Privada', 'Distribuição Comunitária pelo Provedor de Saúde']
    }
  },
  methods: {
    submitForm () {
      this.$emit('proccedToDispense', this.dispenseMode)
    }
  }
}
</script>

<style>

</style>
