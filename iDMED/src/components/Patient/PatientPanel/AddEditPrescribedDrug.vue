<template>
  <q-card style="width: 800px; max-width: 90vw;">
    <form @submit.prevent="submitForm" >
        <q-card-section class="q-pa-none">
          <div class="q-pt-md q-mb-sm bg-green-2">
            <div class="row items-center q-mb-sm q-pa-sm">
              <q-icon  name="medication" size="md" color="green-10"/>
              <span class="text-subtitle2 q-ml-sm">Adição de Medicamentos para {{visitDetails.episode.patientServiceIdentifier.service.description}}</span>
            </div>
            <q-separator color="grey-13" size="1px" class="q-mb-sm"/>
          </div>
          <div class="q-px-md">
            <q-toggle
              v-model="showOnlyOfRegimen"
              v-if="hasTherapeuticalRegimen"
              label="Visualizar apenas os medicamentos do regime selecionado" />
            <q-select
              class="col q-my-md"
              dense outlined
              ref="drug"
              :rules="[ val => !!val || 'Por favor indicar o medicamento.']"
              v-model="prescribedDrug.drug"
              @blur="loadDefaultParameters"
              :options="drugs"
              option-value="id"
              option-label="name"
              label="Medicamento" />
          <div class="row">
            <q-select
              class="col"
              dense outlined
              ref="amtPerTime"
              :rules="[ val => !!val || 'Por favor indicar a quantidade a tomar de cada vez.']"
              v-model="prescribedDrug.amtPerTime"
              :options="amtPerTimes"
              label="Toma" />
              <TextInput  v-if="prescribedDrug.drug"
              :disable="true"
              v-model="prescribedDrug.drug.form.description"
              label="Forma Farmacêutica"
              dense
              class="col q-ml-md" />
            <TextInput
              v-model="prescribedDrug.timesPerDay"
              label="Número de vezes a tomar"
              ref="form"
              :rules="[ val => !!val || 'Por favor indicar o numero de vezes a tomar']"
              suffix="Vez(es)"
              dense
              class="col q-ml-md" />
            <q-select
              prefix="Por "
              class="col q-ml-md"
              dense outlined
              ref="times"
              :rules="[ val => !!val || 'Por favor indicar a periodicidade da toma']"
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
import TherapeuticRegimen from '../../../store/models/therapeuticRegimen/TherapeuticRegimen'
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
      this.$refs.drug.validate()
      this.$refs.amtPerTime.validate()
      this.$refs.form.$refs.ref.validate()
      this.$refs.times.validate()
      if (!this.$refs.drug.hasError &&
          !this.$refs.amtPerTime.hasError &&
          !this.$refs.form.$refs.ref.hasError &&
          !this.$refs.times.hasError) {
        this.$emit('addPrescribedDrug', this.prescribedDrug, this.visitDetails)
      }
    },
    getDrugs () {
      let drugs = ''
      if (this.showOnlyOfRegimen) {
        drugs = this.therapeuticRegimen.drugs
      } else {
        drugs = Drug.query().with('form').has('stocks').where('active', true).get()
      }
      return drugs
    },
    loadDefaultParameters () {
      if (this.prescribedDrug.drug !== null) {
        this.prescribedDrug.amtPerTime = this.prescribedDrug.drug.defaultTreatment
        this.prescribedDrug.timesPerDay = this.prescribedDrug.drug.defaultTimes
        this.prescribedDrug.form = this.prescribedDrug.drug.defaultPeriodTreatment
      }
    }
  },
  computed: {
    drugs () {
      return this.getDrugs()
    },
    therapeuticRegimen () {
      return TherapeuticRegimen.query()
                               .with('drugs.form')
                               .where('id', this.visitDetails.prescription.prescriptionDetails[0].therapeuticRegimen.id).first()
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
