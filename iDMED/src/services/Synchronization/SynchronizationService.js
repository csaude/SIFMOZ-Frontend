import Clinic from 'src/store/models/clinic/Clinic'
import ClinicalService from 'src/store/models/ClinicalService/ClinicalService'
import ClinicalServiceAttribute from 'src/store/models/ClinicalServiceAttribute/ClinicalServiceAttribute'
import ClinicalServiceAttributeType from 'src/store/models/ClinicalServiceAttributeType/ClinicalServiceAttributeType'
import ClinicSector from 'src/store/models/clinicSector/ClinicSector'
import ClinicSectorType from 'src/store/models/clinicSectorType/ClinicSectorType'
import DispenseType from 'src/store/models/dispenseType/DispenseType'
import Drug from 'src/store/models/drug/Drug'
import Duration from 'src/store/models/Duration/Duration'
import EpisodeType from 'src/store/models/episodeType/EpisodeType'
import FacilityType from 'src/store/models/facilityType/FacilityType'
import Form from 'src/store/models/form/Form'
import HealthInformationSystem from 'src/store/models/healthInformationSystem/HealthInformationSystem'
import IdentifierType from 'src/store/models/identifierType/IdentifierType'
import InteroperabilityAttribute from 'src/store/models/interoperabilityAttribute/InteroperabilityAttribute'
import InteroperabilityType from 'src/store/models/interoperabilityType/InteroperabilityType'
import SpetialPrescriptionMotive from 'src/store/models/prescription/SpetialPrescriptionMotive'
import ProvincialServer from 'src/store/models/provincialServer/ProvincialServer'
import StartStopReason from 'src/store/models/startStopReason/StartStopReason'
import Inventory from 'src/store/models/stockinventory/Inventory'
import PatientTransReferenceType from 'src/store/models/tansreference/PatientTransReferenceType'
import TherapeuticLine from 'src/store/models/therapeuticLine/TherapeuticLine'
import TherapeuticRegimen from 'src/store/models/therapeuticRegimen/TherapeuticRegimen'
import StockEntrance from 'src/store/models/stockentrance/StockEntrance'
import Patient from 'src/store/models/patient/Patient'
import StockCenter from 'src/store/models/stockcenter/StockCenter'
// import Stock from 'src/store/models/stock/Stock'
import { InventoryStockAdjustment } from 'src/store/models/stockadjustment/InventoryStockAdjustment'
import StockOperationType from 'src/store/models/stockoperation/StockOperationType'
import ReferedStockMoviment from 'src/store/models/stockrefered/ReferedStockMoviment'
import DestroyedStock from 'src/store/models/stockdestruction/DestroyedStock'
import { LocalStorage } from 'quasar'
import PatientVisitDetails from 'src/store/models/patientVisitDetails/PatientVisitDetails'
import PatientVisit from 'src/store/models/patientVisit/PatientVisit'
import Pack from 'src/store/models/packaging/Pack'
import Prescription from 'src/store/models/prescription/Prescription'
import PatientServiceIdentifier from 'src/store/models/patientServiceIdentifier/PatientServiceIdentifier'
import Episode from 'src/store/models/episode/Episode'
import DispenseMode from 'src/store/models/dispenseMode/DispenseMode'
import Role from 'src/store/models/userLogin/Role'
import User from 'src/store/models/userLogin/User'
import StockAlert from 'src/store/models/stockAlert/StockAlert'
import db from 'src/store/localbase'
import DrugStockFileEvent from 'src/store/models/drugStockFileEvent/DrugStockFileEvent'
import Stock from 'src/store/models/stock/Stock'
import { StockAdjustment } from 'src/store/models/stockadjustment/StockAdjustment'
// import Stock from 'src/store/models/stock/Stock'

export default {
  async loadAndSaveAppParameters (clinicId) {
    const offset = 0
    const max = 100
  //  this.doClinicGet(0, 100)

    await Duration.apiGetAll(offset, max).then(resp => {
      Duration.localDbUpdateAll(resp.response.data)
    })
    await ClinicalServiceAttributeType.apiGetAll(offset, max).then(resp => {
        ClinicalServiceAttributeType.localDbUpdateAll(resp.response.data)
    })
    await ClinicalService.apiGetAll(offset, max).then(resp => {
        ClinicalService.localDbUpdateAll(resp.response.data)
    })
    await ClinicSector.apiGetAll(offset, max).then(resp => {
        ClinicSector.localDbUpdateAll(resp.response.data)
    })
    await IdentifierType.apiGetAll(offset, max).then(resp => {
        IdentifierType.localDbUpdateAll(resp.response.data)
    })
    await EpisodeType.apiGetAll(offset, max).then(resp => {
        EpisodeType.localDbUpdateAll(resp.response.data)
    })
    await FacilityType.apiGetAll(offset, max).then(resp => {
        FacilityType.localDbUpdateAll(resp.response.data)
    })
    await StartStopReason.apiGetAll(offset, max).then(resp => {
        StartStopReason.localDbUpdateAll(resp.response.data)
    })
    await ClinicalServiceAttribute.apiGetAll(offset, max).then(resp => {
        ClinicalServiceAttribute.localDbUpdateAll(resp.response.data)
    })
    await Drug.apiGetAll(offset, max).then(resp => {
        Drug.localDbUpdateAll(resp.response.data)
    })
    await TherapeuticRegimen.apiGetAll(offset, max).then(resp => {
        TherapeuticRegimen.localDbUpdateAll(resp.response.data)
    })
    await TherapeuticLine.apiGetAll(offset, max).then(resp => {
        TherapeuticLine.localDbUpdateAll(resp.response.data)
    })
    await Form.apiGetAll(offset, max).then(resp => {
        Form.localDbUpdateAll(resp.response.data)
    })
    await DispenseType.apiGetAll(offset, max).then(resp => {
        DispenseType.localDbUpdateAll(resp.response.data)
    })
    await InteroperabilityType.apiGetAll(offset, max).then(resp => {
        InteroperabilityType.localDbUpdateAll(resp.response.data)
    })
    await InteroperabilityAttribute.apiGetAll(offset, max).then(resp => {
        InteroperabilityAttribute.localDbUpdateAll(resp.response.data)
    })
    await HealthInformationSystem.apiGetAll(offset, max).then(resp => {
        HealthInformationSystem.localDbUpdateAll(resp.response.data)
    })
    await StockCenter.apiGetAll(offset, max).then(resp => {
        StockCenter.localDbUpdateAll(resp.response.data)
    })
    Stock.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        Stock.localDbAdd(item)
      })
    })
    await InventoryStockAdjustment.apiGetAll(offset, max).then(resp => {
        InventoryStockAdjustment.localDbUpdateAll(resp.response.data)
    })
    StockOperationType.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        StockOperationType.localDbAdd(item)
      })
    })
    ReferedStockMoviment.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        ReferedStockMoviment.localDbAdd(item)
      })
    })
    await DestroyedStock.apiGetAll(offset, max).then(resp => {
        DestroyedStock.localDbUpdateAll(resp.response.data)
    })
    await FacilityType.apiGetAll(offset, max).then(resp => {
        FacilityType.localDbUpdateAll(resp.response.data)
    })
    await ClinicSectorType.apiGetAll(offset, max).then(resp => {
        ClinicSectorType.localDbUpdateAll(resp.response.data)
    })
    await PatientTransReferenceType.apiGetAll(offset, max).then(resp => {
          PatientTransReferenceType.localDbUpdateAll(resp.response.data)
      })
      await SpetialPrescriptionMotive.apiGetAll(offset, max).then(resp => {
          SpetialPrescriptionMotive.localDbUpdateAll(resp.response.data)
      })
      await ProvincialServer.apiGetAll().then(resp => {
          ProvincialServer.localDbUpdateAll(resp.response.data)
      })
      DispenseMode.apiGetAll().then(resp => {
        resp.response.data.forEach((item) => {
          DispenseMode.localDbAdd(item)
        })
      })
    },
    async loadAndSaveRolesAndUsers () {
      const offset = 0
     const max = 100
     if (Role.all().length > 0) {
      await Role.apiGetAll().then(resp => {
          Role.localDbUpdateAll(resp.response.data)
      })
     }
     if (User.all().length > 0) {
    await User.apiGetAll(offset, max).then(resp => {
    User.localDbUpdateAll(resp.response.data)
  })
}
    },
    doStockEntranceGet (clinicId, offset, max) {
      StockEntrance.deleteAll()
      StockEntrance.apiGetAllByClinicId(clinicId, offset, max).then(resp => {
            if (resp.response.data.length > 0) {
              resp.response.data.forEach((item) => {
                StockEntrance.localDbAdd(item)
              })
              offset = offset + max
              setTimeout(this.doStockEntranceGet(clinicId, offset, max), 2)
            }
        }).catch(error => {
            console.log(error)
        })
    },
    doGetDrugFileMobile (clinicId, offset, max) {
      console.log('Iniciando a sincronizacao DRUG FILE MOBILE...')
      DrugStockFileEvent.apiGetDrugFileMobile(clinicId, offset, max).then(resp => {
            if (resp.response.data.length > 0) {
              console.log('DadosDrug File : ', resp.response.data)
              db.newDb().collection('drugFile').set(resp.response.data)
            }
        }).catch(error => {
            console.log(error)
        })
    },
    doGetAllStockAlert (clinicId, offset, max) {
      console.log('Iniciando a sincronizacao STOCK ALERT...')
      StockAlert.apiGetAlertStockMobile(clinicId, 'TARV', offset, 100).then(resp => {
        if (resp.response.data.length > 0) {
          resp.response.data.forEach((item) => {
            StockAlert.localDbAdd(item)
          })
        }
    }).catch(error => {
        console.log(error)
    })
       },
    doInventoryGet (clinicId, offset, max) {
      /*
      ReferedStockMoviment.apiGetAll(offset, max).then(resp => {
        resp.response.data.forEach((item) => {
          ReferedStockMoviment.localDbAdd(item)
        })
      })
      InventoryStockAdjustment.apiGetAll(offset, max).then(resp => {
        resp.response.data.forEach((item) => {
          InventoryStockAdjustment.localDbAdd(item)
        })
      })
      DestroyedStock.apiGetAll(offset, max).then(resp => {
        resp.response.data.forEach((item) => {
          DestroyedStock.localDbAdd(item)
        })
      })
      */
      Inventory.apiGetAllByClinicId(clinicId, offset, max).then(resp => {
            if (resp.response.data.length > 0) {
              resp.response.data.forEach((item) => {
                Inventory.localDbAdd(item)
              })
              offset = offset + max
              setTimeout(this.doInventoryGet(clinicId, offset, max), 2)
            }
        }).catch(error => {
            console.log(error)
        })
    },
    doPatientGet (clinicId, offset, max) {
      Patient.apiGetAllByClinicId(clinicId, offset, max).then(resp => {
          resp.response.data.forEach((item) => {
            Patient.localDbAdd(item)
          })
          offset = offset + max
          setTimeout(this.doPatientGet(clinicId, offset, max), 2)
        }).catch(error => {
            console.log(error)
        })
    },
    doClinicGet (offset, max) {
      Clinic.apiGetAll(offset, max).then(resp => {
        if (resp.response.data.length > 0) {
          resp.response.data.forEach((item) => {
            Clinic.localDbAdd(item)
          })
          offset = offset + max
          setTimeout(this.doClinicGet(offset, max), 2)
        }
      })
    },
    doPatientLastVisitDetailsGet (clinicId, offset, max) {
      PatientVisitDetails.apiGetAllLastOfClinic(clinicId, offset, max).then(resp => {
        if (resp.response.data.length > 0) {
          resp.response.data.forEach((item) => {
            PatientVisitDetails.localDbAdd(item)
          })
          offset = offset + max
          setTimeout(this.doPatientLastVisitDetailsGet(clinicId, offset, max), 2)
        }
      })
    },
    doPatientVisitGet (clinicId, offset, max) {
      PatientVisit.apiGetAllLastWithScreeningOfClinic(clinicId, offset, max).then(resp => {
        if (resp.response.data.length > 0) {
          resp.response.data.forEach((item) => {
            PatientVisit.localDbAdd(item)
          })
          offset = offset + max
          setTimeout(this.doPatientVisitGet(clinicId, offset, max), 2)
        }
      })
    },
    doPackGet (clinicId, offset, max) {
      Pack.apiGetAllLastOfClinic(clinicId, offset, max).then(resp => {
        if (resp.response.data.length > 0) {
          resp.response.data.forEach((item) => {
            Pack.localDbAdd(item)
          })
          offset = offset + max
          setTimeout(this.doPackGet(clinicId, offset, max), 2)
        }
      })
    },
    doPrescriptionGet (clinicId, offset, max) {
      Prescription.apiGetAllLastOfClinic(clinicId, offset, max).then(resp => {
        if (resp.response.data.length > 0) {
          resp.response.data.forEach((item) => {
            Prescription.localDbAdd(item)
          })
          offset = offset + max
          setTimeout(this.doPrescriptionGet(clinicId, offset, max), 2)
        }
      })
    },
    doIdentifiersGet (clinicId, offset, max) {
      PatientServiceIdentifier.apiGetAllByClinicId(clinicId, offset, max).then(resp => {
        if (resp.response.data.length > 0) {
          resp.response.data.forEach((item) => {
            PatientServiceIdentifier.localDbAdd(item)
          })
          offset = offset + max
          setTimeout(this.doIdentifiersGet(clinicId, offset, max), 2)
        }
      })
    },
    doEpisodesGet (clinicId, offset, max) {
      Episode.apiGetAllByClinicId(clinicId, offset, max).then(resp => {
        if (resp.response.data.length > 0) {
          resp.response.data.forEach((item) => {
            Episode.localDbAdd(item)
          })
          offset = offset + max
          setTimeout(this.doEpisodesGet(clinicId, offset, max), 2)
        }
      })
    },
    async start ($q, clinicId) {
      console.log('Clinica:' + clinicId)
     this.doPatientGet(clinicId, 0, 100)
     this.doStockEntranceGet(clinicId, 0, 100)
      this.doIdentifiersGet(clinicId, 0, 100)
     this.doPatientLastVisitDetailsGet(clinicId, 0, 100)
     this.doPatientVisitGet(clinicId, 0, 100)
      this.doPackGet(clinicId, 0, 100)
     this.doPrescriptionGet(clinicId, 0, 100)
    this.doInventoryGet(clinicId, 0, 100)
    await this.loadAndSaveAppParameters(clinicId)
     this.loadAndSaveRolesAndUsers(clinicId)
      LocalStorage.set('system-sync-status', 'done')
      await this.doGetAllStockAlert(clinicId, 0, 100)
      await LocalStorage.set('system-sync-status', 'done')
      $q.loading.hide()
    },

    async send () {
  //   await this.sendUsers()
     // await this.sendEntrances()
     // await this.sendStocks()
    //  await this.sendReferedStocks()
    await this.sendInventory()
   // await this.sendStockAdjustment()
    },

    async sendUsers () {
        // const usersToSync = await this.getUsersToSync()
        User.localDbGetAll().then((users) => {
          const usersToSync = users.filter((user) =>
          (user.syncStatus === 'S' || user.syncStatus === 'U'))
          return usersToSync
        }).then(usersToSync => {
        //  for (let i = 0; i < usersToSync.length; i++) {
            console.log(usersToSync[0])
            this.apiSendUsers(usersToSync, 0)
     // }
   //  this.apiSendUsers(usersToSync)
  })
},
    apiSendUsers (usersToSync, i) {
     // for (let i = 0; i < usersToSync.length; i++) {
        const user = usersToSync[i]
      if (user !== undefined) {
        user.id = null
        User.apiSave(user).then(resp => {
          // apiSendUsers(usersToSync , i)
          i = i + 1
          user.syncStatus = 'S'
          User.localDbUpdate(user)
           setTimeout(this.apiSendUsers(usersToSync, i), 2)
     }).catch(error => {
       console.log(error)
   })
 // }
}
    },
     async sendEntrances () {
      console.log('Iniciando a sincronizacao....')
     StockEntrance.localDbGetAll().then((entrances) => {
        const entrancesToSync = entrances.filter((entrance) =>
        (entrance.syncStatus === 'R' || entrance.syncStatus === 'U'))
        return entrancesToSync
      }).then(entrancesToSync => {
          console.log('Entrances to SYNC', entrancesToSync[0])
          this.apiSendEntrances(entrancesToSync, 0)
})
},
apiSendEntrances (entrancesToSync, i) {
        if (entrancesToSync[i] !== undefined && i < entrancesToSync.length) {
          const entrance = entrancesToSync[i]
          entrance.clinic_id = entrance.clinic.id
          const idLocalBase = entrance.id
          entrance.id = null
          StockEntrance.apiSave(entrance).then(resp => {
            const entranceId = resp.response.data.id
          StockEntrance.deleteAll()
            i = i + 1
            const stocksNew = []
            const stockListLb = entrance.stocks
            Object.keys(stockListLb).forEach(function (k) {
              if (stockListLb[k] !== null && stockListLb[k] !== undefined) {
                console.log('stockListLb[k]::: ', stockListLb[k])
               // Stock.delete(stockListLb[k].id)
                Stock.localDbDeleteById(stockListLb[k].id).then(rep => {
                  stockListLb[k].entrance_id = entranceId
                  stockListLb[k].syncStatus = 'S'
                  Stock.localDbAdd(stockListLb[k]).then(rep2 => {
                    stocksNew.push(stockListLb[k])
                  })
                })
              }
            })
        StockEntrance.localDbDeleteById(idLocalBase).then(rep => {
         // StockEntrance.delete(idLocalBase)
          entrance.id = entranceId
          entrance.syncStatus = 'S'
          entrance.stocks = stocksNew
          StockEntrance.localDbAdd(entrance)

          db.newDb().collection('stockEntrances').get().then(stockEntrance => {
            StockEntrance.deleteAll()
          StockEntrance.insert(
            {
              data: stockEntrance
            })
        })

        db.newDb().collection('stocks').get().then(stock => {
          Stock.deleteAll()
          Stock.insert(
            {
              data: stock
            })
        })
      })
          setTimeout(this.apiSendEntrances(entrancesToSync, i), 2)
          }).catch(error => {
            console.log(error)
        })
    }
 // }
 },
 async sendReferedStocks () {
  console.log('Iniciando a sincronizacao ReferedStockMoviment....')
  ReferedStockMoviment.localDbGetAll().then((referedSt) => {
    const referedStToSync = referedSt.filter((referd) =>
    (referd.syncStatus === 'R' || referd.syncStatus === 'U'))
    return referedStToSync
  }).then(referedStToSync => {
      this.apiReferedStocks(referedStToSync, 0)
})
},

apiReferedStocks (referedStocksToSync, i) {
  if (referedStocksToSync[i] !== undefined && i < referedStocksToSync.length) {
    const referedStock = referedStocksToSync[i]
    const idLocalBase = referedStock.id
    referedStock.id = null
    ReferedStockMoviment.apiSave(referedStock).then(resp => {
      const referedStockId = resp.response.data.id
      ReferedStockMoviment.deleteAll()
      i = i + 1
      ReferedStockMoviment.localDbDeleteById(idLocalBase).then(rep => {
      referedStock.id = referedStockId
      referedStock.syncStatus = 'S'
      ReferedStockMoviment.localDbAdd(referedStock)

      db.newDb().collection('referedStockMoviments').get().then(referedStock => {
        ReferedStockMoviment.deleteAll()
        ReferedStockMoviment.insert(
        {
          data: referedStock
        })
  })
})
    setTimeout(this.apiReferedStocks(referedStocksToSync, i), 2)
    }).catch(error => {
      console.log(error)
  })
}
},
async sendStocks () {
  console.log('Iniciando a sincronizacao Stock....')
  Stock.localDbGetAll().then((stock) => {
    const stockToSync = stock.filter((st) =>
    (st.syncStatus === 'R' || st.syncStatus === 'U'))
    return stockToSync
  }).then(stockToSync => {
      this.apiSendStocks(stockToSync, 0)
})
},

apiSendStocks (stocksToSync, i) {
  if (stocksToSync[i] !== undefined && i < stocksToSync.length) {
    const stock = stocksToSync[i]
    Stock.apiUpdate(stock).then(resp => {
      const stockId = resp.response.data.id
      i = i + 1
      stock.id = stockId
      stock.syncStatus = 'S'
      Stock.localDbUpdate(stock)
      db.newDb().collection('stocks').get().then(stock => {
        Stock.deleteAll()
        Stock.insert(
        {
          data: stock
        })
  })
    setTimeout(this.apiSendStocks(stocksToSync, i), 2)
    }).catch(error => {
      console.log(error)
  })
}
},

sendInventory () {
  console.log('Iniciando a sincronizacao Stock....')
  Inventory.localDbGetAll().then((inventory) => {
    const inventoryToSync = inventory.filter((inv) =>
    ((inv.syncStatus === 'R' || inv.syncStatus === 'U') && inv.open === false))
    return inventoryToSync
  }).then(inventoryToSync => {
      this.apiSendInventory(inventoryToSync, 0)
})
},
apiSendInventory (inventoryToSync, i) {
    if (inventoryToSync[i] !== undefined && i < inventoryToSync.length) {
      const inventory = inventoryToSync[i]
      inventory.clinic_id = inventory.clinic.id
      const idLocalBase = inventory.id
      inventory.id = null
      Inventory.apiSave(inventory).then(resp => {
        const inventoryId = resp.response.data.id
        i = i + 1
        const stocksNew = []
        const stockListLb = inventory.adjustments
        Object.keys(stockListLb).forEach(function (k) {
          if (stockListLb[k] !== null && stockListLb[k] !== undefined) {
            console.log('stockListLb[k]::: ', stockListLb[k])
           // Stock.delete(stockListLb[k].id)
            InventoryStockAdjustment.localDbDeleteById(stockListLb[k].id).then(rep => {
              stockListLb[k].inventory_id = inventoryId
              stockListLb[k].syncStatus = 'S'
              InventoryStockAdjustment.localDbAdd(stockListLb[k]).then(rep2 => {
                stocksNew.push(stockListLb[k])
              })
             StockAdjustment.delete(stockListLb[k].id)
             Inventory.delete(idLocalBase)
            })
          }
        })
        Inventory.localDbDeleteById(idLocalBase).then(rep => {
      inventory.id = inventoryId
      inventory.syncStatus = 'S'
      inventory.stocks = stocksNew
      Inventory.localDbAdd(inventory)
  })
      setTimeout(this.apiSendInventory(inventoryToSync, i), 2)
      }).catch(error => {
        console.log(error)
    })
}
// }
},
async sendStockAdjustment () {
  console.log('Iniciando a sincronizacao InventoryStockAdjustment....')
  InventoryStockAdjustment.localDbGetAll().then((stockAdj) => {
    const invStAdjToSync = stockAdj.filter((st) =>
    (st.syncStatus === 'R' || st.syncStatus === 'U') && st.finalised === true)
    return invStAdjToSync
  }).then(invStAdjToSync => {
      this.apiStockAdjustment(invStAdjToSync, 0)
})
},
apiStockAdjustment (invStAdjToSync, i) {
  if (invStAdjToSync[i] !== undefined && i < invStAdjToSync.length) {
    const stockAdj = invStAdjToSync[i]
    const idLocalBase = stockAdj.id
    stockAdj.id = null
    InventoryStockAdjustment.apiSave(stockAdj).then(resp => {
      InventoryStockAdjustment.delete(idLocalBase)
      console.log('salvandooo...Obj')
      const stockAdjId = resp.response.data.id
      i = i + 1
      InventoryStockAdjustment.localDbDeleteById(idLocalBase).then(rep => {
        stockAdj.id = stockAdjId
        stockAdj.syncStatus = 'S'
        InventoryStockAdjustment.localDbAdd(stockAdj)

      db.newDb().collection('inventoryStockAdjustments').get().then(stockAdj => {
        InventoryStockAdjustment.insert(
        {
          data: stockAdj
        })
  })
})
    setTimeout(this.apiStockAdjustment(invStAdjToSync, i), 2)
    }).catch(error => {
      console.log(error)
  })
}
}
}
