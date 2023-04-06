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
import UsedStockReport from 'src/reports/stock/UsedStockReport.ts'
import Stock from 'src/store/models/stock/Stock'
import reportDatesParams from '../../../reports/ReportDatesParams'
// import Drug from 'src/store/models/drug/Drug'
// import StockReceivedReport from 'src/store/models/report/stock/StockReceivedReport'
import { InventoryStockAdjustment } from 'src/store/models/stockadjustment/InventoryStockAdjustment'
import Drug from 'src/store/models/drug/Drug'
import StockUsedReport from 'src/store/models/report/stock/StockUsedReport'
import DestroyedStock from '../../../store/models/stockdestruction/DestroyedStock'
import ReferedStockMoviment from 'src/store/models/stockrefered/ReferedStockMoviment'
import StockOperationType from '../../../store/models/stockoperation/StockOperationType'
import PatientVisit from 'src/store/models/patientVisit/PatientVisit'
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
      this.getStockOperationToVue()
    },
    computed: {
    },
    components: {
      ListHeader: require('components/Shared/ListHeader.vue').default,
      FiltersInput: require('components/Reports/shared/FiltersInput.vue').default,
      Dialog: require('components/Shared/Dialog/Dialog.vue').default
    },
    methods: {
      closeSection () {
        this.$refs.filterUsedStockSection.remove()
      },
       initReportProcessing (params) {
        if (params.isOnline) {
          Report.apiInitUsedStockProcessing(params).then(resp => {
            this.progress = resp.response.data.progress
            setTimeout(this.getProcessingStatus(params), 2)
          })
        } else {
          this.getDataLocalDb(params)
        }
      },
      getProcessingStatus (params) {
        Report.getProcessingStatus('usedStockReportTemp', params).then(resp => {
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
      generateReport (id, fileType, params) {
       if (fileType === 'PDF') {
           UsedStockReport.downloadPDF(id, fileType, params).then(resp => {
                  if (resp === 204) this.displayAlert('error', 'Nao existem Dados para o periodo selecionado')
               })
        } else if (fileType === 'XLS') {
           UsedStockReport.downloadExcel(id, fileType, params).then(resp => {
                  if (resp === 204) this.displayAlert('error', 'Nao existem Dados para o periodo selecionado')
               })
        }
        // UID da tab corrent
      },
      displayAlert (type, msg) {
        this.alert.type = type
        this.alert.msg = msg
        this.alert.visible = true
      },
      closeDialog () {
        this.alert.visible = false
      },
     async getDataLocalDb (params) {
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
                const usedStock = new StockUsedReport()
                usedStock.fnmCode = drugObj.fnmCode
                usedStock.drugName = drugObj.name
                usedStock.actualStock = 0
                console.log(resultDrugsStocks.get(drugObj.id))
                 usedStock.receivedStock = 0
                 usedStock.adjustment = 0
               resultDrugsStocks.get(drugObj.id).forEach(stock => {
                usedStock.receivedStock += stock.unitsReceived
                usedStock.actualStock += stock.unitsReceived
                stockDestructedIds.forEach(drugStockDestruiction => {
                  if (drugStockDestruiction === stock.id) {
                    resultDrugStocksDestruction.get(drugStockDestruiction).forEach(destructionAdjustment => {
                    usedStock.adjustment -= destructionAdjustment.adjustedValue
                    usedStock.actualStock -= destructionAdjustment.adjustedValue
                    })
                  }
                })
                referredStocksIds.forEach(drugStockReferredId => {
                  if (drugStockReferredId === stock.id) {
                    resultDrugStocksReferred.get(drugStockReferredId).forEach(referredAdjustment => {
                      if (this.getStockOperationTypeById(referredAdjustment.operation.id).code === 'AJUSTE_POSETIVO') {
                        usedStock.adjustment += referredAdjustment.adjustedValue
                        usedStock.actualStock += referredAdjustment.adjustedValue
                      } else if (this.getStockOperationTypeById(referredAdjustment.operation.id).code === 'AJUSTE_NEGATIVO') {
                        usedStock.adjustment -= referredAdjustment.adjustedValue
                        usedStock.actualStock -= referredAdjustment.adjustedValue
                      }
                    })
                  }
                })
               })
              // console.log(resultDrugStocksInventory.get(drugObj.id))
              const inventoryAdjustmentList = resultDrugStocksInventory.get(drugObj.id) === undefined ? [] : resultDrugStocksInventory.get(drugObj.id)
               for (const inventoryAdjustment of inventoryAdjustmentList) {
                if (inventoryAdjustment.operation.code === 'AJUSTE_POSETIVO') {
                  usedStock.adjustment += inventoryAdjustment.adjustedValue
                  usedStock.actualStock += inventoryAdjustment.adjustedValue
                } else if (inventoryAdjustment.operation.code === 'AJUSTE_NEGATIVO') {
                  usedStock.adjustment -= inventoryAdjustment.adjustedValue
                  usedStock.actualStock -= inventoryAdjustment.adjustedValue
                }
                }
                if (resultDrugPackaged.get(drugObj.id) !== undefined) {
                resultDrugPackaged.get(drugObj.id).forEach(drugPackaged => {
                usedStock.stockIssued += drugPackaged.quantitySupplied
                usedStock.actualStock -= drugPackaged.quantitySupplied
               })
               }
               console.log(usedStock)
               usedStock.reportId = reportParams.id
          // patientHistory.period = reportParams.periodTypeView
              usedStock.year = reportParams.year
              usedStock.endDate = reportParams.endDate
               StockUsedReport.localDbAddOrUpdate(usedStock)
               }
          this.progress = 100
          params.progress = 100
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
