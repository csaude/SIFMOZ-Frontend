<template>
<div ref="filterMmiaSection">
  <ListHeader
    :addVisible="false"
    :mainContainer="true"
    :closeVisible="true"
    @closeSection="closeSection"
    bgColor="bg-orange-5">Serviço {{selectedService !== null ? selectedService.code : ''}}: Mapa Mensal de Informação de ARV (MMIA)
  </ListHeader>
  <div class="param-container">
    <q-item>
        <q-item-section  class="col" >
            <FiltersInput
              :id="id"
              :typeService="selectedService"
              :totalRecords="totalRecords"
              :qtyProcessed="qtyProcessed"
              :clinicalService="selectedService"
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
import ReportModel from 'src/store/models/report/ReportModel'
import { ref } from 'vue'
  export default {
    name: 'DrugStore',
    props: ['selectedService', 'menuSelected', 'id'],
    setup () {
      return {
        totalRecords: ref(0),
        qtyProcessed: ref(0)
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
        this.$refs.filterMmiaSection.remove()
      },
      initReportProcessing (params) {
        console.log(params)
        ReportModel.apiInitMmiaProcessing(params)
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
