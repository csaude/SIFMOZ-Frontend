<template>
<div ref="filterDrugStoreSection">
  <ListHeader
    :addVisible="false"
    :mainContainer="true"
    :closeVisible="true"
    @closeSection="closeSection"
    bgColor="bg-orange-5">Serviço {{selectedService !== null ? selectedService.code : ''}}: Referidos Para Outras Farmacias
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
              @generateReport="generateReport"
              @initReportProcessing="initReportProcessing"
              @updateProgressBar="updateProgressBar"
              :progressValue="progressValue"
            />
        </q-item-section>
    </q-item>
  </div>
  </div>
</template>

<script>

import Report from 'src/store/models/report/Report'
import { ref } from 'vue'
  export default {
    name: 'ReferredPatients',
    props: ['selectedService', 'menuSelected', 'id'],
    setup () {
      return {
        totalRecords: ref(0),
        qtyProcessed: ref(0),
        report: 'REFERIDO_PARA',
        progressValue: ref(0),
        intervalID: ref(0)
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
        this.$refs.filterDrugStoreSection.remove()
      },
      initReportProcessing (params) {
        console.log(params)
      Report.api().post('/referredPatientsReport/initReportProcess', params).then((response) => {
        // reset your component inputs like textInput to nul    // or your custom route redirect with vue-router
        // or your custom route redirect with vue-router
        this.updateProgressBar()
      })
      },
      updateProgressBar () {
       // this.progressValue = 1.00
        this.intervalID = setInterval(() => {
      this.progressValue = this.progressValue + 0.1
      if (Math.trunc(this.progressValue) === 1) {
        this.stop()
      }
      }, 1000)
      },
      stop () {
       clearInterval(this.intervalID)
    },
      generateReport (id, pdf) {
        // UID da tab corrente
        console.log('UUID da tab seleccionada:', id)
       // console.log(Pack.api().get('/referredPatientsReport/printReport/'+ id).toString)
            Report.api().get(`/referredPatientsReport/printReport/${id}/${this.report}/pdf`,
            { responseType: 'blob' }).then(resp => {
              console.log(resp)
              console.log(resp.response.data)
                const file = new Blob([resp.response.data], { type: 'application/pdf' })
        const fileURL = URL.createObjectURL(file)
          const link = document.createElement('a')
          link.href = fileURL
          link.setAttribute('download', 'file.pdf')
          document.body.appendChild(link)
          link.click()
            })
      }
              //  const bytes = btoa(new Uint8Array(resp.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
             //  const url = 'data:application/pdf;base64, ' + bytes
        /*    const link = document.createElement('a')
             const downloadUrl = window.URL.createObjectURL(new Blob([resp.response.data]))
            link.href = downloadUrl
            link.setAttribute('download', 'file.pdf')
           document.body.appendChild(link)
            link.click()
            link.remove() */
        /*   axios({
              url: 'http://localhost:8884/report/',
            method: 'GET',
          responseType: 'blob' // important
             }).then((resp) => {
                const file = new Blob([resp.data], { type: 'application/pdf' })
      const fileURL = URL.createObjectURL(file)
        const link = document.createElement('a')
        link.href = fileURL
         link.setAttribute('download', 'file.pdf')
        document.body.appendChild(link)
        link.click()
             }) */
    //  }

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
