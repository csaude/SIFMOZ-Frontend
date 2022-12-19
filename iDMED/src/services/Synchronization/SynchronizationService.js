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
import { LocalStorage, SessionStorage } from 'quasar'
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
import UsersService from '../../services/UsersService'
import Encryption from 'src/services/Encryption'
import Doctor from 'src/store/models/doctor/Doctor'
import AuditSyncronization from 'src/store/models/auditSyncronization/AuditSyncronization'
import GroupType from 'src/store/models/groupType/GroupType'
import Group from 'src/store/models/group/Group'

export default {
  // mixins: [mixinEncryption],
  async loadAndSaveAppParameters (clinicId) {
    const offset = 0
    const max = 100
 //   this.doClinicGet(0, 100)

    await Duration.apiGetAll(offset, max).then(resp => {
      Duration.localDbUpdateAll(resp.response.data)
    })
    await ClinicalServiceAttributeType.apiGetAll(offset, 4).then(resp => {
        ClinicalServiceAttributeType.localDbUpdateAll(resp.response.data)
    })
    await ClinicalService.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((cs) => {
        // cs.attributes = []
        ClinicalService.localDbAdd(cs)
      })
    })
    await ClinicSector.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((cs) => {
        ClinicSector.localDbAdd(cs)
      })
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
      resp.response.data.forEach((cs) => {
        // cs.clinicalService = null
        ClinicalServiceAttribute.localDbAdd(cs)
      })
    })
    await Drug.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((cs) => {
        // cs.clinicalService = null
        Drug.localDbAdd(cs)
      })
    })
    await TherapeuticRegimen.apiGetAll(offset, max).then(resp => {
        resp.response.data.forEach((therapeuticRegimen) => {
          /* const tRegimen = new TherapeuticRegimen(therapeuticRegimen)
          tRegimen.drugs = []
          tRegimen.clinical_service_id = therapeuticRegimen.clincalService.id
          tRegimen.clinicalService = null
          console.log(therapeuticRegimen) */
          TherapeuticRegimen.localDbAdd(therapeuticRegimen)
        })
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
      await Doctor.apiFetchByClinicId(clinicId).then(resp => {
        Doctor.localDbUpdateAll(resp.response.data)
      })
      DispenseMode.apiGetAll().then(resp => {
        resp.response.data.forEach((item) => {
          DispenseMode.localDbAdd(item)
        })
      })
      GroupType.apiGetAll().then(resp => {
        resp.response.data.forEach((item) => {
          GroupType.localDbAdd(item)
        })
      })
    },
    async loadAndSaveRolesAndUsers () {
    //  const offset = 0
    // const max = 100
      await Role.apiGetAll().then(resp => {
        console.log(resp.response.data)
          Role.localDbUpdateAll(resp.response.data)
     })
     /*
     if (User.all().length > 0) {
    await User.apiGetAll(offset, max).then(resp => {
    User.localDbUpdateAll(resp.response.data)
  })
}
*/
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
    doGroupGet (clinicId, offset, max) {
      Group.apiGetAllByClinicId(clinicId, offset, max).then(resp => {
        resp.response.data.forEach((item) => {
          Group.localDbAdd(item)
        })
        offset = offset + max
        setTimeout(this.doGroupGet(clinicId, offset, max), 2)
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
      console.log('IN [Prescription_Sync]')
      Prescription.apiGetAllLastOfClinic(clinicId, offset, max).then(resp => {
        console.log('Response [Prescription_Sync]')
        if (resp.response.data.length > 0) {
          console.log('Found [Prescription_Sync]')
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
      console.log('Sincronizando para Clinica:' + clinicId)
      this.doPatientGet(clinicId, 0, 100)
      this.doStockEntranceGet(clinicId, 0, 100)
      this.doIdentifiersGet(clinicId, 0, 100)
      this.doPatientLastVisitDetailsGet(clinicId, 0, 100)
      this.doPatientVisitGet(clinicId, 0, 100)
      this.doPackGet(clinicId, 0, 100)
      this.doPrescriptionGet(clinicId, 0, 100)
      this.doEpisodesGet(clinicId, 0, 100)
      this.doGroupGet(clinicId, 0, 100)
      this.doInventoryGet(clinicId, 0, 100)
      this.doGetAllStockAlert(clinicId, 0, 100)
      this.doGetDrugFileMobile(clinicId, 0, 100)
      await this.loadAndSaveAppParameters(clinicId)
      this.loadAndSaveRolesAndUsers(clinicId)
        LocalStorage.set('system-sync-status', 'done')

      $q.loading.hide()
    },

    async send () {
     // const userId = LocalStorage.getItem('userLocalId')
     // User.localDbGetById(130).then((user) => {
       // if (user !== undefined) {
          this.login('admin', 'admin')
      //  }
    // })
    /*
    Episode.localDbGetById('414c85a1-efd5-44d7-875b-d80a61a12314').then(episode => {
      episode.episodeDate = '2017-12-05T22:00:00.000Z'
      Episode.localDbUpdate(episode)
    })
    */
  },
    async getUsersToSend () {
        User.localDbGetAll().then((users) => {
          const usersToSync = users.filter((user) =>
          (user.syncStatus === 'R' || user.syncStatus === 'U'))
          return usersToSync
        }).then(usersToSync => {
            console.log(usersToSync[0])
            this.apiSendUsers(usersToSync, 0)
  })
},
    apiSendUsers (usersToSync, i) {
        const user = usersToSync[i]
      if (user !== undefined) {
        const idToDelete = user.id
        user.id = null
        user.password = Encryption.decryptPlainText(user.password)
        User.apiSave(user).then(resp => {
          // apiSendUsers(usersToSync , i)
          i = i + 1
          user.syncStatus = 'S'
          user.id = resp.response.data.id
          User.localDbDelete(idToDelete)
          User.delete(idToDelete)
          User.localDbAdd(user)
           setTimeout(this.apiSendUsers(usersToSync, i), 2)
     }).catch(error => {
       console.log(error)
   })
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
async apiSendEntrances (entrancesToSync, i) {
 const entrance = entrancesToSync[i]
 if (entrance !== undefined) {
   entrance.clinic = SessionStorage.getItem('currClinic')
   StockEntrance.apiSave(entrance).then(resp => {
     i = i + 1
     entrance.syncStatus = 'S'
     StockEntrance.localDbUpdate(entrance).then(entr => {
      StockEntrance.insert(
        { data: entrance })
        Stock.localDbGetAll().then((stocks) => {
          const toUpdates = stocks.filter((stock) => stock.entrance_id === entrance.id)
            toUpdates.forEach(toUpdate => {
              toUpdate.syncStatus = 'S'
              Stock.localDbUpdate(toUpdate)
            })
          })
      setTimeout(this.apiSendEntrances(entrancesToSync, i), 200)
    })
     // Get Childs TO Update
 }).catch(error => {
  console.log(error)
 })
 } else {
  this.sendInventory()
 }
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
  const referedStock = referedStocksToSync[i]
  if (referedStock !== undefined) {
   referedStock.clinic = SessionStorage.getItem('currClinic')
   ReferedStockMoviment.apiSave(referedStock).then(resp => {
    i = i + 1
    referedStock.syncStatus = 'S'
    ReferedStockMoviment.localDbUpdate(referedStock).then(entr => {
     ReferedStockMoviment.insert(
       { data: referedStock })
     setTimeout(this.apiReferedStocks(referedStocksToSync, i), 200)
})
}).catch(error => {
 console.log(error)
})
} else {
  this.sendDestroyedStocks()
}
},
async sendDestroyedStocks () {
  console.log('Iniciando a sincronizacao DestroyedStock....')
  DestroyedStock.localDbGetAll().then((destroyedSt) => {
    const destroyedStToSync = destroyedSt.filter((destr) =>
    (destr.syncStatus === 'R' || destr.syncStatus === 'U'))
    return destroyedStToSync
  }).then(destroyedStToSync => {
      this.apiDestroyedStocks(destroyedStToSync, 0)
})
},

apiDestroyedStocks (destroyedStToSync, i) {
  const destroyedStock = destroyedStToSync[i]
  if (destroyedStock !== undefined) {
    destroyedStock.clinic = SessionStorage.getItem('currClinic')
    DestroyedStock.apiSave(destroyedStock).then(resp => {
    i = i + 1
    destroyedStock.syncStatus = 'S'
    DestroyedStock.localDbUpdate(destroyedStock).then(entr => {
     DestroyedStock.insert(
       { data: destroyedStock })
     setTimeout(this.apiDestroyedStocks(destroyedStToSync, i), 200)
})
}).catch(error => {
 console.log(error)
})
}
},

    async getRolesToSend () {
      Role.localDbGetAll().then((roles) => {
        const rolesToSync = roles.filter((role) =>
        (role.syncStatus === 'R' || role.syncStatus === 'U'))
        return rolesToSync
      }).then(rolesToSync => {
          console.log(rolesToSync[0])
          this.apiSendRoles(rolesToSync, 0)
})
},
apiSendRoles (rolesToSync, i) {
  const role = rolesToSync[i]
if (role !== undefined) {
  const idToDelete = role.id
  role.id = null
  Role.apiSave(role).then(resp => {
    // apiSendUsers(usersToSync , i)
    i = i + 1
    role.syncStatus = 'S'
    role.id = resp.response.data.id
    Role.localDbDelete(idToDelete)
    Role.delete(idToDelete)
    Role.localDbAdd(role)
   setTimeout(this.apiSendRoles(rolesToSync, i), 2)
}).catch(error => {
 console.log(error)
})
}
},

async getPatientsToSend () {
  Patient.localDbGetAll().then((patients) => {
    const patientsToSync = patients.filter((patient) =>
    (patient.syncStatus === 'R' || patient.syncStatus === 'U'))
    return patientsToSync
  }).then(patientsToSync => {
      console.log(patientsToSync[0])
     this.apiSendPatients(patientsToSync, 0)
})
},
async getPatientServiceIdentifierToSend () {
  PatientServiceIdentifier.localDbGetAll().then((identifiers) => {
    const identifiersToSync = identifiers.filter((identifier) =>
    (identifier.syncStatus === 'R' || identifier.syncStatus === 'U'))
    return identifiersToSync
  }).then(identifiersToSync => {
      console.log(identifiersToSync[0])
       this.apiSendPatientServiceIdentifier(identifiersToSync, 0)
})
},
async getEpisodeToSend () {
  Episode.localDbGetAll().then((episodes) => {
    const episodesToSync = episodes.filter((episode) =>
    (episode.syncStatus === 'R' || episode.syncStatus === 'U'))
    return episodesToSync
  }).then(episodesToSync => {
      console.log(episodesToSync[0])
      this.apiSendEpisode(episodesToSync, 0)
})
},
async getGroupsToSend () {
  Group.localDbGetAll().then((groups) => {
    const groupsToSync = groups.filter((group) =>
    (group.syncStatus === 'R' || group.syncStatus === 'U'))
    return groupsToSync
  }).then(groupsToSync => {
    console.log('Groups_To_Sync: ', groupsToSync)
    this.apiSendGroups(groupsToSync, 0)
  })
},

async apiSendGroups (groupsToSync, i) {
  const group = groupsToSync[i]
  if (group !== undefined) {
    group.clinic = SessionStorage.getItem('currClinic')
    await Group.apiSave(group).then(resp => {
      i = i + 1
      group.syncStatus = 'S'
      Group.localDbUpdate(group).then((group) => {
        console.log('Group_Syncronized: ', group)
        setTimeout(this.apiSendGroups(groupsToSync, i), 200)
      })
    }).catch(error => {
      const listErrors = []
      if (error.request.response != null) {
        const arrayErrors = JSON.parse(error.request.response)
        if (arrayErrors.total == null) {
          listErrors.push(arrayErrors.message)
        } else {
          arrayErrors._embedded.errors.forEach(element => {
            listErrors.push(element.message)
          })
        }
      }
      console.log('error', listErrors)
    })
  }
},
getPrescriptionsToSend () {
  Prescription.localDbGetAll().then((prescriptions) => {
    const prescriptionsToSync = prescriptions.filter((prescription) =>
    (prescription.syncStatus === 'R' || prescription.syncStatus === 'U'))
  return prescriptionsToSync
  }).then(prescriptionsToSync => {
    console.log(prescriptionsToSync[0])
    this.apiSendPrescription(prescriptionsToSync, 0)
})
},
getPacksToSend () {
  Pack.localDbGetAll().then((packs) => {
    const packsToSync = packs.filter((pack) =>
    (pack.syncStatus === 'R' || pack.syncStatus === 'U'))
    return packsToSync
  }).then(packsToSync => {
    console.log(packsToSync[0])
    this.apiSendPack(packsToSync, 0)
})
},
getPatientVisitDetailsToSend () {
  PatientVisitDetails.localDbGetAll().then((patientVisitDetails) => {
    const patientVisitDetailsToSync = patientVisitDetails.filter((patientVisitDetail) =>
    (patientVisitDetail.syncStatus === 'R' || patientVisitDetail.syncStatus === 'U'))
   return patientVisitDetailsToSync
  }).then(patientVisitDetailsToSync => {
    console.log(patientVisitDetailsToSync[0])
    this.apiSendPatientVisit(patientVisitDetailsToSync, 0)
})
},
async apiSendPatients (patientsToSync, i) {
  const patient = patientsToSync[i]
if (patient !== undefined) {
   const idToDelete = patient.id
  patient.id = null
await Patient.apiSave(patient).then(resp => {
    i = i + 1
    patient.syncStatus = 'S'
    patient.id = resp.response.data.id
    // Get Childs TO Update
 PatientServiceIdentifier.localDbGetAll().then((identifiers) => {
  PatientVisitDetails.localDbGetAll().then(visitDetails => {
  const toUpdates = identifiers.filter((identifier) => identifier.patient_id === idToDelete)
  const visitsToUpdate = visitDetails.filter((visitDetail) => visitDetail.patientVisit.patient_id === idToDelete)
  console.log(toUpdates)
    toUpdates.forEach(toUpdate => {
      toUpdate.patient_id = resp.response.data.id
      toUpdate.patient = patient
      PatientServiceIdentifier.localDbUpdate(toUpdate)
    })
    visitsToUpdate.forEach(visitToUpdate => {
      visitToUpdate.patientVisit.patient_id = resp.response.data.id
      visitToUpdate.patientVisit.patient = patient
      PatientVisitDetails.localDbUpdate(visitToUpdate)
    })
    Patient.localDbDelete(idToDelete)
    Patient.delete(idToDelete)
  Patient.localDbAdd(patient).then(patient => {
    setTimeout(this.apiSendPatients(patientsToSync, i), 200)
  })
  })
})
}).catch(error => {
 console.log(error)
})
} else {
  this.getPatientServiceIdentifierToSend()
}
},
async apiSendPatientServiceIdentifier (identifiersToSync, i) {
  const identifier = identifiersToSync[i]
if (identifier !== undefined) {
   const idToDelete = identifier.id
   identifier.id = null
  await PatientServiceIdentifier.apiSave(identifier).then(resp => {
    // apiSendUsers(usersToSync , i)
    i = i + 1
    identifier.syncStatus = 'S'
    identifier.id = resp.response.data.id
    // Get Childs TO Update
    Episode.localDbGetAll().then((episodes) => {
      const toUpdates = episodes.filter((episode) => episode.patientServiceIdentifier.id === idToDelete)
      console.log(toUpdates)
        toUpdates.forEach(toUpdate => {
          toUpdate.patientServiceIdentifier_id = resp.response.data.id
          toUpdate.patientServiceIdentifier = identifier
          Episode.localDbUpdate(toUpdate)
        })
    PatientServiceIdentifier.localDbDelete(idToDelete)
    PatientServiceIdentifier.delete(idToDelete)
    PatientServiceIdentifier.localDbAdd(identifier).then(identifier => {
      setTimeout(this.apiSendPatientServiceIdentifier(identifiersToSync, i), 200)
    })
      })
}).catch(error => {
 console.log(error)
})
} else {
  this.getEpisodeToSend()
}
},
async apiSendEpisode (episodesToSync, i) {
  const episode = episodesToSync[i]
if (episode !== undefined) {
   const idToDelete = episode.id
   episode.id = null
   await Episode.apiSave(episode).then(resp => {
    // apiSendUsers(usersToSync , i)
    i = i + 1
    episode.syncStatus = 'S'
    episode.id = resp.response.data.id
    // Get Childs TO Update
  PatientVisitDetails.localDbGetAll().then((patientVisitDetails) => {
      const toUpdates = patientVisitDetails.filter((patientVisitDetail) => patientVisitDetail.episode.id === idToDelete)
      console.log(toUpdates)
        toUpdates.forEach(toUpdate => {
          toUpdate.episode_id = resp.response.data.id
          toUpdate.episode = episode
          PatientVisitDetails.localDbUpdate(toUpdate)
        })
    Episode.localDbDeleteById(idToDelete)
    Episode.delete(idToDelete)
    Episode.localDbAdd(episode).then(episode => {
       setTimeout(this.apiSendEpisode(episodesToSync, i), 200)
      })
      })
}).catch(error => {
 console.log(error)
})
} else {
    this.getPrescriptionsToSend()
}
},
apiSendPrescription (prescriptionsToSync, i) {
  const prescription = prescriptionsToSync[i]
if (prescription !== undefined) {
   const idToDelete = prescription.id
   prescription.id = null
   prescription.doctor.clinic = prescription.clinic
    /*
   prescription.prescribedDrugs.forEach(prescribedDrugs => {
    prescribedDrugs.drug.clinicalService.identifierType.code = 'NID'
    prescribedDrugs.drug.clinicalService.identifierType.description = 'NID'
    prescribedDrugs.drug.clinicalService.identifierType.pattern = '########01/####/#####'
   })
   */
   Prescription.apiSave(prescription).then(resp => {
    // apiSendUsers(usersToSync , i)
    i = i + 1
    prescription.syncStatus = 'S'
    prescription.id = resp.response.data.id
    // Get Childs TO Update
    PatientVisitDetails.localDbGetAll().then((patientVisitDetails) => {
      const toUpdates = patientVisitDetails.filter((patientVisitDetail) => patientVisitDetail.prescription.id === idToDelete)
      console.log(toUpdates)
        toUpdates.forEach(toUpdate => {
          toUpdate.prescription_id = resp.response.data.id
          toUpdate.prescription = prescription
          PatientVisitDetails.localDbUpdate(toUpdate)
        })
      })
    Prescription.localDbDeleteById(idToDelete)
    Prescription.delete(idToDelete)
    Prescription.localDbAdd(prescription).then(presc => {
      setTimeout(this.apiSendPrescription(prescriptionsToSync, i), 2)
    })
}).catch(error => {
 console.log(error)
 i = i + 1
 setTimeout(this.apiSendPrescription(prescriptionsToSync, i), 2)
})
} else {
  this.getPatientVisitDetailsToSend()
}
},
apiSendPack (packsToSync, i) {
  const pack = packsToSync[i]
if (pack !== undefined) {
   const idToDelete = pack.id
   pack.id = null
  // pack.clinic = pack.clinic
   pack.packagedDrugs.forEach(packagedDrugs => {
    packagedDrugs.packagedDrugStocks.forEach(packagedDrugStock => {
      packagedDrugStock.stock.clinic = pack.clinic
      packagedDrugStock.stock.entrance.clinic = pack.clinic
    })
   })
   console.log(pack)
   Pack.apiSave(pack).then(resp => {
    // apiSendUsers(usersToSync , i)
    i = i + 1
    pack.syncStatus = 'S'
    pack.id = resp.response.data.id
    // Get Childs TO Update
    PatientVisitDetails.localDbGetAll().then((patientVisitDetails) => {
      const toUpdates = patientVisitDetails.filter((patientVisitDetail) => patientVisitDetail.pack.id === idToDelete)
      console.log(toUpdates)
        toUpdates.forEach(toUpdate => {
          toUpdate.pack_id = resp.response.data.id
          toUpdate.pack = pack
          PatientVisitDetails.localDbUpdate(toUpdate)
        })
      })
    Pack.localDbDeleteById(idToDelete)
    Pack.delete(idToDelete)
    Pack.localDbAdd(pack).then(pack => {
      setTimeout(this.apiSendPack(packsToSync, i), 2)
    })
}).catch(error => {
 console.log(error)
 i = i + 1
 setTimeout(this.apiSendPack(packsToSync, i), 2)
})
} else {
  this.getPatientVisitDetailsToSend()
}
},
  apiSendPatientVisit (patientVisitDetailsToSync, i) {
  const patientVisitDetails = patientVisitDetailsToSync[i]
if (patientVisitDetails !== undefined) {
   PatientVisit.localDbGetAll().then(visits => {
      const patientVisitsSameDate = visits.filter((patientVisit) => (patientVisit.visitDate === patientVisitDetails.patientVisit.visitDate) && (patientVisit.patient.id === patientVisitDetails.patientVisit.patient.id))
         return patientVisitsSameDate
    }).then(patientVisitsSameDate => {
      if (patientVisitsSameDate.length > 0) {
        const patientVisitSameDate = patientVisitsSameDate[0]
        if (patientVisitSameDate.syncStatus === 'S') {
          //
        }
      }
    const patientVisitDetailsByVisit = patientVisitDetailsToSync.filter((patientVisitDetailToSync) => (patientVisitDetailToSync.patient_visit_id === patientVisitDetails.patient_visit_id))
    const patientVisitDetailsidsTodelete = []
    let patientVisit = ''
    let idToDelete = ''
    if (patientVisitDetailsByVisit.length > 1) {
       patientVisit = patientVisitDetailsByVisit[0].patientVisit
      patientVisitDetailsByVisit.forEach(patientVisitDetailByVisit => {
        patientVisitDetailsidsTodelete.push(patientVisitDetailByVisit.id)
        patientVisitDetailByVisit.patientVisit.id = null
        patientVisitDetailByVisit.prescription.prescribedDrugs = []
        patientVisit.patientVisitDetails.push(patientVisitDetails)
        patientVisit.id = null
      })
    } else {
       idToDelete = patientVisitDetails.id
       patientVisit = patientVisitDetails.patientVisit
      patientVisitDetails.id = null
      patientVisitDetails.patientVisit = null
      patientVisitDetails.prescription.prescribedDrugs = []
      patientVisit.patientVisitDetails.push(patientVisitDetails)
      patientVisit.id = null
    }
    console.log(patientVisit)
 PatientVisit.apiSave(patientVisit).then(resp => {
    // apiSendUsers(usersToSync , i)
    i = i + 1
    patientVisitDetails.syncStatus = 'S'
   // patientVisitDetails.id = resp.response.data.patientVisitDetails[0].id
    if (patientVisitDetailsidsTodelete.length > 1) {
    patientVisitDetailsidsTodelete.forEach(patientVisitDetailId => {
      PatientVisitDetails.localDbDeleteById(patientVisitDetailId)
      const objWithIdIndex = patientVisitDetailsidsTodelete.findIndex((obj) => obj === patientVisitDetailId)
      patientVisitDetailsidsTodelete.splice(objWithIdIndex, 1)
    PatientVisitDetails.delete(patientVisitDetailId)
   // PatientVisitDetails.localDbAdd(patientVisitDetails)
    })
     } else {
    // Get Childs TO Update
    PatientVisitDetails.localDbDeleteById(idToDelete)
    PatientVisitDetails.delete(idToDelete)
  //  PatientVisitDetails.localDbAdd(patientVisitDetails)
    }
    resp.response.data.patientVisitDetails.forEach(patientVisitDetail => {
      PatientVisitDetails.localDbAdd(patientVisitDetail)
    })
   setTimeout(this.apiSendPatientVisit(patientVisitDetailsToSync, i), 2)
}).catch(error => {
 console.log(error)
 i = i + 1
 setTimeout(this.apiSendPatientVisit(patientVisitDetailsToSync, i), 2)
})
})
} else {
  console.log('Fim Visita')
}
},
    login (username, password) {
      UsersService.login({
        username: username,
        password: password
      })
        .then((response) => {
          this.submitting = false
          console.log('Login >>>>>>>>', response)
          localStorage.setItem('id_token', response.response.data.access_token)
          localStorage.setItem('refresh_token', response.response.data.refresh_token)
          localStorage.setItem('username', response.response.data.username)
          localStorage.setItem('user', this.username)
          localStorage.setItem('role_menus', response.response.data.menus)
          this.syncronizeAudit()
          this.sendEntrances()
          //   await this.sendUsers()
                this.getRolesToSend()
          this.getUsersToSend()
          this.getPatientsToSend()
          this.getGroupsToSend()
        //  this.getPatientServiceIdentifierToSend()
        //  this.getEpisodeToSend()
       //   this.getPrescriptionAndPackAndVisitToSend()
         // this.testSequence()
        })
        .catch((error) => {
          console.log(error)
          this.submitting = false
          if (error.request.response != null) {
            const arrayErrors = JSON.parse(error.request.response)
            if (arrayErrors.total == null) {
              this.listErrors.push(arrayErrors.message)
            } else {
              arrayErrors._embedded.errors.forEach((element) => {
                this.listErrors.push(element.message)
              })
            }
            console.log(this.listErrors)
          }
})
},
async sendInventory () {
  console.log('Iniciando a sincronizacao Stock....')
  Inventory.localDbGetAll().then((inventory) => {
    const inventoryToSync = inventory.filter((inv) =>
    ((inv.syncStatus === 'R' || inv.syncStatus === 'U') && inv.open === false))
    return inventoryToSync
  }).then(inventoryToSync => {
      this.apiSendInventory(inventoryToSync, 0)
})
},
async apiSendInventory (inventoryToSync, i) {
  const inventory = inventoryToSync[i]
  if (inventory !== undefined) {
    inventory.clinic = SessionStorage.getItem('currClinic')
    Inventory.apiSave(inventory).then(resp => {
      i = i + 1
      inventory.syncStatus = 'S'
      Inventory.localDbUpdate(inventory).then(entr => {
        Inventory.insert(
         { data: inventory })
         InventoryStockAdjustment.localDbGetAll().then((adjustments) => {
           const toUpdates = adjustments.filter((adjustment) => adjustment.inventory_id === inventory.id)
             toUpdates.forEach(toUpdate => {
               toUpdate.syncStatus = 'S'
               InventoryStockAdjustment.localDbUpdate(toUpdate)
             })
           })
       setTimeout(this.apiSendInventory(inventoryToSync, i), 200)
     })
      // Get Childs TO Update
  }).catch(error => {
   console.log(error)
  })
  } else {
    this.sendReferedStocks()
  }
},
async syncronizeAudit () {
  AuditSyncronization.localDbGetAll().then(lista => {
  AuditSyncronization.apiSyncDeletedRecords(lista)
  })
}
}
