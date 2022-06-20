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
                      :options="periodTypeList"
                      v-model="reportParams.periodTypeView"
                      ref="period"
                      option-value="code"
                      option-label="description"
                      @update:model-value="val => onPeriodoChange(val)"
                      :rules="[ val => ( val != null) || ' Por favor indique o período']"
                      lazy-rules
                      label="Período *" />

                     <div  class="row q-mb-md" v-if="reportParams.periodTypeView !== null && reportParams.periodTypeView.id ===1">
                        <q-input
                          dense
                          outlined
                          :disable="false"
                          class="col q-mr-md"
                          v-model="reportParams.startDateParam"
                          label="Data Início">
                          <template v-slot:append>
                              <q-icon name="event" class="cursor-pointer">
                              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                  <q-date v-model="reportParams.startDateParam"  mask="DD-MM-YYYY">
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
                          v-model="reportParams.endDateParam"
                          label="Data Fim">
                          <template v-slot:append>
                              <q-icon name="event" class="cursor-pointer">
                              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                  <q-date v-model="reportParams.endDateParam"
                                  mask="DD-MM-YYYY"
                                   :options="blockDataFutura">
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
                      v-else-if="reportParams.periodTypeView !== null && reportParams.periodTypeView.id ===2"
                      @setSelectedMonth="setSelectedPeriod"
                      @setSelectedYearMonth="setSelectedYear"/>

                    <QuarterlyPeriod
                      v-else-if="reportParams.periodTypeView !== null && reportParams.periodTypeView.id ===3"
                      @setSelectedQuarter="setSelectedPeriod"
                      @setSelectedYearQuarter="setSelectedYear" />

                    <SemesterPeriod
                      v-else-if="reportParams.periodTypeView !== null && reportParams.periodTypeView.id ===4"
                      @setSelectedSemester="setSelectedPeriod"
                      @setSelectedSemesterYear="setSelectedYear"  />

                    <AnnualPeriod
                      v-else-if="reportParams.periodTypeView !== null && reportParams.periodTypeView.id ===5"
                      @setSelectedYearAnnual="setSelectedYear" />

                    <div class="">
                      <q-btn class="gt-xs"
                        :color="!processingTerminated ? 'green-6' : 'grey-6'"
                        :disable="processingTerminated"
                        dense
                        rounded
                        icon="chevron_right"
                        @click.stop="processReport()"
                      >
                        <q-tooltip class="bg-primary">Processar o Relatório</q-tooltip>
                      </q-btn>
                    </div>
                    <div class="q-mr-md q-pt-xs items-center" style="width: 250px;">
                      <q-linear-progress class="col q-mx-md" size="25px" stripe rounded :value="this.progress" color="red">
                        <div class="absolute-full flex flex-center">
                            <q-badge color="white" text-color="accent" :label="progressLabel1" />
                        </div>
                      </q-linear-progress>
                    </div>
              </div>

              <div class="row q-ml-md">
                <div class="col">
                  <q-btn :color="processingTerminated ? 'green-6' : 'grey-6'" class="row gt-xs" flat dense icon="article" :disable="!processingTerminated" @click.stop="generateReport('XLS')">
                    <q-tooltip class="bg-primary">Imprimir Excel</q-tooltip>
                    .Xls
                </q-btn>
                <q-btn :color="processingTerminated ? 'green-6' : 'grey-6'" class="gt-xs" flat dense  @click.stop="generateReport('PDF')"  icon="article" title=".pdf">
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
import { ref } from 'vue'
import { LocalStorage, SessionStorage, date } from 'quasar'
import moment from 'moment'
// import moment from 'moment'
export default {
    props: ['clinicalService', 'menuSelected', 'id', 'progress', 'reportType', 'progressValue', 'applicablePeriods', 'tabName', 'params'],
    data () {
      const progress1 = ref(0)
      return {
        reportParams: {
          id: null,
          provinceId: null,
          districtId: null,
          clinicId: null,
          clinic: null,
          province: null,
          district: null,
          endDateParam: null,
          startDateParam: null,
          clinicalService: null,
          year: new Date().getFullYear(),
          period: null,
          periodTypeView: null,
          reportType: null,
          progress: 0
        },
        periodTypeList: ref([
          { id: 1, description: 'Especifico', code: 'SPECIFIC' },
          { id: 2, description: 'Mensal', code: 'MONTH' },
          { id: 3, description: 'Trimestral', code: 'QUARTER' },
          { id: 4, description: 'Semestral', code: 'SEMESTER' },
          { id: 5, description: 'Anual', code: 'ANNUAL' }
        ]),
        progress1
      }
    },
    created () {
      this.init()
      this.initParams()
    },
      mounted () {
        if (this.params) {
          this.reportParams = this.params
       //   this.progress = this.params.progress
        //  this.periodTypeView = this.params.periodTypeView
        //  this.reportParams.startDateParam = this.params.startDateParam
        }
    },
    computed: {
      processingTerminated () {
        return this.progress >= 100
      },
      progressLabel1 () {
        console.log(this.progress)
        return this.progress + '%'
      },
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
            return Clinic.query().with('districts').where('district_id', this.reportParams.districtId).get()
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
    methods: {
       date: ref(moment(date).format('YYYY/MM/DD')),
        blockDataFutura (date) {
            return date <= moment(new Date()).format('YYYY/MM/DD')
        },
      init () {
        console.log(this.applicablePeriods)
        if (this.applicablePeriods !== null) {
          // this.periodTypeList = ref(this.applicablePeriods)
        }
        console.log(this.periodTypeList)
      },
      onPeriodoChange (val) {
        this.reportParams.provinceId = null
        this.reportParams.districtId = null
        this.reportParams.endDateParam = null
        this.reportParams.startDateParam = null
        this.reportParams.year = new Date().getFullYear()
        this.reportParams.period = null
        this.reportParams.periodTypeView = val
        this.reportParams.progress = 0
      },
      initParams () {
        if (this.isClinicLevel) {
          this.reportParams.clinicId = this.currClinic.id
          this.reportParams.clinic = this.currClinic
        } else {
          this.reportParams.provinceId = this.currProvince.id
        }
        console.log(this.reportParams.clinic)
      },
      setSelectedYear (year) {
        this.reportParams.year = year
      },
       setSelectedPeriod (selectedPeriod) {
        this.reportParams.period = selectedPeriod.id
      },
      processReport () {
          this.reportParams.id = this.id
          this.reportParams.clinicalService = this.clinicalService.id
          if (this.reportParams.periodTypeView !== null) {
            this.reportParams.periodType = this.reportParams.periodTypeView.code
          }
          if (this.reportType !== null) {
            this.reportParams.reportType = this.reportType
          }
          if (this.reportParams.district !== null) {
             this.reportParams.districtId = this.reportParams.district.id
           }
          this.saveParams()
          console.log(this.reportParams)
          this.$emit('initReportProcessing', this.reportParams)
          this.$emit('updateProgressBar', this.progress1)
         // this.updateProgressBar()
      },
      saveParams () {
        this.reportParams.tabName = this.tabName
      //  this.reportParams.id = 'report' + this.reportParams.id
        LocalStorage.set(this.reportParams.id, this.reportParams)
      },
      generateReport (fileType) {
        this.$emit('generateReport', this.id, fileType, this.reportParams)
      },
      initReportProcessing () {
        this.$emit('initReportProcessing', this.reportParams)
      },
      updateProgressBar () {
        console.log(this.progressValue)
        this.progress1 = this.progressValue
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
