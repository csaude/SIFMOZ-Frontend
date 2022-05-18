<template>
<div ref="filterUsedStockSection">
  <ListHeader
    :addVisible="false"
    :mainContainer="true"
    :closeVisible="true"
    @closeSection="closeSection"
    bgColor="bg-orange-5">Serviço {{selectedService !== null ? selectedService.code : ''}}: Lista de Stock Usado
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
import { LocalStorage } from 'quasar'
import { ref } from 'vue'
  export default {
    name: 'UsedStock',
    props: ['selectedService', 'menuSelected', 'id'],
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
        this.$refs.filterUsedStockSection.remove()
      },
       initReportProcessing (params) {
          Report.apiInitUsedStockProcessing(params).then(resp => {
            console.log(resp.response.data.progress)
            this.progress = resp.response.data.progress
            console.log(this.progress)
            setTimeout(this.getProcessingStatus(params), 2)
          })
      },
      getProcessingStatus (params) {
        Report.getProcessingStatus('usedStockReport', params).then(resp => {
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
         Report.api().get(`/usedStockReport/printReport/${id}/${fileType}`, { responseType: 'blob' }).then(resp => {
          const file = new Blob([resp.response.data], { type: 'application/pdf' })
          const fileURL = URL.createObjectURL(file)
          const link = document.createElement('a')
          link.href = fileURL
          link.setAttribute('download', 'usedStockReport.' + fileType)
          document.body.appendChild(link)
          link.click()
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
