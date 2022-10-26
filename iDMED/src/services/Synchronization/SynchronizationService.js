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
import Stock from 'src/store/models/stock/Stock'
import { InventoryStockAdjustment } from 'src/store/models/stockadjustment/InventoryStockAdjustment'
import StockOperationType from 'src/store/models/stockoperation/StockOperationType'
import ReferedStockMoviment from 'src/store/models/stockrefered/ReferedStockMoviment'
import DestroyedStock from 'src/store/models/stockdestruction/DestroyedStock'
import { LocalStorage } from 'quasar'

export default {
  loadAndSaveAppParameters ($q) {
    const offset = 0
    const max = 100
    Duration.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        Duration.localDbAdd(item)
      })
    })
    ClinicalServiceAttributeType.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        ClinicalServiceAttributeType.localDbAdd(item)
      })
    })
    ClinicalService.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        ClinicalService.localDbAdd(item)
      })
    })
    ClinicSector.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        ClinicSector.localDbAdd(item)
      })
    })
    IdentifierType.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        IdentifierType.localDbAdd(item)
      })
    })
    EpisodeType.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        EpisodeType.localDbAdd(item)
      })
    })
    FacilityType.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        FacilityType.localDbAdd(item)
      })
    })
    StartStopReason.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        StartStopReason.localDbAdd(item)
      })
    })
    ClinicalServiceAttribute.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        ClinicalServiceAttribute.localDbAdd(item)
      })
    })
    Drug.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        Drug.localDbAdd(item)
      })
    })
    TherapeuticRegimen.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        TherapeuticRegimen.localDbAdd(item)
      })
    })
    TherapeuticLine.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        TherapeuticLine.localDbAdd(item)
      })
    })
    Form.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        Form.localDbAdd(item)
      })
    })
    DispenseType.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        DispenseType.localDbAdd(item)
      })
    })
    this.doClinicGet(0, 100)
    InteroperabilityType.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        InteroperabilityType.localDbAdd(item)
      })
    })
    InteroperabilityAttribute.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        InteroperabilityAttribute.localDbAdd(item)
      })
    })
    HealthInformationSystem.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        HealthInformationSystem.localDbAdd(item)
      })
    })
    StockCenter.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        StockCenter.localDbAdd(item)
      })
    })
    Stock.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        Stock.localDbAdd(item)
      })
    })
    InventoryStockAdjustment.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        InventoryStockAdjustment.localDbAdd(item)
      })
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
    DestroyedStock.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        DestroyedStock.localDbAdd(item)
      })
    })
    FacilityType.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        FacilityType.localDbAdd(item)
      })
    })
   ClinicSectorType.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        ClinicSectorType.localDbAdd(item)
      })
    })
      PatientTransReferenceType.apiGetAll(offset, max).then(resp => {
        resp.response.data.forEach((item) => {
          PatientTransReferenceType.localDbAdd(item)
        })
      })
      SpetialPrescriptionMotive.apiGetAll(offset, max).then(resp => {
        resp.response.data.forEach((item) => {
          SpetialPrescriptionMotive.localDbAdd(item)
        })
      })
      ProvincialServer.apiGetAll().then(resp => {
        resp.response.data.forEach((item) => {
          ProvincialServer.localDbAdd(item)
        })
      })
      LocalStorage.set('system-sync-status', 'done')
      $q.loading.hide()
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
    doInventoryGet (clinicId, offset, max) {
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
      console.log('DoGetPatiens of: ', clinicId)
      Patient.apiGetAllByClinicId(clinicId, offset, max).then(resp => {
          if (resp.response.data.length > 0 && offset < 1800) {
            resp.response.data.forEach((item) => {
              Patient.localDbAdd(item)
            })
            offset = offset + max
            setTimeout(this.doPatientGet(clinicId, offset, max), 2)
          }
        }).catch(error => {
            console.log(error)
        })
    },
    doClinicGet (offset, max) {
      Clinic.apiGetAll(offset, max).then(resp => {
        if (resp.response.data.length > 0) {
          console.log(resp.response.data)
          resp.response.data.forEach((item) => {
            Clinic.localDbAdd(item)
          })
          offset = offset + max
          setTimeout(this.doClinicGet(offset, max), 2)
        }
      }).catch(error => {
          console.log(error)
      })
    }
}
