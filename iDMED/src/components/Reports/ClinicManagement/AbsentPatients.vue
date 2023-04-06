<template>
<div ref="filterDrugStoreSection">
  <ListHeader
    :addVisible="false"
    :mainContainer="true"
    :closeVisible="true"
    @closeSection="closeSection"
    bgColor="bg-orange-5">Serviço {{selectedService !== null ? selectedService.code : ''}}: Pacientes Faltosos ao levantamento
  </ListHeader>
  <div class="param-container">
    <q-item>
        <q-item-section  class="col" >
            <FiltersInput
              :id="id"
              :clinicalService="selectedService"
              :totalRecords="totalRecords"
              :qtyProcessed="qtyProcessed"
              :reportType="report"
              :progress="progress"
              :tabName="name"
              :params="params"
              @generateReport="generateReport"
              @initReportProcessing="initReportProcessing"
            />
        </q-item-section>
    </q-item>
  </div>
   <q-dialog persistent v-model="alert.visible">
    <Dialog :type="alert.type" @closeDialog="closeDialog">
      <template v-slot:title> Informação</template>
      <template v-slot:msg> {{alert.msg}} </template>
    </Dialog>
  </q-dialog>
  </div>
</template>
<script>
import moment from 'moment'
import Report from 'src/store/models/report/Report'
import { LocalStorage, SessionStorage } from 'quasar'
import { ref } from 'vue'
import absentPatientsTs from '../../../reports/ClinicManagement/AbsentPatients.ts'
// import { v4 as uuidv4 } from 'uuid'
import reportDatesParams from '../../../reports/ReportDatesParams'
// import AbsentPatientReport from 'src/store/models/report/pharmacyManagement/AbsentPatientReport'
// import Pack from 'src/store/models/packaging/Pack'
import Patient from '../../../store/models/patient/Patient'
import PatientServiceIdentifier from 'src/store/models/patientServiceIdentifier/PatientServiceIdentifier'
import AbsentPatientReport from 'src/store/models/report/pharmacyManagement/AbsentPatientReport'
import mixinplatform from 'src/mixins/mixin-system-platform'
import mixinIsOnline from 'src/mixins/mixin-is-online'
import PatientVisit from 'src/store/models/patientVisit/PatientVisit'
  export default {
    name: 'AbsentPatients',
    props: ['selectedService', 'menuSelected', 'id', 'params'],
    mixins: [mixinplatform, mixinIsOnline],
    setup () {
      return {
        totalRecords: ref(0),
        qtyProcessed: ref(0),
        report: 'FALTOSOS_AO_LEVANTAMENTO',
        progress: ref(0),
        name: 'AbsentPatients',
         alert: ref({
          type: '',
          visible: false,
          msg: ''
        })
      }
    },
    mounted () {
         if (this.params) {
          (this.getProcessingStatus(this.params))
        }
    },
    components: {
      ListHeader: require('components/Shared/ListHeader.vue').default,
      FiltersInput: require('components/Reports/shared/FiltersInput.vue').default,
      Dialog: require('components/Shared/Dialog/Dialog.vue').default
    },
    methods: {
      closeSection () {
         Report.api().delete(`/absentPatientsReport/delete/${this.id}`)
        this.$refs.filterDrugStoreSection.remove()
        LocalStorage.remove(this.id)
        SessionStorage.remove(this.id)
      },
      initReportProcessing (params) {
        if (this.isOnline) {
          Report.api().post('/absentPatientsReport/initReportProcess', params).then((response) => {
         setTimeout(this.getProcessingStatus(params), 2)
      })
        } else {
          this.getDataLocalDb(params)
        }
      },
      getProcessingStatus (params) {
        if (this.website) {
        Report.getProcessingStatus('absentPatientsReport', params).then(resp => {
          this.progress = resp.response.data.progress
          if (this.progress < 100) {
            setTimeout(this.getProcessingStatus(params), 2)
          } else {
            params.progress = 100
            LocalStorage.set(params.id, params)
          }
        })
      }
      },
      generateReport (id, fileType, params) {
        if (fileType === 'PDF') {
          absentPatientsTs.downloadPDF(id, fileType, params).then(resp => {
                  if (resp === 204) this.displayAlert('error', 'Nao existem Dados para o periodo selecionado')
               })
        } else if (fileType === 'XLS') {
          absentPatientsTs.downloadExcel(id, fileType, params).then(resp => {
                  if (resp === 204) this.displayAlert('error', 'Nao existem Dados para o periodo selecionado')
               })
        }
      },
      async getDataLocalDb (params) {
        const reportParams = reportDatesParams.determineStartEndDate(params)
        console.log(reportParams)
        const patientVisitList = await PatientVisit.localDbGetAllPatientVisit()
        for (const patientVisit of patientVisitList) {
          for (const reportData of patientVisit.patientVisitDetails) {
           if (moment(reportData.pack.nextPickUpDate).format('YYYY/MM/DD') <= moment(reportParams.startDate).format('YYYY/MM/DD') && moment(reportData.pack.nextPickUpDate).add(3, 'd').format('YYYY/MM/DD') <= moment(reportParams.endDate).format('YYYY/MM/DD')) {
                  const identifier = await PatientServiceIdentifier.localDbGetById(reportData.episode.patientServiceIdentifier.id)
                if (identifier.length > 0) {
                    if (identifier[0].service.id === reportParams.clinicalService) {
                        const absentPatientReport = new AbsentPatientReport()
                        const patient = await Patient.localDbGetByPatientId(patientVisit.patient.id)
                        if (patient.length > 0) {
                         const dateIdentifiedAbandonment = moment(reportData.pack.nextPickUpDate).add(60, 'd').format('YYYY/MM/DD')
                        absentPatientReport.nid = identifier[0].value
                        absentPatientReport.firstNames = patient[0].firstNames + ' ' + patient[0].lastNames
                        absentPatientReport.cellphone = patient[0].cellphone
                        absentPatientReport.dateBackUs = null
                        absentPatientReport.dateMissedPickUp = reportData.pack.nextPickUpDate
                        absentPatientReport.dateIdentifiedAbandonment = dateIdentifiedAbandonment > moment(reportParams.endDate).format('YYYY/MM/DD') ? dateIdentifiedAbandonment : ''
                        absentPatientReport.returnedPickUp = null
                        absentPatientReport.reportId = reportParams.id
                        absentPatientReport.year = reportParams.year
                        absentPatientReport.endDate = reportParams.endDate
                        AbsentPatientReport.localDbAddOrUpdate(absentPatientReport)
                      }
                    }
                  }
      }
        }
          }
          this.progress = 100
          params.progress = 100
      },
        displayAlert (type, msg) {
        this.alert.type = type
        this.alert.msg = msg
        this.alert.visible = true
      },
      closeDialog () {
        this.alert.visible = false
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
