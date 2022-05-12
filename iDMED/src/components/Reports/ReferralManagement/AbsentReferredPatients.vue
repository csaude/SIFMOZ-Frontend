<template>
<div ref="filterDrugStoreSection">
  <ListHeader
    :addVisible="false"
    :mainContainer="true"
    :closeVisible="true"
    @closeSection="closeSection"
    bgColor="bg-orange-5">Serviço {{selectedService !== null ? selectedService.code : ''}}: Referidos Faltosos ao levantamento
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
            />
        </q-item-section>
    </q-item>
  </div>
  </div>
</template>

<script>

import Pack from 'src/store/models/packaging/Pack'
import { ref } from 'vue'
  export default {
    name: 'AbsentReferredPatients',
    props: ['selectedService', 'menuSelected', 'id'],
    setup () {
      return {
        totalRecords: ref(0),
        qtyProcessed: ref(0),
        report: 'REFERIDOS_FALTOSOS_AO_LEVANTAMENTO'
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
         Pack.api().post('/referredPatientsReport/initReportProcess', params)
      },
      generateReport (id, fileType) {
        // UID da tab corrente
        console.log('UUID da tab seleccionada:', id)
            Pack.api().get('/report/',
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
