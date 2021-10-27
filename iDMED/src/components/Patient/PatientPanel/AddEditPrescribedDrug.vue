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
              label="Toma" />
            <TextInput v-model="prescribedDrug.timesPerDay" label="Forma" suffix="Vezes" dense class="col q-ml-md" />
            <q-select
              class="col q-ml-md"
              dense outlined
              v-model="prescribedDrug.form"
              :options="timesPerDay"
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
      showOnlyOfRegimen: false,
      amtPerTimes: ['1', '2', '3', '4'],
      timesPerDay: ['Dia', 'Semana', 'Mês', 'Ano']
    }
  },
  methods: {
    submitForm () {
      this.$emit('addPrescribedDrug', this.prescribedDrug)
    },
    getDrugs () {
      return Drug.query().with('form').get()
    }
  },
  computed: {
    drugs () {
      return this.getDrugs()
    },
    regimenDrugs () {
      return Drug.query().where('')
    }
  },
  mounted () {
      this.showOnlyOfRegimen = this.hasTherapeuticalRegimen
  },
  created () {
      this.currVisitDetails = Object.assign({}, this.visitDetails)
  },
  components: {
    TextInput: require('components/Shared/Input/TextField.vue').default
  }
}
</script>

<style>

</style>
