<template>
             <div class="row">
              <div class="col row q-pt-md">
                <q-select
                    dense outlined
                    class="col q-mr-md"
                    :options="provinces"
                    v-model="province"
                    ref="province"
                    option-value="id"
                    option-label="description"
                    :rules="[ val => ( val != null ) || ' Por favor indique a província']"
                    lazy-rules
                    label="Província *" />

                     <q-select
                    class="col q-mr-md"
                    dense outlined
                    :options="districts"
                    v-model="district"
                    ref="district"
                    option-value="id"
                    option-label="description"
                    :rules="[ val => ( val != null) || ' Por favor indique o Distrito']"
                    lazy-rules
                    label="Distrito *" />

                     <q-select
                    class="col q-mr-md"
                    dense outlined
                    :options="clinics"
                    v-model="clinic"
                    ref="clinic"
                    option-value="id"
                    option-label="clinicName"
                    :rules="[ val => ( val != null) || ' Por favor indique a farmácia']"
                    lazy-rules
                    label="Farmácia *" />

                      <q-select
                    class="col q-mr-md"
                    dense outlined
                    :options="periodos"
                    v-model="periodo"
                    @update:model-value="val => onPeriodoChange(val)"
                    ref="period"
                    option-value="id"
                    option-label="description"
                    :rules="[ val => ( val != null) || ' Por favor indique o período']"
                    lazy-rules
                    label="Período *" />

                    <SpecificPeriod v-model="thruDate" v-if="periodo.id ===1"/>
                    <MonthlyPeriod v-model="month" v-else-if="periodo.id ===2" />
                    <QuarterlyPeriod v-else-if="periodo.id ===3" />
                    <SemesterPeriod v-else-if="periodo.id ===4" />
                    <AnnualPeriod v-else-if="periodo.id ===5" />

                    <div class="">
                    <q-btn class="gt-xs"
                      color="grey"
                      dense
                      rounded
                      icon="chevron_right"
                      @click.stop="processReport(id,typeService)"
                    >
                      <q-tooltip class="bg-primary">Processar o Relatório</q-tooltip>
                    </q-btn>
                    </div>
                    <div class="q-mr-md q-pt-xs items-center" style="width: 250px;">
                      <q-linear-progress class="col q-mx-md" size="25px" stripe rounded :value="progress1" color="red">
                        <div class="absolute-full flex flex-center">
                            <q-badge color="white" text-color="accent" :label="progressLabel1" />
                        </div>
                      </q-linear-progress>
                    </div>
              </div>
              <div class="row q-ml-md">
                <div class="col">
                  <q-btn color="grey-6" class="row gt-xs" flat dense icon="article" @click.stop="generateReport('XLS')">
                    <q-tooltip class="bg-primary">Imprimir Excel</q-tooltip>
                    .Xls
                </q-btn>
                <q-btn color="grey-6" class="gt-xs" flat dense  @click.stop="generateReport('PDF')" icon="article" title=".pdf">
                  <q-tooltip class="bg-primary">Imprimmir Pdf</q-tooltip>
                  .Pdf
                  </q-btn>
                </div>
              </div>
            </div>
</template>

<script>
import Province from '../../../store/models/province/Province'
import District from '../../../store/models/district/District'
import Clinic from '../../../store/models/clinic/Clinic'
import { ref, computed } from 'vue'

export default {
    props: ['typeService', 'menuSelected', 'id', 'totalRecords', 'qtyProcessed'],
    data () {
      const progress1 = ref(0.25)
      return {
          province: null,
          district: null,
          clinic: null,
          thruDate: ref(''),
          startDate: ref(''),
          name: ref(''),
          periodo: '',
          periodos: [
              { id: 1, description: 'Especifico' },
              { id: 2, description: 'Mensal' },
              { id: 3, description: 'Trimestral' },
              { id: 4, description: 'Semestral' },
              { id: 5, description: 'Anual' }],
          progress1,
          progressLabel1: computed(() => (progress1.value * 100).toFixed(2) + '%')
      }
    },
    computed: {
      provinces () {
        return Province.query().with('districts').has('code').get()
      },
      districts () {
        if (this.province !== null) {
          return District.query().with('clinics').where('province_id', this.province.id).get()
        } else {
            return null
        }
      },
        clinics () {
          if (this.district !== null) {
            return Clinic.query().with('districts').where('district_id', this.district.id).get()
          } else {
              return null
          }
      }
    },
    methods: {
      processReport (id, typeService) {
          console.log('Processando o report UUID', id)
          console.log('Tipo de Servico', typeService.code)
          console.log('Data inicio', this.startDate)
          console.log('Data fim', this.thruDate)
          console.log('Mes', this.month)
      },
      onPeriodoChange (val) {
          console.log('Valor seleccionado: ', val)
      },
      generateReport (fileType) {
        this.$emit('getReport', this.id, fileType)
      },
      initReportProcessing () {
        this.$emit('initReportProcessing', this.id)
      }
    },
    components: {
       SpecificPeriod: require('components/Reports/shared/SpecificPeriod.vue').default,
       SemesterPeriod: require('components/Reports/shared/SemesterPeriod.vue').default,
       MonthlyPeriod: require('components/Reports/shared/MonthlyPeriod.vue').default,
       QuarterlyPeriod: require('components/Reports/shared/QuarterlyPeriod.vue').default,
       AnnualPeriod: require('components/Reports/shared/AnnualPeriod.vue').default
    }

}
</script>

<style>
    .fild-radius {
        border-radius: 5px;
    }
</style>
