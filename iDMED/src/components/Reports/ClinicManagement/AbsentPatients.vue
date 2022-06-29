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
import { LocalStorage } from 'quasar'
import { ref } from 'vue'
import absentPatientsTs from '../../../reports/ClinicManagement/AbsentPatients.ts'

  export default {
    name: 'AbsentPatients',
    props: ['selectedService', 'menuSelected', 'id', 'params'],
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
      },
      initReportProcessing (params) {
         Report.api().post('/absentPatientsReport/initReportProcess', params).then((response) => {
         setTimeout(this.getProcessingStatus(params), 2)
      })
      },
      getProcessingStatus (params) {
        Report.getProcessingStatus('absentPatientsReport', params).then(resp => {
          this.progress = resp.response.data.progress
          if (this.progress < 100) {
            setTimeout(this.getProcessingStatus(params), 2)
          } else {
            params.progress = 100
            LocalStorage.set(params.id, params)
          }
        })
      },
      generateReport (id, fileType) {
            Report.api().get(`/absentPatientsReport/printReport/${id}/${fileType}`, { responseType: 'json' }).then(resp => {
              if (!resp.response.data[0]) {
              this.displayAlert('error', 'Nao existem Dados para o periodo selecionado')
            } else {
              const patientAux = resp.response.data[0]
              if (fileType === 'PDF') {
                absentPatientsTs.downloadPDF(
                  patientAux.clinic,
                  moment(new Date(patientAux.startDate)).format('DD-MM-YYYY'),
                  moment(new Date(patientAux.endDate)).format('DD-MM-YYYY'),
                  resp.response.data
                )
              } else {
                absentPatientsTs.downloadExcel(
                  patientAux.clinic,
                  moment(new Date(patientAux.startDate)).format('DD-MM-YYYY'),
                  moment(new Date(patientAux.endDate)).format('DD-MM-YYYY'),
                  resp.response.data
                )
              }
            }
            })
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
