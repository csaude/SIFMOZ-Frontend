import { Model } from '@vuex-orm/core'
import { StockAdjustment } from '../stockadjustment/StockAdjustmentHierarchy'
import StockLevel from '../stocklevel/StockLevel'
import StockEntrance from '../stockentrance/StockEntrance'
import StockCenter from '../stockcenter/StockCenter'
import Drug from '../drug/Drug'
import Clinic from '../clinic/Clinic'
import { date } from 'quasar'
import PackagedDrugStock from '../packagedDrug/PackagedDrugStock'
import { v4 as uuidv4 } from 'uuid'
import { nSQL } from 'nano-sql'

export default class Stock extends Model {
    static entity = 'stocks'

    static fields () {
        return {
            id: this.uid(() => uuidv4()),
            expireDate: this.attr(''),
            auxExpireDate: this.attr(''),
            modified: this.boolean(false),
            shelfNumber: this.attr(''),
            unitsReceived: this.number(0),
            stockMoviment: this.number(0),
            manufacture: this.attr(''),
            batchNumber: this.attr(''),
            hasUnitsRemaining: this.boolean(false),
            entrance_id: this.attr(null),
            stock_center_id: this.attr(null),
            drug_id: this.attr(null),
            enabled: this.boolean(false),
            clinic_id: this.attr(''),
            syncStatus: this.attr(''),
            // relationships
            clinic: this.belongsTo(Clinic, 'clinic_id'),
            adjustments: this.hasMany(StockAdjustment, 'adjusted_stock_id'),
            entrance: this.belongsTo(StockEntrance, 'entrance_id'),
            center: this.belongsTo(StockCenter, 'stock_center_id'),
            stockLevel: this.hasOne(StockLevel, 'stock_id'),
            drug: this.belongsTo(Drug, 'drug_id'),
            packagedDrugStocks: this.hasMany(PackagedDrugStock, 'stock_id')
        }
    }

    static async apiSave (stock) {
      return await this.api().post('/stock', stock)
    }

    static async apiRemove (id) {
      return await this.api().delete(`/stock/${id}`)
    }

    static async apiUpdate (stock) {
      return await this.api().patch('/stock/' + stock.id, stock)
    }

    static async apiGetAll (offset, max) {
      return await this.api().get('/stock?offset=' + offset + '&max=' + max)
    }

    isInUse () {
      return (this.packagedDrugStocks !== undefined && this.packagedDrugStocks.length > 0) || this.adjustments.length > 0
    }

    getFormatedExpireDate () {
      return this.formatDate(this.expireDate)
    }

    formatDate (dateString) {
      return date.formatDate(dateString, 'DD-MM-YYYY')
    }

    static async apiGetDrugSummary (clinicId, drugId) {
      return await this.api().get(`/drugStockFile/sumary/${clinicId}/${drugId}`)
    }

    static async apiGetDrugBatchSummary (clinicId, stockId) {
      return await this.api().get(`/drugStockFile/batchsumary/${clinicId}/${stockId}`)
    }

    static getClassName () {
      return 'stock'
    }

    static localDbAddOrUpdate (targetCopy) {
      return nSQL().onConnected(() => {
        nSQL(this.entity).query('upsert',
        targetCopy
      ).exec()
      Stock.insertOrUpdate({ data: targetCopy })
    })
    }

    static localDbGetAll () {
      return nSQL(this.entity).query('select').exec().then(result => {
        console.log(result)
        Stock.insertOrUpdate({ data: result })
        })
    }

    static localDbGetUsedStock (reportParams) {
      return nSQL(this.entity).query('select').exec().then(result => {
         console.log(result)
         return result
       })
       //  'AND',
       // ['stock.drug.clinicalService.id]', '=', reportParams.clinicalService
   }

    static async localDbGetById (stock) {
     return nSQL(this.entity).query('select').where(['id', '=', stock.id]).exec().then(result => {
        console.log(result)
        // Stock.insert({ data: result })
        return result[0]
      })
  }

  static localDbGetByStockEntranceId (stockEntrance) {
   return nSQL(this.entity).query('select').where(['stocks[entrance_id]', '=', stockEntrance.id]).exec().then(result => {
      console.log(result)
      return result
    })
}

static localDbGetByDrug (drug) {
  return nSQL(this.entity).query('select').where(['drug_id', '=', drug.id]).exec().then(result => {
     console.log(result)
     return result
   })
}

  static localDbDeleteById (stock) {
    return nSQL().onConnected(() => {
      nSQL(this.entity).query('delete').where(['id', '=', stock.id]).exec()
    Stock.delete(stock.id)
  })
}

static async localDbGetStockBalanceByDrug (drug) {
  let balance = 0
  return nSQL(this.entity).query('select').where(['drug_id', '=', drug.id]).exec().then(result => {
     console.log(result)
     for (const item of result) {
      balance += item.stockMoviment
     // Stock.insert({ data: result })
     }
     return balance
   })
}

static async localDbGetQuantitySuppliedByDrug (drug) {
  let drugQuantitySupplied = 0
  return nSQL('patientVisits').query('select', ['patientVisitDetails']).exec().then(result => {
    for (const pvd of result) {
       for (const pvdObj of pvd.patientVisitDetails) {
      // if (pvd.pack.pickupDate > new Date()) {
        for (const pcd of pvdObj.pack.packagedDrugs) {
            if (pcd.drug_id === drug.id) {
              drugQuantitySupplied += Number(pcd.quantitySupplied)
            }
      }
    }
   // }
  }
  return drugQuantitySupplied
   })
  }
// Resumo por drug

static async getDestructionsDrugFile (drug) {
  const recordFileList = []
  return nSQL('destroyedStocks').query('select')
.exec().then(result => {
  for (const item of result) {
    const recordFile = {}
    for (const adjustment of item.adjustments) {
      if (adjustment.adjustedStock.drug_id === drug.id) {
        recordFile.id = uuidv4()
        recordFile.eventDate = item.date
        recordFile.moviment = 'Perda'
        recordFile.orderNumber = ''
        recordFile.incomes = 0
        recordFile.outcomes = 0
        recordFile.posetiveAdjustment = 0
        recordFile.negativeAdjustment = 0
        recordFile.loses = adjustment.adjustedValue
        recordFile.balance = 0
        recordFile.code = adjustment.operation.code
        recordFile.stockId = ''
        recordFile.notes = ''
        recordFileList.push(recordFile)
      }
    }
    /*
    */
  }
return recordFileList
})
}

static async getAdjustmentsDrugFile (drug) {
  const recordFileList = []
  return nSQL('referedStockMoviments').query('select')
.exec().then(result => {
  for (const item of result) {
    const recordFile = {}
    for (const adjustment of item.adjustments) {
      if (adjustment.adjustedStock.drug_id === drug.id && (adjustment.operation.code === 'AJUSTE_POSETIVO' || adjustment.operation.code === 'AJUSTE_NEGATIVO')) {
        recordFile.id = uuidv4()
        recordFile.eventDate = item.date
        recordFile.moviment = adjustment.operation.code === 'AJUSTE_POSETIVO' ? 'Ajuste Posetivo' : 'Ajuste Negativo'
        recordFile.orderNumber = ''
        recordFile.incomes = 0
        recordFile.outcomes = 0
        recordFile.posetiveAdjustment = adjustment.operation.code === 'AJUSTE_POSETIVO' ? adjustment.adjustedValue : 0
        recordFile.negativeAdjustment = adjustment.operation.code === 'AJUSTE_NEGATIVO' ? adjustment.adjustedValue : 0
        recordFile.loses = 0
        recordFile.balance = 0
        recordFile.code = adjustment.operation.code
        recordFile.stockId = ''
        recordFile.notes = ''
        recordFileList.push(recordFile)
      }
    }
    /*
    */
  }
return recordFileList
})
}

static async getInventoryAdjustmentsDrugFile (drug) {
  const recordFileList = []
  return nSQL('inventoryStockAdjustments').query('select')
.exec().then(result => {
  for (const adjustment of result) {
    const recordFile = {}
      if (adjustment.adjustedStock.drug_id === drug.id && (adjustment.operation.code === 'AJUSTE_POSETIVO' || adjustment.operation.code === 'AJUSTE_NEGATIVO')) {
        recordFile.id = uuidv4()
        recordFile.eventDate = adjustment.captureDate
        recordFile.moviment = 'Inventário'
        recordFile.orderNumber = ''
        recordFile.incomes = 0
        recordFile.outcomes = 0
        recordFile.posetiveAdjustment = adjustment.operation.code === 'AJUSTE_POSETIVO' ? adjustment.adjustedValue : 0
        recordFile.negativeAdjustment = adjustment.operation.code === 'AJUSTE_NEGATIVO' ? adjustment.adjustedValue : 0
        recordFile.loses = 0
        recordFile.balance = 0
        recordFile.code = adjustment.operation.code
        recordFile.stockId = ''
        recordFile.notes = ''
        recordFileList.push(recordFile)
      }
    /*
    */
  }
return recordFileList
})
}

static async getEntrancesDrugFile (drug) {
  const recordFileList = []
  return nSQL('stocks').query('select', ['SUM(stocks.unitsReceived) AS stockEntrances.incomes', 'stockEntrances.dateReceived', 'stockEntrances.orderNumber']).where(['drug_id', '=', drug.id])
  .join({
    type: 'inner',
    table: 'stockEntrances',
    where: ['stocks.entrance_id', '=', 'stockEntrances.id']
})
.groupBy({
  'stockEntrances.id': 'asc',
  'stockEntrances.dateReceived': 'asc',
  'stockEntrances.orderNumber': 'asc',
  'stocks.drug_id': 'asc',
  'stockEntrances.clinic_id': 'asc'
})
.exec().then(result => {
  for (const item of result) {
    const recordFile = {}
    recordFile.id = uuidv4()
    recordFile.eventDate = item['stockEntrances.dateReceived']
    recordFile.moviment = 'Entrada de Stock'
    recordFile.orderNumber = item['stockEntrances.orderNumber']
    recordFile.incomes = item['stockEntrances.incomes']
    recordFile.outcomes = 0
    recordFile.posetiveAdjustment = 0
    recordFile.negativeAdjustment = 0
    recordFile.loses = 0
    recordFile.balance = 0
    recordFile.code = 'ENTRADA'
    recordFile.stockId = ''
    recordFile.notes = ''

    recordFileList.push(recordFile)
    /*
    */
  }
return recordFileList
})
}

static async getPacksDrugFile (drug) {
    const recordFileList = []
    let drugQuantitySupplied = 0
    return nSQL('patientVisits').query('select', ['patientVisitDetails']).exec().then(result => {
      for (const pvd of result) {
         for (const pvdObj of pvd.patientVisitDetails) {
        // if (pvd.pack.pickupDate > new Date()) {
          for (const pcd of pvdObj.pack.packagedDrugs) {
            if (pcd.drug_id === drug.id) {
              const recordFile = {}
            for (const pcdStockObj of pcd.packagedDrugStocks) {
                drugQuantitySupplied += Number(pcdStockObj.quantitySupplied)
              }
            recordFile.id = uuidv4()
            recordFile.eventDate = pvdObj.pack.pickupDate
            recordFile.moviment = 'Saídas'
            recordFile.orderNumber = ''
            recordFile.incomes = 0
            recordFile.outcomes = drugQuantitySupplied
            recordFile.posetiveAdjustment = 0
            recordFile.negativeAdjustment = 0
            recordFile.loses = 0
            recordFile.balance = 0
            recordFile.code = 'SAIDA'
            recordFile.notes = ''
            recordFileList.push(recordFile)
          }
      }
     // }
    }
     }
     return recordFileList
    })
  }

  // Resumo por Stock

  static async getDestructionsDrugFileBatch (clinicId, stockId) {
    const recordFileList = []
    return nSQL('destroyedStocks').query('select')
  .exec().then(result => {
    for (const item of result) {
      const recordFile = {}
      for (const adjustment of item.adjustments) {
        if (adjustment.adjustedStock.id === stockId) {
          recordFile.id = uuidv4()
          recordFile.eventDate = item.date
          recordFile.moviment = 'Perda'
          recordFile.orderNumber = ''
          recordFile.incomes = 0
          recordFile.outcomes = 0
          recordFile.posetiveAdjustment = 0
          recordFile.negativeAdjustment = 0
          recordFile.loses = adjustment.adjustedValue
          recordFile.balance = 0
          recordFile.code = adjustment.operation.code
          recordFile.stockId = ''
          recordFile.notes = ''
          recordFileList.push(recordFile)
        }
      }
      /*
      */
    }
  return recordFileList
  })
  }

  static async getAdjustmentsDrugFileBatch (stockId) {
    const recordFileList = []
    return nSQL('referedStockMoviments').query('select')
  .exec().then(result => {
    for (const item of result) {
      const recordFile = {}
      for (const adjustment of item.adjustments) {
        if (adjustment.adjustedStock.id === stockId && (adjustment.operation.code === 'AJUSTE_POSETIVO' || adjustment.operation.code === 'AJUSTE_NEGATIVO')) {
          recordFile.id = uuidv4()
          recordFile.eventDate = item.date
          recordFile.moviment = adjustment.operation.code === 'AJUSTE_POSETIVO' ? 'Ajuste Posetivo' : 'Ajuste Negativo'
          recordFile.orderNumber = ''
          recordFile.incomes = 0
          recordFile.outcomes = 0
          recordFile.posetiveAdjustment = adjustment.operation.code === 'AJUSTE_POSETIVO' ? adjustment.adjustedValue : 0
          recordFile.negativeAdjustment = adjustment.operation.code === 'AJUSTE_NEGATIVO' ? adjustment.adjustedValue : 0
          recordFile.loses = 0
          recordFile.balance = 0
          recordFile.code = adjustment.operation.code
          recordFile.stockId = ''
          recordFile.notes = ''
          recordFileList.push(recordFile)
        }
      }
      /*
      */
    }
  return recordFileList
  })
  }

  static async getInventoryAdjustmentsDrugFileBatch (stockId) {
    const recordFileList = []
    return nSQL('inventoryStockAdjustments').query('select')
    .join({
      type: 'inner',
      table: 'inventorys',
      where: ['inventoryStockAdjustments.inventory_id', '=', 'inventorys.id']
  })
  .exec().then(result => {
    for (const adjustment of result) {
      const recordFile = {}
        if (adjustment['inventoryStockAdjustments.adjustedStock'].id === stockId) {
          recordFile.id = uuidv4()
          recordFile.eventDate = adjustment['inventoryStockAdjustments.captureDate']
          recordFile.moviment = 'Inventário'
          recordFile.orderNumber = ''
          recordFile.incomes = 0
          recordFile.outcomes = 0
          recordFile.posetiveAdjustment = adjustment['inventoryStockAdjustments.operation'].code === 'AJUSTE_POSETIVO' ? adjustment['inventoryStockAdjustments.adjustedValue'] : 0
          recordFile.negativeAdjustment = adjustment['inventoryStockAdjustments.operation'].code === 'AJUSTE_NEGATIVO' ? adjustment['inventoryStockAdjustments.adjustedValue'] : 0
          recordFile.loses = 0
          recordFile.balance = 0
          recordFile.code = adjustment['inventoryStockAdjustments.operation'].code
          recordFile.stockId = ''
          recordFile.notes = ''
          recordFileList.push(recordFile)
        }
      /*
      */
    }
  return recordFileList
  })
  }

  static async getEntrancesDrugFileBatch (stockId) {
    const recordFileList = []
    return nSQL('stocks').query('select', ['SUM(stocks.unitsReceived) AS stockEntrances.incomes', 'stocks.id', 'stockEntrances.dateReceived', 'stockEntrances.orderNumber'])
    .where(['id', '=', stockId])
    .join({
      type: 'inner',
      table: 'stockEntrances',
      where: ['stocks.entrance_id', '=', 'stockEntrances.id']
  })
  .groupBy({
    'stockEntrances.id': 'asc',
    'stockEntrances.dateReceived': 'asc',
    'stockEntrances.orderNumber': 'asc',
    'stocks.drug_id': 'asc',
    'stockEntrances.clinic_id': 'asc'
  })
  .exec().then(result => {
    for (const item of result) {
      const recordFile = {}
      recordFile.id = uuidv4()
      recordFile.eventDate = item['stockEntrances.dateReceived']
      recordFile.moviment = 'Entrada de Stock'
      recordFile.orderNumber = item['stockEntrances.orderNumber']
      recordFile.incomes = item['stockEntrances.incomes']
      recordFile.outcomes = 0
      recordFile.posetiveAdjustment = 0
      recordFile.negativeAdjustment = 0
      recordFile.loses = 0
      recordFile.balance = 0
      recordFile.code = 'ENTRADA'
      recordFile.stockId = item['stocks.id']
      recordFile.notes = ''

      recordFileList.push(recordFile)
      /*
      */
    }
return recordFileList
  })
  }

  static async getPacksDrugFileBatch (stockId) {
    const recordFileList = []
    let drugQuantitySupplied = 0
    return nSQL('patientVisits').query('select', ['patientVisitDetails'])
    .exec().then(result => {
      for (const pvd of result) {
         for (const pvdObj of pvd.patientVisitDetails) {
        // if (pvd.pack.pickupDate > new Date()) {
          for (const pcd of pvdObj.pack.packagedDrugs) {
            for (const pcdStockObj of pcd.packagedDrugStocks) {
              if (pcd.stock_id === stockId) {
                    const recordFile = {}
                    drugQuantitySupplied += Number(pcd.quantitySupplied)
                    recordFile.stockId = pcdStockObj.stock_id
                    recordFile.id = uuidv4()
                    recordFile.eventDate = pvdObj.pack.pickupDate
                    recordFile.moviment = 'Saídas'
                    recordFile.orderNumber = ''
                    recordFile.incomes = 0
                    recordFile.outcomes = drugQuantitySupplied
                    recordFile.posetiveAdjustment = 0
                    recordFile.negativeAdjustment = 0
                    recordFile.loses = 0
                    recordFile.balance = 0
                    recordFile.code = 'SAIDA'
                    recordFile.notes = ''
                    recordFileList.push(recordFile)
              }
          }
      }
     // }
    }
     }
     return recordFileList
    })
  }
}
