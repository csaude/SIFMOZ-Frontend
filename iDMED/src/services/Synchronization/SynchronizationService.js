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
import StockAlert from 'src/store/models/stockAlert/StockAlert'
import db from 'src/store/localbase'
import DrugStockFileEvent from 'src/store/models/drugStockFileEvent/DrugStockFileEvent'

export default {
  async loadAndSaveAppParameters (clinicId) {
    const offset = 0
    const max = 100
    this.doClinicGet(0, 100)

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
   /* await Stock.apiGetAll(offset, max).then(resp => {
        Stock.localDbUpdateAll(resp.response.data)
    }) */
    await InventoryStockAdjustment.apiGetAll(offset, max).then(resp => {
        InventoryStockAdjustment.localDbUpdateAll(resp.response.data)
    })
    await StockOperationType.apiGetAll(offset, max).then(resp => {
        StockOperationType.localDbUpdateAll(resp.response.data)
    })
    await ReferedStockMoviment.apiGetAll(offset, max).then(resp => {
        ReferedStockMoviment.localDbUpdateAll(resp.response.data)
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
    },
    doStockEntranceGet (clinicId, offset, max) {
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
      Inventory.apiGetAllByClinicId(clinicId, offset, max).then(resp => {
        console.log('InventoryLog:', resp.response.data)
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
    //  await this.doInventoryGet(clinicId, 0, 100)
      await this.doGetAllStockAlert(clinicId, 0, 100)
      await this.loadAndSaveAppParameters(clinicId)
      await this.doPatientGet(clinicId, 0, 100)
      await this.doStockEntranceGet(clinicId, 0, 100)
      await this.doIdentifiersGet(clinicId, 0, 100)
      await this.doPatientLastVisitDetailsGet(clinicId, 0, 100)
      await this.doPatientVisitGet(clinicId, 0, 100)
      await this.doPackGet(clinicId, 0, 100)
      await this.doPrescriptionGet(clinicId, 0, 100)
      await LocalStorage.set('system-sync-status', 'done')
      $q.loading.hide()
    },
    async send () {}
}
