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
              moment(new Date(patientAux.startDate)).format('DD-MM-YYYY'),
              moment(new Date(patientAux.endDate)).format('DD-MM-YYYY'),
              resp.response.data
            )
          } else {
            this.downloadExcel(
              null,
              patientAux.province,
              moment(new Date(patientAux.startDate)).format('DD-MM-YYYY'),
              moment(new Date(patientAux.endDate)).format('DD-MM-YYYY'),
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
        const firstObject = result[0]
        const totalPagesExp = '{total_pages_count_string}'
        /*
          Fill Table
        */

       const desiredDefinition = [
      [
        {
          content: '                                                                                                        Lista de Pacientes Activos na Farmácia',
          colSpan: 3,
          halign: 'center',
          valign: 'middle',
          fontStyle: 'bold',
          fontSize: '14'
        }
      ],
      [
        {
          content: 'US: ' + firstObject.clinic,
          colSpan: 2,
          halign: 'center',
          valign: 'middle',
          fontStyle: 'bold',
          fontSize: '14'
        },
        {
          content: 'Periodo: ' + startDate + ' à ' + endDate,
          colSpan: 1,
          halign: 'center',
          valign: 'middle',
          fontStyle: 'bold',
          fontSize: '14'
        }
      ],
      [
        {
          content: 'Distrito: ' + firstObject.district,
          halign: 'center',
          valign: 'middle',
          fontStyle: 'bold',
          fontSize: '14'
         },
        {
          content: 'Provincia: ' + province,
          halign: 'center',
          valign: 'left',
          fontStyle: 'bold',
          fontSize: '14'
         },
        {
          content: 'Ano: ' + firstObject.year,
          halign: 'center',
          valign: 'left',
          fontStyle: 'bold',
          fontSize: '14'
         }
      ]
    ]
    autoTable(
      doc,

      {
        margin: { top: 20 },
        bodyStyles: {
          halign: 'left',
          valign: 'middle'
        },
        headStyles: {
          halign: 'center',
          valign: 'middle'
        },

        theme: 'grid',
        body: desiredDefinition
      }
    )

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
          createRow.push(moment(new Date(rows[row].pickupDate)).format('DD-MM-YYYY'))
          createRow.push(moment(new Date(rows[row].nextPickUpDate)).format('DD-MM-YYYY'))

          data.push(createRow)
          ord += 1
        }
        ord = 0
        autoTable(doc, {
          margin: { top: 20 },
          bodyStyles: {
            halign: 'center'
          },
          headStyles: {
            halign: 'center',
            valign: 'middle'
          },
          didDrawPage: function (data) {
            // Footer
            let str = 'Pagina ' + doc.internal.getNumberOfPages()
            // Total page number plugin only available in jspdf v1.0+
            if (typeof doc.putTotalPages === 'function') {
              str = str + ' de ' + totalPagesExp
            }
            doc.setFontSize(10)

          // jsPDF 1.4+ uses getWidth, <1.4 uses .width
          const pageSize = doc.internal.pageSize
          const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight()
          doc.text(str, data.settings.margin.left, pageHeight - 10)
          },
          startY: doc.lastAutoTable.finalY,
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
