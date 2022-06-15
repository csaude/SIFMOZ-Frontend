<template>
<div ref="filterDrugStoreSection">
  <ListHeader
    :addVisible="false"
    :mainContainer="true"
    :closeVisible="true"
    @closeSection="closeSection"
    bgColor="bg-orange-5">Serviço {{selectedService !== null ? selectedService.code : ''}}: Activos na Farmácia
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
import JsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import moment from 'moment'
import Report from 'src/store/models/report/Report'
import { LocalStorage } from 'quasar'
import { ref } from 'vue'
  export default {
    name: 'DrugStore',
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
        this.$refs.filterDrugStoreSection.remove()
      },
      initReportProcessing (params) {
          Report.apiInitActiveInDrugStoreProcessing(params).then(resp => {
            console.log(resp.response.data.progress)
            this.progress = resp.response.data.progress
            console.log(this.progress)
            setTimeout(this.getProcessingStatus(params), 2)
          })
         // Pack.api().post('/receivedStockReport/initReportProcess', params)
      },
      getProcessingStatus (params) {
        Report.getProcessingStatus('activePatientReport', params).then(resp => {
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
          Report.api().get(`/activePatientReport/printReport/${id}`, { responseType: 'json' }).then(resp => {
            const patientAux = resp.response.data[0]
          console.log(patientAux.province)

          if (fileType === 'PDF') {
            console.log(fileType)
            this.downloadPDF(
              null,
              patientAux.province,
              moment(patientAux.startDate, 'DD-MM-YYYY').format('DD/MM/YYYY'),
              moment(patientAux.endDate, 'DD-MM-YYYY').format('DD/MM/YYYY'),
              resp.response.data
            )
          } else {
            this.downloadExcel(
              null,
              patientAux.province,
              moment(patientAux.startDate, 'DD-MM-YYYY').format('DD/MM/YYYY'),
              moment(patientAux.endDate, 'DD-MM-YYYY').format('DD/MM/YYYY'),
              resp.response.data
            )
          }
        })
      },
      // generateReport (id, fileType) {
      //   // UID da tab corrente
      //    Report.api().get(`/activePatientReport/printReport/${id}/${fileType}`, { responseType: 'blob' }).then(resp => {
      //     const file = new Blob([resp.response.data], { type: 'application/pdf' })
      //     const fileURL = URL.createObjectURL(file)
      //     const link = document.createElement('a')
      //     link.href = fileURL
      //     link.setAttribute('download', 'ActivePatientReport.' + fileType)
      //     document.body.appendChild(link)
      //     link.click()
      //   })
      // },
      async downloadExcel (facility, province, startDate, endDate, params) {
        alert('Excel')
      },
      async downloadPDF (facility, province, startDate, endDate, result) {
        const doc = new JsPDF({
          orientation: 'l',
          unit: 'mm',
          format: 'a4',
          putOnlyUsedFonts: true,
          floatPrecision: 'smart' // or "smart", default is 16
        })
        // const image = new Image()
        // image.src = '/src/assets/MoHLogo.png';
        const width = doc.internal.pageSize.getWidth()
        /*
          Fill Table
        */
        const cols = [
          'ORD',
          'NID',
          'Nome',
          'Idade',
          'Contacto',
          'Tipo Paciente',
          'Linha Terapeutica',
          'Regime Terapeutico',
          'Data Levant.',
          'Data Prox. Levant.'
        ]
        const rows = result
        const data = []
        let ord = 1

        for (const row in rows) {
          const createRow = []
          createRow.push(ord)
          createRow.push(rows[row].nid)
          createRow.push(rows[row].firstNames + ' ' + rows[row].middleNames + ' ' + rows[row].lastNames)
          createRow.push(rows[row].age)
          createRow.push(rows[row].cellphone)
          createRow.push(rows[row].patientType)
          createRow.push(rows[row].therapeuticLine)
          createRow.push(rows[row].therapeuticRegimen)
          createRow.push(moment(rows[row].pickupDate, 'DD-MM-YYYY').format('DD/MM/YYYY'))
          createRow.push(rows[row].nextPickUpDate)

          data.push(createRow)
          ord += 1
        }
        ord = 0
        autoTable(doc, {
          margin: { top: 60 },
          columnStyles: {
            0: { cellWidth: 48 },
            1: { cellWidth: 55 },
            2: { cellWidth: 20 },
            3: { cellWidth: 26 }
          },
          bodyStyles: {
            halign: 'center'
          },
          headStyles: {
            halign: 'center',
            valign: 'middle'
          },
          didDrawPage: function (data) {
            // Header
            doc.setFontSize(16)
            doc.text('Lista de Pacientes Activos na Farmácia', width / 2, 40, {
              align: 'center'
            })
            doc.setFontSize(10)
            doc.text('Província: ' + province, width / 15, 57)
            doc.text('Data Início: ' + startDate, width / 2 + 98, 49)
            doc.text('Data Fim: ' + endDate, width / 2 + 98, 57)
            // doc.line(0, 35, 400, 50);
          },
          theme: 'grid',
          head: [cols],
          body: data
        })
        // params.value.loading.loading.hide()
        return doc.save('PacientesActivos.pdf')
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
