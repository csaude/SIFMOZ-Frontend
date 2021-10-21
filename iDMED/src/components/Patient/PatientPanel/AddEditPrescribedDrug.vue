<template>
  <q-card style="width: 800px; max-width: 90vw;">
    <form @submit.prevent="submitForm" >
        <q-card-section class="q-pa-none">
          <div class="q-mt-md q-mb-sm">
            <div class="row items-center q-mb-sm q-pa-sm">
                <span class="text-subtitle2">Adicção de Medicamentos para {{visitDetails.episode.patientServiceIdentifier.service.description}}</span>
            </div>
            <q-separator color="grey-13" size="1px" class="q-mb-sm"/>
          </div>
          <div class="q-px-md">
            <q-toggle
              v-if="hasTherapeuticalRegimen"
              v-model="showOnlyOfRegimen"
              label="Visualizar apenas os medicamentos do regime selecionado" />
            <q-select
              class="col q-my-md"
              dense outlined
              v-model="prescribedDrug.drug"
              :options="drugs"
              option-value="id"
              option-label="name"
              label="Medicamento" />
          <div class="row">
            <q-select
              class="col"
              dense outlined
              v-model="prescribedDrug.amtPerTime"
              :options="amtPerTimes"
              option-value="code"
              option-label="description"
              label="Toma" />
            <q-select
              class="col q-ml-md"
              dense outlined
              :options="forms"
              v-model="prescribedDrug.form"
              option-value="code"
              option-label="description"
              label="Forma" />
            <q-select
              class="col q-ml-md"
              dense outlined
              v-model="prescribedDrug.timesPerDay"
              :options="timesPerDay"
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
      </form>
    </q-card>
</template>

<script>
import Drug from '../../../store/models/drug/Drug'
import PrescribedDrug from '../../../store/models/prescriptionDrug/PrescribedDrug'
export default {
  props: ['visitDetails', 'hasTherapeuticalRegimen'],
  data () {
    return {
      currVisitDetails: {},
      prescribedDrug: new PrescribedDrug(),
      showOnlyOfRegimen: true
    }
  },
  methods: {
    submitForm () {
      this.$emit('addPrescribedDrug', this.prescribedDrug)
    },
    getDrugs () {
      if (this.showOnlyOfRegimen) {
        return Drug.query().with('regimen_drugs', (query) => {
          query.where('id', this.currVisitDetails.prescription.prescriptionDetail.therapeuticRegimen.id)
        }).get()
      } else {
        return Drug.all()
      }
    }
  },
  computed: {
    drugs () {
      return this.getDrugs()
    }
  },
  created () {
      this.currVisitDetails = Object.assign({}, this.visitDetails)
      this.showOnlyOfRegimen = this.hasTherapeuticalRegimen
  }
}
</script>

<style>

</style>
