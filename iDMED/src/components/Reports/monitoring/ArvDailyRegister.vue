<template>
<div ref="filterArvDailyRegisterSection">
  <ListHeader
    :addVisible="false"
    :mainContainer="true"
    :closeVisible="true"
    @closeSection="closeSection"
    bgColor="bg-orange-5">Serviço {{selectedService !== null ? selectedService.code : ''}}: Lista de Registro Diário de ARV
  </ListHeader>
  <div class="param-container">
    <q-item>
         <q-item-section  class="col" >
            <FiltersInput
              :id="id"
              :typeService="selectedService"
              :progress="progress"
              :clinicalService="selectedService"
              :applicablePeriods="periodType"
              @generateReport="generateReport"
              @initReportProcessing="initReportProcessing"
            />
        </q-item-section>
    </q-item>
    <q-dialog persistent v-model="alert.visible">
    <Dialog :type="alert.type" @closeDialog="closeDialog">
      <template v-slot:title> Informação</template>
      <template v-slot:msg> {{alert.msg}} </template>
    </Dialog>
  </q-dialog>
  </div>
  </div>
</template>

<script>

import Report from 'src/store/models/report/Report'
import ArvDailyRegisterReport from 'src/reports/monitoring/ArvDailyRegisterReport.ts'
import ClinicalService from '../../../store/models/ClinicalService/ClinicalService'
import PatientServiceIdentifier from 'src/store/models/patientServiceIdentifier/PatientServiceIdentifier'
import ArvDailyRegisterTempReport from 'src/store/models/report/monitoring/ArvDailyRegisterTempReport'
import reportDatesParams from '../../../reports/ReportDatesParams'
 import { LocalStorage } from 'quasar'
import { ref } from 'vue'
import mixinutils from 'src/mixins/mixin-utils'
import mixinSystemPlatform from 'src/mixins/mixin-system-platform'
import PatientVisit from 'src/store/models/patientVisit/PatientVisit'
import moment from 'moment'

  export default {
    name: 'ArvDailyRegister',
    props: ['selectedService', 'menuSelected', 'id'],
    mixins: [mixinutils, mixinSystemPlatform],
    setup () {
      return {
        totalRecords: ref(0),
        qtyProcessed: ref(0),
        alert: ref({
          type: '',
          visible: false,
          msg: ''
        }),
        progress: ref(0)
      }
    },
    mounted () {
    },
    components: {
      ListHeader: require('components/Shared/ListHeader.vue').default,
      FiltersInput: require('components/Reports/shared/FiltersInput.vue').default
    },
    methods: {
      closeSection () {
        this.$refs.filterArvDailyRegisterSection.remove()
      },
      initReportProcessing (params) {
        if (params.localOrOnline === 'online') {
          Report.apiInitArvDailyRegisterProcessing(params).then(resp => {
            this.progress = resp.response.data.progress
            setTimeout(this.getProcessingStatus(params), 2)
          })
        } else {
          this.getDataLocalDb(params)
        }
     //  this.getDataLocalDb(params)
      },
      getProcessingStatus (params) {
        Report.getProcessingStatus('arvDailyRegisterReportTemp', params).then(resp => {
          this.progress = resp.response.data.progress
          if (this.progress < 100) {
            setTimeout(this.getProcessingStatus(params), 2)
          } else {
            params.progress = 100
            LocalStorage.set(params.id, params)
          }
        })
       /*
        this.getDataLocalDb(params)
        */
      },
      generateReport (id, fileType, params) {
        // UID da tab corrent
          if (fileType === 'PDF') {
           ArvDailyRegisterReport.downloadPDF(id, fileType, params).then(resp => {
                  if (resp === 204) this.displayAlert('error', 'Nao existem Dados para o periodo selecionado')
               })
        } else if (fileType === 'XLS') {
           ArvDailyRegisterReport.downloadExcel(id, fileType, params).then(resp => {
                  if (resp === 204) this.displayAlert('error', 'Nao existem Dados para o periodo selecionado')
               })
        }
      },
      displayAlert (type, msg) {
        this.alert.type = type
        this.alert.msg = msg
        this.alert.visible = true
      },
      closeDialog () {
        this.alert.visible = false
      },
      async getDataLocalDb (params) {
        const reportParams = reportDatesParams.determineStartEndDate(params)
        console.log(reportParams)
        const patientVisits = await PatientVisit.localDbGetAllPatientVisit()
        for (const patientVisit of patientVisits) {
            for (const patientVisitDetail of patientVisit.patientVisitDetails) {
              const pickupDate = moment(patientVisitDetail.pack.pickupDate).format('YYYY-MM-DD')
            const endDate = moment(params.endDate).format('YYYY-MM-DD')
            const days = moment(endDate).diff(pickupDate, 'days')
            const newDate = moment(patientVisitDetail.pack.pickupDate).add(days, 'd')

            if ((patientVisit.visitDate >= reportParams.startDate && patientVisit.visitDate <= reportParams.endDate) ||
            (newDate >= moment(params.startDate) && newDate <= moment(params.endDate))) {
              PatientServiceIdentifier.localDbGetById(patientVisitDetail.episode.patientServiceIdentifier.id).then(item => {
                const identifier = item[0]
            if (identifier.service.id === reportParams.clinicalService) {
            const arvDailyRegisterReport = new ArvDailyRegisterTempReport()
            arvDailyRegisterReport.reportId = reportParams.id
          // arvDailyRegisterReport.period = reportParams.periodTypeView
          arvDailyRegisterReport.year = reportParams.year
          arvDailyRegisterReport.startDate = reportParams.startDate
          arvDailyRegisterReport.endDate = reportParams.endDate
              const pack = patientVisitDetail.pack
          const clinic = patientVisitDetail.clinic
          arvDailyRegisterReport.nid = identifier.value
          arvDailyRegisterReport.patientName = patientVisit.patient.firstNames + ' ' + patientVisit.patient.middleNames + ' ' + patientVisit.patient.lastNames
          arvDailyRegisterReport.patientType = patientVisitDetail.prescription.patientType
          arvDailyRegisterReport.startReason = patientVisitDetail.episode.startStopReason.reason
          const age = this.idadeCalculator(patientVisit.patient.dateOfBirth)
           console.log(age)
          arvDailyRegisterReport.ageGroup_0_4 = (age >= 0 && age < 4 ? 'Sim' : 'Nao')
          arvDailyRegisterReport.ageGroup_5_9 = (age >= 5 && age <= 9 ? 'Sim' : 'Nao')
          arvDailyRegisterReport.ageGroup_10_14 = (age >= 10 && age <= 14 ? 'Sim' : 'Nao')
         arvDailyRegisterReport.ageGroup_Greater_than_15 = (age >= 15 ? 'Sim' : 'Nao')
         arvDailyRegisterReport.pickUpDate = pack.pickupDate
         arvDailyRegisterReport.nexPickUpDate = pack.nextPickUpDate
         arvDailyRegisterReport.regime = patientVisitDetail.prescription.prescriptionDetails[0].therapeuticRegimen.description
         arvDailyRegisterReport.dispensationType = patientVisitDetail.prescription.prescriptionDetails[0].dispenseType.description
         arvDailyRegisterReport.therapeuticLine = patientVisitDetail.prescription.prescriptionDetails[0].therapeuticLine.description
         arvDailyRegisterReport.clinic = clinic.clinicName
         arvDailyRegisterReport.prep = (ClinicalService.localDbGetById(reportParams.clinicalService).code === 'PREP' ? 'Sim' : '')
         arvDailyRegisterReport.ppe = (ClinicalService.localDbGetById(reportParams.clinicalService).code === 'PPE' ? 'Sim' : '')
         const drugQuantityTemps = []
          for (const packagedDrug of patientVisitDetail.pack.packagedDrugs) {
            const drug = packagedDrug.drug
              const drugQuantityTemp = {}
              drugQuantityTemp.drugName = drug.name
              drugQuantityTemp.quantity = packagedDrug.quantitySupplied
              console.log(drugQuantityTemp)
             drugQuantityTemps.push(drugQuantityTemp)
             console.log(arvDailyRegisterReport)
            }
            console.log(drugQuantityTemps)
            arvDailyRegisterReport.drugQuantityTemps = JSON.parse(JSON.stringify(drugQuantityTemps))
           ArvDailyRegisterTempReport.localDbAddOrUpdate(arvDailyRegisterReport)
            }
          })
          this.progress = 100
          params.progress = 100
            }
          }
       }
        }
    }
  }
</script>

<style lang="scss" scoped>
  .param-container {
    border-bottom: 1px dashed $grey-13;
    border-left: 1px dashed $grey-13;
    border-right: 1px dashed $grey-13;
    border-radius: 0px 0px 5px 5px;
  }
</style>
