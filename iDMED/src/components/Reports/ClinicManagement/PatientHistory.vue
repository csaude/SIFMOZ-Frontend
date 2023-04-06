<template>
<div ref="filterDPatientHistorySection">
  <ListHeader
    :addVisible="false"
    :mainContainer="true"
    :closeVisible="true"
    @closeSection="closeSection"
    bgColor="bg-orange-5">Serviço {{selectedService !== null ? selectedService.code : ''}}: Histórico de Levantamento
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
 import moment from 'moment'
import Report from 'src/store/models/report/Report'
import { LocalStorage } from 'quasar'
import { ref } from 'vue'
 import patientHistoryTS from '../../../reports/ClinicManagement/PatientHistory.ts'
// import db from 'src/store/localbase'
 import reportDatesParams from '../../../reports/ReportDatesParams'
// import ReportDatesParams from '../../../reports/ReportDatesParams'
 import PatientHistoryReport from 'src/store/models/report/pharmacyManagement/PatientHistoryReport'
import PatientServiceIdentifier from 'src/store/models/patientServiceIdentifier/PatientServiceIdentifier'
// import PrescriptionDetail from '../../../store/models/prescriptionDetails/PrescriptionDetail'
import TherapeuticRegimen from '../../../store/models/therapeuticRegimen/TherapeuticRegimen'
import DispenseType from '../../../store/models/dispenseType/DispenseType'
 import DispenseMode from 'src/store/models/dispenseMode/DispenseMode'
import ClinicalService from '../../../store/models/ClinicalService/ClinicalService'
import PatientVisit from 'src/store/models/patientVisit/PatientVisit'
import { v4 as uuidv4 } from 'uuid'
import mixinplatform from 'src/mixins/mixin-system-platform'
import mixinIsOnline from 'src/mixins/mixin-is-online'
  export default {
    name: 'PatientHistory',
    props: ['selectedService', 'menuSelected', 'id'],
    mixins: [mixinplatform, mixinIsOnline],
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
      FiltersInput: require('components/Reports/shared/FiltersInput.vue').default,
      Dialog: require('components/Shared/Dialog/Dialog.vue').default
    },
    methods: {
     async closeSection () {
        this.$refs.filterDPatientHistorySection.remove()
        if (!this.isOnline) {
         const reports = await PatientHistoryReport.localDbGetAllByReportId(this.id)
         for (const report of reports) {
                 if (report.reportId === this.id) {
                 await PatientHistoryReport.localDbDeleteById(report.reportId)
                 }
            }
        }
      },
      initReportProcessing (params) {
        if (this.isOnline) {
            Report.apiInitPatientsHistryProcessing(params).then(resp => {
            this.progress = resp.response.data.progress
            setTimeout(this.getProcessingStatus(params), 2)
          })
          } else {
            reportDatesParams.determineStartEndDate(params)
          console.log(params)
          this.getDataLocalDb(params)
          }
        },
      getProcessingStatus (params) {
        Report.getProcessingStatus('historicoLevantamentoReport', params).then(resp => {
          this.progress = resp.response.data.progress
          if (this.progress < 100) {
            setTimeout(this.getProcessingStatus(params), 2)
          } else {
            params.progress = 100
            LocalStorage.set(params.id, params)
          }
        })
      },
     async generateReport (id, fileType) {
         //  UID da tab corrente
        if (this.isOnline) {
          Report.api().get(`/historicoLevantamentoReport/printReport/${id}/${fileType}`, { responseType: 'json' }).then(resp => {
           if (!resp.response.data[0]) {
              this.displayAlert('error', 'Nao existem Dados para o periodo selecionado')
            } else {
              const firstReg = resp.response.data[0]
              if (fileType === 'PDF') {
                patientHistoryTS.downloadPDF(
                  firstReg.province,
                  moment(new Date(firstReg.startDate)).format('DD-MM-YYYY'),
                  moment(new Date(firstReg.endDate)).format('DD-MM-YYYY'),
                  resp.response.data
                )
              } else {
                patientHistoryTS.downloadExcel(
                  firstReg.province,
                  moment(new Date(firstReg.startDate)).format('DD-MM-YYYY'),
                  moment(new Date(firstReg.endDate)).format('DD-MM-YYYY'),
                  resp.response.data
                )
              }
            }
            })
        } else {
        const reports = await PatientHistoryReport.localDbGetAllByReportId(id)
         const reportData = []
         reports.forEach(report => {
                 if (report.reportId === id) {
                  reportData.push(report)
                 }
            })
             const firstReg = reportData[0]
            patientHistoryTS.downloadPDF(
                   '',
                    moment(new Date(firstReg.startDate)).format('DD-MM-YYYY'),
                  moment(new Date(firstReg.endDate)).format('DD-MM-YYYY'),
                reportData)
        }
      },
   async getDataLocalDb (params) {
        const reportParams = reportDatesParams.determineStartEndDate(params)
        console.log(reportParams)
        const patientVisitList = await PatientVisit.localDbGetAllPatientVisit()
        for (const patientVisit of patientVisitList) {
          for (const patientVisitDetail of patientVisit.patientVisitDetails) {
            const pickupDate = moment(patientVisitDetail.pack.pickupDate).format('YYYY-MM-DD')
            const endDate = moment(params.endDate).format('YYYY-MM-DD')
            const startDate = moment(params.startDate).format('YYYY-MM-DD')
            const days = moment(endDate).diff(pickupDate, 'days')
            const newDate = moment(patientVisitDetail.pack.pickupDate).add(days, 'd')

            if ((patientVisit.visitDate >= reportParams.startDate && patientVisit.visitDate <= reportParams.endDate) ||
            (newDate >= moment(params.startDate) && newDate <= moment(params.endDate))) {
              const patientHistory = new PatientHistoryReport()
              const dispenseType = await DispenseType.localDbGetById(patientVisitDetail.prescription.prescriptionDetails[0].dispenseType.id)
                if (pickupDate >= startDate && dispenseType.code === 'DT') {
                  patientHistory.dispenseType = 'DT'
                } else if (pickupDate < startDate && dispenseType.code === 'DT') {
                  patientHistory.dispenseType = 'DT - TRANSPORTE'
                } else if (pickupDate >= startDate && dispenseType.code === 'DS') {
                  patientHistory.dispenseType = 'DS'
                } else if (pickupDate < startDate && dispenseType.code === 'DS') {
                  patientHistory.dispenseType = 'DS - TRANSPORTE'
                } else if (pickupDate >= startDate && dispenseType.code === 'DM') {
                  patientHistory.dispenseType = 'DM'
                } else if (pickupDate < startDate && dispenseType.code === 'DM') {
                  patientHistory.dispenseType = 'DM - TRANSPORTE'
                } else {
                  patientHistory.dispenseType = dispenseType.description
                }
              patientHistory.reportId = reportParams.id
              // patientHistory.period = reportParams.periodTypeView
              patientHistory.year = reportParams.year
              patientHistory.startDate = reportParams.startDate
              patientHistory.endDate = reportParams.endDate
              const identifier = await PatientServiceIdentifier.localDbGetById(patientVisitDetail.episode.patientServiceIdentifier.id)
              if (identifier.length > 0) {
                  // const serviceIdentifier = identifier
                  const pack = patientVisitDetail.pack
              const clinic = patientVisitDetail.clinic
              const clinicalService = await ClinicalService.localDbGetById(identifier[0].service.id)
                         const therapeuticRegimen = await TherapeuticRegimen.localDbGetById(patientVisitDetail.prescription.prescriptionDetails[0].therapeuticRegimen.id)
            const dispenseMode = await DispenseMode.localDbGetById(pack.dispenseMode.id)
              // const episode = reportData.episode
            // const dispenseMode = DispenseMode.localDbGetById(pack.dispenseMode.id)
              patientHistory.nid = identifier[0].value
              patientHistory.firstNames = patientVisit.patient.firstNames
              patientHistory.middleNames = patientVisit.patient.middleNames
              patientHistory.lastNames = patientVisit.patient.lastNames
              patientHistory.cellphone = patientVisit.patient.cellphone
            // patientHistory.tipoTarv =
              patientHistory.pickUpDate = pack.pickupDate
              patientHistory.nexPickUpDate = pack.nextPickUpDate
              patientHistory.therapeuticalRegimen = therapeuticRegimen.description
              patientHistory.age = this.idadeCalculator(patientVisit.patient.dateOfBirth)
              patientHistory.dispenseMode = dispenseMode.description
              patientHistory.clinicalService = clinicalService.description
              patientHistory.clinic = clinic.clinicName
              patientHistory.id = uuidv4()
              PatientHistoryReport.localDbAddOrUpdate(patientHistory)
              console.log(patientHistory)
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
      },
      idadeCalculator (birthDate) {
            if (moment(birthDate, 'YYYY/MM/DDDD').isValid()) {
               const utentBirthDate = moment(birthDate, 'YYYY/MM/DDDD')
               const todayDate = moment(new Date())
               const idade = todayDate.diff(utentBirthDate, 'years')
               console.log(idade)
              return idade
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
