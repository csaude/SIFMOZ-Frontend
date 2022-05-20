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
              :tabName="params.tabName"
              :params="params"
              @generateReport="generateReport"
              @initReportProcessing="initReportProcessing"
            />
        </q-item-section>
    </q-item>
  </div>
  </div>
</template>

<script>

import Report from 'src/store/models/report/Report'
import { LocalStorage } from 'quasar'
import { ref } from 'vue'
  export default {
    name: 'AbsentPatients',
    props: ['selectedService', 'menuSelected', 'id', 'params'],
    setup () {
      return {
        totalRecords: ref(0),
        qtyProcessed: ref(0),
        report: 'FALTOSOS_AO_LEVANTAMENTO',
        progress: ref(0)
      }
    },
    mounted () {
         if (this.params) {
          (this.getProcessingStatus(this.params))
        }
    },
    components: {
      ListHeader: require('components/Shared/ListHeader.vue').default,
      FiltersInput: require('components/Reports/shared/FiltersInput.vue').default
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
          console.log(resp.response.data.progress)
          this.progress = resp.response.data.progress
          console.log(this.progress)
          if (this.progress < 100) {
            setTimeout(this.getProcessingStatus(params), 2)
          } else {
            params.progress = 100
            LocalStorage.set(params.id, params)
          }
        })
      },
      generateReport (id, fileType) {
        // UID da tab corrente
        console.log('UUID da tab seleccionada:', id)
       // console.log(Pack.api().get('/referredPatientsReport/printReport/'+ id).toString)
            Report.api().get(`/absentPatientsReport/printReport/${id}/${fileType}`,
            { responseType: 'blob' }).then(resp => {
              console.log(resp)
              console.log(resp.response.data)
                const file = new Blob([resp.response.data], { type: 'application/' + fileType })
        const fileURL = URL.createObjectURL(file)
          const link = document.createElement('a')
          link.href = fileURL
          link.setAttribute('download', 'PacientesFaltosos.' + fileType)
          document.body.appendChild(link)
          link.click()
            })
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
