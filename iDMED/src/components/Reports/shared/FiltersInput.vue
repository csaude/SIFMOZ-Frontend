<template>
             <div class="row">
              <div class="col row q-pt-md">
                    <q-select
                      dense outlined
                      v-if="isProvincialLevel"
                      disable
                      class="col q-mr-md"
                      :options="provinces"
                      v-model="reportParams.province"
                      ref="province"
                      option-value="id"
                      option-label="description"
                      label="Província" />

                    <q-select
                      class="col q-mr-md"
                      v-if="isProvincialLevel"
                      dense outlined
                      :options="districts"
                      v-model="reportParams.district"
                      ref="district"
                      option-value="id"
                      option-label="description"
                      label="Distrito" />

                    <q-select
                      class="col q-mr-md"
                      dense outlined
                      :disable="isClinicLevel"
                      :options="clinics"
                      v-model="reportParams.clinic"
                      ref="clinic"
                      option-value="id"
                      option-label="clinicName"
                      label="Farmácia" />

                    <q-select
                      class="col q-mr-md"
                      dense outlined
                      :options="peiodTypeList"
                      v-model="reportParams.peiodType"
                      ref="period"
                      option-value="id"
                      option-label="description"
                      @update:model-value="val => onPeriodoChange(val)"
                      :rules="[ val => ( val != null) || ' Por favor indique o período']"
                      lazy-rules
                      label="Período *" />

                     <div  class="row q-mb-md" v-if="reportParams.peiodType !== null && reportParams.peiodType.id ===1">
                        <q-input
                          dense
                          outlined
                          :disable="false"
                          class="col q-mr-md"
                          v-model="reportParams.startDate"
                          label="Data Início">
                          <template v-slot:append>
                              <q-icon name="event" class="cursor-pointer">
                              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                  <q-date v-model="reportParams.startDate"  mask="DD-MM-YYYY">
                                  <div class="row items-center justify-end">
                                      <q-btn v-close-popup label="Close" color="primary" flat />
                                  </div>
                                  </q-date>
                              </q-popup-proxy>
                              </q-icon>
                          </template>
                        </q-input>
                        <q-input
                          dense
                          outlined
                          :disable="false"
                          class="col q-mr-md"
                          v-model="reportParams.thruDate"
                          label="Data Fim">
                          <template v-slot:append>
                              <q-icon name="event" class="cursor-pointer">
                              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                  <q-date v-model="reportParams.thruDate" mask="DD-MM-YYYY">
                                  <div class="row items-center justify-end">
                                      <q-btn v-close-popup label="Close" color="primary" flat />
                                  </div>
                                  </q-date>
                              </q-popup-proxy>
                              </q-icon>
                          </template>
                        </q-input>
                    </div>

                    <MonthlyPeriod
                      v-else-if="reportParams.peiodType !== null && reportParams.peiodType.id ===2"
                      @setSelectedMonth="setSelectedPeriod"
                      @setSelectedYearMonth="setSelectedYear"/>

                    <QuarterlyPeriod
                      v-else-if="reportParams.peiodType !== null && reportParams.peiodType.id ===3"
                      @setSelectedQuarter="setSelectedPeriod"
                      @setSelectedYearQuarter="setSelectedYear" />

                    <SemesterPeriod
                      v-else-if="reportParams.peiodType !== null && reportParams.peiodType.id ===4"
                      @setSelectedSemester="setSelectedPeriod"
                      @setSelectedSemesterYear="setSelectedYear"  />

                    <AnnualPeriod
                      v-else-if="reportParams.peiodType !== null && reportParams.peiodType.id ===5"
                      @setSelectedYearAnnual="setSelectedYear" />

                    <div class="">
                      <q-btn class="gt-xs"
                        color="grey"
                        dense
                        rounded
                        icon="chevron_right"
                        @click.stop="processReport()"
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
import Clinic from '../../../store/models/clinic/Clinic'
import { ref, computed } from 'vue'
import { SessionStorage } from 'quasar'

export default {
    props: ['typeService', 'menuSelected', 'id', 'totalRecords', 'qtyProcessed'],
    data () {
      const progress1 = ref(0.25)
      return {
        reportParams: {
          id: null,
          province: null,
          district: null,
          clinic: null,
          thruDate: null,
          startDate: null,
          typeService: null,
          year: null,
          selectedPeriod: null,
          peiodType: null
        },
        peiodTypeList: [
          { id: 1, description: 'Especifico' },
          { id: 2, description: 'Mensal' },
          { id: 3, description: 'Trimestral' },
          { id: 4, description: 'Semestral' },
          { id: 5, description: 'Anual' }
        ],
        progress1,
        progressLabel1: computed(() => (progress1.value * 100).toFixed(2) + '%')
      }
    },
    computed: {
      provinces: {
        get () {
          return Province.query().with('districts').has('code').get()
        }
      },
      districts: {
        get () {
          if (this.reportParams.province !== null) {
            return this.province.districts
          } else {
              return null
          }
        }
      },
      clinics: {
        get () {
          if (this.reportParams.district !== null) {
            return Clinic.query().with('districts').where('district_id', this.reportParams.district.id).get()
          } else {
              return null
          }
        }
      },
      isProvincialLevel () {
        return false
      },
      isClinicLevel () {
        return true
      },
      currClinic () {
        return Clinic.query().with('province').where('id', SessionStorage.getItem('currClinic').id).first()
      },
      currProvince () {
        return Province.query().with('districts').where('id', SessionStorage.getItem('currProvince').id).first()
      }
    },
    mounted () {
      this.initParams()
    },
    methods: {
      onPeriodoChange (val) {
        console.log(val)
        this.reportParams.province = null
        this.reportParams.district = null
        this.reportParams.clinic = null
        this.reportParams.thruDate = null
        this.reportParams.startDate = null
        this.reportParams.year = null
        this.reportParams.selectedPeriod = null
        this.reportParams.typeService = null
        this.reportParams.peiodType = val
        console.log(this.typeService)
      },
      initParams () {
        if (this.isClinicLevel) {
          this.reportParams.clinic = this.currClinic
        } else {
          this.reportParams.province = this.currProvince
        }
      },
      setSelectedYear (year) {
        this.reportParams.year = year
      },
       setSelectedPeriod (selectedPeriod) {
        this.reportParams.selectedPeriod = selectedPeriod
      },
      processReport () {
          this.reportParams.id = this.id
          this.reportParams.typeService = this.typeService
          console.log('parametros', this.reportParams)
          this.$emit('initReportProcessing', this.reportParams)
      },
      generateReport (fileType) {
        this.$emit('getReport', this.id, fileType)
      },
      initReportProcessing () {
        this.$emit('initReportProcessing', this.id)
      }
    },
    components: {
      //  SpecificPeriod: require('components/Reports/shared/SpecificPeriod.vue').default,
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
