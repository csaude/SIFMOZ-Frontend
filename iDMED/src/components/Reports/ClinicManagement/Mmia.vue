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
              :progress="progress"
              :clinicalService="selectedService"
              :applicablePeriods="periodType"
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
import { ref } from 'vue'
import { LocalStorage } from 'quasar'
import mmiaReport from '../../../reports/ClinicManagement/Mmia.ts'
import reportDatesParams from '../../../reports/ReportDatesParams'
import Stock from 'src/store/models/stock/Stock'
import { InventoryStockAdjustment } from 'src/store/models/stockadjustment/InventoryStockAdjustment'
import PatientVisit from 'src/store/models/patientVisit/PatientVisit'
import Drug from 'src/store/models/drug/Drug'
import DestroyedStock from '../../../store/models/stockdestruction/DestroyedStock'
import ReferedStockMoviment from 'src/store/models/stockrefered/ReferedStockMoviment'
import StockOperationType from '../../../store/models/stockoperation/StockOperationType'
import mixinIsOnline from 'src/mixins/mixin-is-online'
import MmiaRegimenSubReport from 'src/store/models/report/pharmacyManagement/MmiaRegimenSubReport'
import MmiaReport from 'src/store/models/report/pharmacyManagement/MmiaReport'
import MmiaStockReport from 'src/store/models/report/pharmacyManagement/MmiaStockReport'

  export default {
    name: 'DrugStore',
    props: ['selectedService', 'menuSelected', 'id'],
    mixins: [mixinIsOnline],
    setup () {
      return {
        totalRecords: ref(0),
        qtyProcessed: ref(0),
        periodType: { id: 2, description: 'Mensal', code: 'MONTH' },
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
      closeSection () {
        LocalStorage.remove(this.id)
        this.$refs.filterMmiaSection.remove()
      },
     async initReportProcessing (params) {
        if (this.isOnline) {
        if (params.periodType === 'MONTH') {
          Report.apiInitMmiaProcessing(params).then(resp => {
            this.progress = resp.response.data.progress
            setTimeout(this.getProcessingStatus(params), 2)
          })
        } else {
          this.displayAlert('error', 'O período seleccionado não é aplicavel a este relatório, por favor seleccionar o período [Mensal]')
        }
      } else {
       await this.getMmiaStockReport(params)
      const listRegimenSubReport = await this.getMmiaRegimenSubReport(params)
       await this.getMmiaReport(params, listRegimenSubReport)
      }
      },
      getProcessingStatus (params) {
        Report.getProcessingStatus('mmiaReport', params).then(resp => {
          this.progress = resp.response.data.progress
          if (this.progress < 100) {
            setTimeout(this.getProcessingStatus(params), 2)
          } else {
            params.progress = 100
            LocalStorage.set(params.id, params)
          }
        })
      },
      generateReport (id, fileType, params) {
        if (fileType === 'PDF') {
          mmiaReport.downloadPDF(id, params).then(resp => {
            if (resp === 204) this.displayAlert('error', 'Nao existem Dados para o periodo selecionado')
          })
        } else {
          mmiaReport.downloadExcel(id, params).then(resp => {
            if (resp === 204) this.displayAlert('error', 'Nao existem Dados para o periodo selecionado')
          })
        }
      },
      async getMmiaStockReport (params) {
        const reportParams = reportDatesParams.determineStartEndDate(params)
        console.log(reportParams)
        let resultDrugsStocks = []
        let resultDrugStocksInventory = []
        let resultDrugStocksDestruction = []
         let resultDrugStocksReferred = []
       // let resultDrugStockReferred = []
        let resultDrugPackaged = []
        let arrayDrugStock = []
     const stocks = await Stock.localDbGetUsedStock(params)
          console.log(stocks)
       const result = stocks.filter(stock => (stock.entrance.dateReceived >= reportParams.startDate && stock.entrance.dateReceived <= reportParams.endDate))
          console.log(result)
           resultDrugsStocks = this.groupedMap(result, 'drug_id')
          console.log(resultDrugsStocks)
          arrayDrugStock = Array.from(resultDrugsStocks.keys())
          console.log(arrayDrugStock)
         // return arrayDrugStock
        const inventoryStockAdjustments = await InventoryStockAdjustment.localDbGetAll()
            const inventoryStocks = inventoryStockAdjustments.filter(inventoryStock =>
              (inventoryStock.inventory.startDate >= reportParams.startDate && inventoryStock.inventory.endDate <= reportParams.endDate) && arrayDrugStock.includes(inventoryStock.adjustedStock.drug.id)
            )
            resultDrugStocksInventory = this.groupedMapChild(inventoryStocks, 'adjustedStock.drug.id')
            console.log(resultDrugStocksInventory)
           // return resultDrugStocksInventory

       const packs = await PatientVisit.localDbGetPacks()
            const packagedDrug = []
            const packsDate = packs.filter(pack =>
              (pack.pickupDate >= reportParams.startDate && pack.pickupDate <= reportParams.endDate))
              console.log(packsDate)
              packsDate.forEach(pack => {
                pack.packagedDrugs.forEach(item => {
                  packagedDrug.push(item)
                })
              })
              console.log(packagedDrug)
              resultDrugPackaged = this.groupedMapChildPack(packagedDrug, 'drug.id')
              console.log(resultDrugPackaged)
            //  return resultDrugPackaged
         const destroyedStocks = await DestroyedStock.localDbGetAll()
            const adjustedDestroyedStocks = []
          let resultDestruccted = []
            console.log(destroyedStocks)
            resultDestruccted = destroyedStocks.filter(destroyedStock => (destroyedStock.date >= reportParams.startDate && destroyedStock.date <= reportParams.endDate))
            console.log(resultDestruccted)
            resultDestruccted.forEach(destroyedStock => {
            destroyedStock.adjustments.forEach(destroyedAdjust => {
              adjustedDestroyedStocks.push(destroyedAdjust)
            })
          })
          resultDrugStocksDestruction = this.groupedMapChildAdjustments(adjustedDestroyedStocks, 'adjustedStock')
          console.log(resultDrugStocksDestruction)
         //  return resultDrugStocksInventory
        const referredStocks = await ReferedStockMoviment.localDbGetAll()
            const adjustedReferedStocks = []
          let resultAdjustedReferred = []
            console.log(referredStocks)
            resultAdjustedReferred = referredStocks.filter(referredStock => (referredStock.date >= reportParams.startDate && referredStock.date <= reportParams.endDate))
            console.log(resultAdjustedReferred)
            resultAdjustedReferred.forEach(referredStock => {
              referredStock.adjustments.forEach(referredAdjust => {
                adjustedReferedStocks.push(referredAdjust)
            })
          })
           resultDrugStocksReferred = this.groupedMapChildAdjustments(adjustedReferedStocks, 'adjustedStock')
          console.log(resultDrugStocksReferred)
          // return resultDrugStocksReferred
          const drugsIds = Array.from(resultDrugsStocks.keys())
          const stockDestructedIds = Array.from(resultDrugStocksDestruction.keys())
          const referredStocksIds = Array.from(resultDrugStocksReferred.keys())
          console.log(drugsIds)
          console.log(stockDestructedIds)
          console.log(referredStocksIds)
         for (const drug of drugsIds) {
             const drugObj = await Drug.localDbGetByDrugId(drug)
                const mmiaReport = new MmiaStockReport()
                mmiaReport.unit = drugObj.packSize
                mmiaReport.fnmCode = drugObj.fnmCode
                mmiaReport.drugName = drugObj.name
                console.log(resultDrugsStocks.get(drugObj.id))
                 mmiaReport.initialEntrance = 0
                 mmiaReport.lossesAdjustments = 0
               resultDrugsStocks.get(drugObj.id).forEach(stock => {
                mmiaReport.initialEntrance += stock.unitsReceived
                stockDestructedIds.forEach(drugStockDestruiction => {
                  if (drugStockDestruiction === stock.id) {
                    resultDrugStocksDestruction.get(drugStockDestruiction).forEach(destructionAdjustment => {
                    mmiaReport.lossesAdjustments -= destructionAdjustment.adjustedValue
                    })
                  }
                })
                referredStocksIds.forEach(drugStockReferredId => {
                  if (drugStockReferredId === stock.id) {
                    resultDrugStocksReferred.get(drugStockReferredId).forEach(referredAdjustment => {
                      if (this.getStockOperationTypeById(referredAdjustment.operation.id).code === 'AJUSTE_POSETIVO') {
                        mmiaReport.lossesAdjustments += referredAdjustment.adjustedValue
                      } else if (this.getStockOperationTypeById(referredAdjustment.operation.id).code === 'AJUSTE_NEGATIVO') {
                        mmiaReport.lossesAdjustments -= referredAdjustment.adjustedValue
                      }
                    })
                  }
                })
               })
               const maxDateObject = resultDrugsStocks.get(drugObj.id).reduce((maxObject, obj) => {
                      if (moment(obj.expireDate).format('YYYY/MM/DD') > moment(maxObject.expireDate).format('YYYY/MM/DD')) {
                        return obj
                      }
                      return maxObject
                    })
                   mmiaReport.expireDate = moment(maxDateObject.expireDate).format('DD-MM-YYYY')

              // console.log(resultDrugStocksInventory.get(drugObj.id))
              const inventoryAdjustmentList = resultDrugStocksInventory.get(drugObj.id) === undefined ? [] : resultDrugStocksInventory.get(drugObj.id)
               for (const inventoryAdjustment of inventoryAdjustmentList) {
                if (inventoryAdjustment.operation.code === 'AJUSTE_POSETIVO') {
                  mmiaReport.lossesAdjustments += inventoryAdjustment.adjustedValue
                } else if (inventoryAdjustment.operation.code === 'AJUSTE_NEGATIVO') {
                  mmiaReport.lossesAdjustments -= inventoryAdjustment.adjustedValue
                }
                }
                if (resultDrugPackaged.get(drugObj.id) !== undefined) {
                resultDrugPackaged.get(drugObj.id).forEach(drugPackaged => {
                mmiaReport.outcomes += drugPackaged.quantitySupplied
               })
               }
              mmiaReport.inventory = mmiaReport.initialEntrance + mmiaReport.lossesAdjustments + mmiaReport.outcomes
               console.log(mmiaReport)
               mmiaReport.reportId = reportParams.id
          // patientHistory.period = reportParams.periodTypeView
              mmiaReport.year = reportParams.year
              mmiaReport.endDate = reportParams.endDate
              mmiaReport.clinic = reportParams.clinic
               MmiaStockReport.localDbAddOrUpdate(mmiaReport)
               }
          this.progress = 100
          params.progress = 100
      },
      async getMmiaRegimenSubReport (params) {
        const listRegimeReports = []
        const reportParams = reportDatesParams.determineStartEndDate(params)
        const patientVisitList = await PatientVisit.localDbGetAllPatientVisit()
        for (const patientVisit of patientVisitList) {
          if ((patientVisit.visitDate >= reportParams.startDate && patientVisit.visitDate <= reportParams.endDate)) {
          for (const patientVisitDetail of patientVisit.patientVisitDetails) {
            const regSubReport = new MmiaRegimenSubReport()
            regSubReport.reportId = reportParams.id
            regSubReport.code = patientVisitDetail.prescription.prescriptionDetails[0].therapeuticRegimen.code
            regSubReport.regimen = patientVisitDetail.prescription.prescriptionDetails[0].therapeuticRegimen.description
            regSubReport.lineCode = patientVisitDetail.prescription.prescriptionDetails[0].therapeuticLine.code
            regSubReport.line = patientVisitDetail.prescription.prescriptionDetails[0].therapeuticLine.description
            if (this.isReferido(patientVisitDetail)) {
              regSubReport.comunitaryClinic = Number(regSubReport.comunitaryClinic) + 1
            } else {
              regSubReport.totalPatients = Number(regSubReport.totalPatients) + 1
            }
            listRegimeReports.push(regSubReport)
            MmiaRegimenSubReport.localDbAddOrUpdate(regSubReport)
            }
          }
          }
          return listRegimeReports
      },
      async getMmiaReport (params, listRegimenSubReport) {
        const reportParams = reportDatesParams.determineStartEndDate(params)
        const patientVisitList = await PatientVisit.localDbGetAllPatientVisit()
        let totalDM = 0
        let totalDsM0 = 0
        let totalDtM0 = 0
        const curMmiaReport = new MmiaReport()
        for (const patientVisit of patientVisitList) {
          if ((patientVisit.visitDate >= reportParams.startDate && patientVisit.visitDate <= reportParams.endDate)) {
                  const patientVisitDetail = patientVisit.patientVisitDetails[0]
                    if (patientVisitDetail.episode.patientServiceIdentifier.service.code === 'PREP') {
                      curMmiaReport.totalPacientesPREP++
                    }
                    curMmiaReport.reportId = reportParams.id
                    const birthDate = moment(patientVisit.patient.dateOfBirth)
                    const age = moment(reportParams.endDate, 'YYYY/MM/DDDD').diff(birthDate, 'years')
                    console.log('IDADE', moment(reportParams.endDate, 'YYYY/MM/DDDD').diff(birthDate, 'years'))
                    if (age >= 18) {
                        curMmiaReport.addTotalPacientesAdulto()
                    } else if (age >= 0 && age <= 4) {
                      //  println(adult++)
                        curMmiaReport.totalPacientes04++
                    } else if (age >= 5 && age <= 9) {
                        curMmiaReport.totalPacientes59++
                    } else if (age >= 10 && age <= 14) {
                        curMmiaReport.totalPacientes1014++
                    }
                    if (patientVisitDetail.episode.startStopReason.code === 'NOVO') {
                        curMmiaReport.totalPacientesInicio++
                    } else if (patientVisitDetail.episode.startStopReason.code === 'MANUTENCAO') {
                        curMmiaReport.totalPacientesManter++
                    } else if (patientVisitDetail.episode.startStopReason.code === 'ALTERACAO') {
                        curMmiaReport.totalPacientesAlterar++
                    } else if (patientVisitDetail.episode.startStopReason.code === 'TRANSITO') {
                        curMmiaReport.totalPacientesTransito++
                    } else if (patientVisitDetail.prescription.patientType === 'TRANSFERENCIA') {
                        curMmiaReport.totalPacientesTransferido++
                    }

                    const detail = patientVisitDetail.prescription.prescriptionDetails[0]

                    for (const newRegimenSubReport of listRegimenSubReport) {
                      MmiaRegimenSubReport.localDbAddOrUpdate(newRegimenSubReport)
                    }
                    if (detail.dispenseType.code === 'DM') {
                      totalDM++
                    } else if (detail.dispenseType.code === 'DT') {
                       totalDtM0++
                    } else if (detail.dispenseType.code === 'DS') {
                       totalDsM0++
                    }

            curMmiaReport.dsM1 = await PatientVisit.countPacksByDispenseTypeAndServiceOnPeriod('DS', reportParams.clinicalService, this.determineDate(reportParams.startDate, 1), this.determineDate(reportParams.endDate, 1))
            curMmiaReport.dsM2 = await PatientVisit.countPacksByDispenseTypeAndServiceOnPeriod('DS', reportParams.clinicalService, this.determineDate(reportParams.startDate, 2), this.determineDate(reportParams.endDate, 2))
            curMmiaReport.dsM3 = await PatientVisit.countPacksByDispenseTypeAndServiceOnPeriod('DS', reportParams.clinicalService, this.determineDate(reportParams.startDate, 3), this.determineDate(reportParams.endDate, 3))
            curMmiaReport.dsM4 = await PatientVisit.countPacksByDispenseTypeAndServiceOnPeriod('DS', reportParams.clinicalService, this.determineDate(reportParams.startDate, 4), this.determineDate(reportParams.endDate, 4))
            curMmiaReport.dsM5 = await PatientVisit.countPacksByDispenseTypeAndServiceOnPeriod('DS', reportParams.clinicalService, this.determineDate(reportParams.startDate, 5), this.determineDate(reportParams.endDate, 5))

            curMmiaReport.dtM1 = await PatientVisit.countPacksByDispenseTypeAndServiceOnPeriod('DT', reportParams.clinicalService, this.determineDate(reportParams.startDate, 1), this.determineDate(reportParams.endDate, 1))
            curMmiaReport.dtM2 = await PatientVisit.countPacksByDispenseTypeAndServiceOnPeriod('DT', reportParams.clinicalService, this.determineDate(reportParams.startDate, 2), this.determineDate(reportParams.endDate, 2))
            }
          }
          curMmiaReport.dM = totalDM
          curMmiaReport.dtM0 = totalDtM0
          curMmiaReport.dsM0 = totalDsM0
          MmiaReport.localDbAddOrUpdate(curMmiaReport)
          },
          determineDate (date, month) {
          return moment(date, 'DD-MM-YYYY').subtract(month, 'months')
          },
      isReferido (patientVisitDetail) {
       return patientVisitDetail.episode.startStopReason.code === 'TRANSFERIDO_DE'
      },
      groupedMap (items, key) {
    return items.reduce(
        (entryMap, e) => entryMap.set(e[key], [...(entryMap.get(e[key]) || []), e], console.log(e[key])),
        new Map()
      )
    },
    groupedMapChild (items, key) {
    return items.reduce(
        (entryMap, e) => entryMap.set(e.adjustedStock.drug.id, [...(entryMap.get(e.adjustedStock.drug.id) || []), e], console.log(e.adjustedStock.drug.id)),
        new Map()
      )
    },
    groupedMapChildPack (items, key) {
    return items.reduce(
        (entryMap, e) => entryMap.set(e.drug.id, [...(entryMap.get(e.drug.id) || []), e], console.log(e.drug.id)),
        new Map()
      )
    },
    groupedMapChildAdjustments (items, key) {
    return items.reduce(
        (entryMap, e) => entryMap.set(e.adjustedStock.id, [...(entryMap.get(e.adjustedStock.id) || []), e], console.log(e.adjustedStock.id)),
        new Map()
      )
    },
    getStockOperationTypeById (id) {
      console.log(StockOperationType.query().where('id', id).first())
        return StockOperationType.query().where('id', id).first()
      },
      getStockOperationToVue () {
       StockOperationType.localDbGetAll().then(stockOperationTypes => {
        StockOperationType.insert({ data: stockOperationTypes })
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
