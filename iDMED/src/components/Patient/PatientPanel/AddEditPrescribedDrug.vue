<template>
  <q-card style="width: 800px; max-width: 90vw;">
      <q-card-section class="q-pa-none">
        <div class="q-mt-md q-mb-lg">
          <div class="row items-center q-mb-sm q-pa-sm">
              <span class="text-subtitle2">Adicção de Medicamentos para {{visitDetails.episode.patientProgramIdentifier.clinicalService.description}}</span>
          </div>
          <q-separator color="grey-13" size="1px" class="q-mb-sm"/>
        </div>
        <div class="q-px-md">
          <q-select
            class="col q-mb-md"
            dense outlined
            :options="options"
            option-value="code"
            option-label="description"
            label="Medicamento" />
        <div class="row">
          <q-select
            class="col"
            dense outlined
            :options="options"
            option-value="code"
            option-label="description"
            label="Toma" />
          <q-select
            class="col q-ml-md"
            dense outlined
            :options="options"
            option-value="code"
            option-label="description"
            label="Forma" />
          <q-select
            class="col q-ml-md"
            dense outlined
            :options="options"
            option-value="code"
            option-label="description"
            label="Período" />
        </div>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-my-md q-mr-sm">
          <q-btn label="Cancelar" color="red" @click="$emit('close')"/>
          <q-btn type="submit" label="Adicionar" color="primary" />
      </q-card-actions>
    </q-card>
</template>

<script>
export default {
  props: ['visitDetails'],
  data () {
    return {
      currVisitDetails: {}
    }
  },
  created () {
      this.currVisitDetails = Object.assign({}, this.visitDetails)
  }
}
</script>

<style>

</style>
