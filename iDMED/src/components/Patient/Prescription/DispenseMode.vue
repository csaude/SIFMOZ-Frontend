<template>
  <q-card style="width: 800px; max-width: 90vw;">
    <form @submit.prevent="submitForm" >
        <q-card-section class="q-pa-none">
          <div class="q-mt-md q-mb-sm">
            <div class="row items-center q-mb-sm q-pa-sm">
                <span class="text-subtitle2">
                Modo de Dispensa</span>
            </div>
            <q-separator color="grey-13" size="1px" class="q-mb-sm"/>
          </div>
          <div class="q-px-md">
            <q-select
              class="col q-my-md"
              dense outlined
              v-model="dispenseMode"
              :options="dispenseModes"
              label="Modo de dispensa" />
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-my-md q-mr-sm">
            <q-btn label="Cancelar" color="red" @click="$emit('close')"/>
            <q-btn type="submit" label="Dispensar" color="primary" />
        </q-card-actions>
      </form>
    </q-card>
</template>

<script>
export default {
  data () {
    return {
      dispenseMode: '',
      dispenseModes: ['Dispensa na Comunidade']
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
