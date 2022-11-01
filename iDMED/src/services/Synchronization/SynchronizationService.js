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
import PatientVisitDetails from 'src/store/models/patientVisitDetails/PatientVisitDetails'
import PatientVisit from 'src/store/models/patientVisit/PatientVisit'
import Pack from 'src/store/models/packaging/Pack'
import Prescription from 'src/store/models/prescription/Prescription'
import PatientServiceIdentifier from 'src/store/models/patientServiceIdentifier/PatientServiceIdentifier'

export default {
  async loadAndSaveAppParameters (clinicId) {
    const offset = 0
    const max = 100
    await Duration.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        Duration.localDbAdd(item)
      })
    })
    await ClinicalServiceAttributeType.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        ClinicalServiceAttributeType.localDbAdd(item)
      })
    })
    await ClinicalService.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        ClinicalService.localDbAdd(item)
      })
    })
    await ClinicSector.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        ClinicSector.localDbAdd(item)
      })
    })
    await IdentifierType.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        IdentifierType.localDbAdd(item)
      })
    })
    await EpisodeType.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        EpisodeType.localDbAdd(item)
      })
    })
    await FacilityType.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        FacilityType.localDbAdd(item)
      })
    })
    await StartStopReason.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        StartStopReason.localDbAdd(item)
      })
    })
    await ClinicalServiceAttribute.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        ClinicalServiceAttribute.localDbAdd(item)
      })
    })
    await Drug.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        Drug.localDbAdd(item)
      })
    })
    await TherapeuticRegimen.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        TherapeuticRegimen.localDbAdd(item)
      })
    })
    await TherapeuticLine.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        TherapeuticLine.localDbAdd(item)
      })
    })
    await Form.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        Form.localDbAdd(item)
      })
    })
    await DispenseType.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        DispenseType.localDbAdd(item)
      })
    })
    this.doClinicGet(0, 100)
    await InteroperabilityType.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        InteroperabilityType.localDbAdd(item)
      })
    })
    await InteroperabilityAttribute.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        InteroperabilityAttribute.localDbAdd(item)
      })
    })
    await HealthInformationSystem.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        HealthInformationSystem.localDbAdd(item)
      })
    })
    await StockCenter.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        StockCenter.localDbAdd(item)
      })
    })
    await Stock.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        Stock.localDbAdd(item)
      })
    })
    await InventoryStockAdjustment.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        InventoryStockAdjustment.localDbAdd(item)
      })
    })
    await StockOperationType.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        StockOperationType.localDbAdd(item)
      })
    })
    await ReferedStockMoviment.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        ReferedStockMoviment.localDbAdd(item)
      })
    })
    await DestroyedStock.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        DestroyedStock.localDbAdd(item)
      })
    })
    await FacilityType.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        FacilityType.localDbAdd(item)
      })
    })
    await ClinicSectorType.apiGetAll(offset, max).then(resp => {
      resp.response.data.forEach((item) => {
        ClinicSectorType.localDbAdd(item)
      })
    })
    await PatientTransReferenceType.apiGetAll(offset, max).then(resp => {
        resp.response.data.forEach((item) => {
          PatientTransReferenceType.localDbAdd(item)
        })
      })
      await SpetialPrescriptionMotive.apiGetAll(offset, max).then(resp => {
        resp.response.data.forEach((item) => {
          SpetialPrescriptionMotive.localDbAdd(item)
        })
      })
      await ProvincialServer.apiGetAll().then(resp => {
        resp.response.data.forEach((item) => {
          ProvincialServer.localDbAdd(item)
        })
      })
    },
    async doStockEntranceGet (clinicId, offset, max) {
      await StockEntrance.apiGetAllByClinicId(clinicId, offset, max).then(resp => {
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
    async doInventoryGet (clinicId, offset, max) {
      await Inventory.apiGetAllByClinicId(clinicId, offset, max).then(resp => {
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
    async doPatientGet (clinicId, offset, max) {
      await Patient.apiGetAllByClinicId(clinicId, offset, max).then(resp => {
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
    async doClinicGet (offset, max) {
      await Clinic.apiGetAll(offset, max).then(resp => {
        if (resp.response.data.length > 0) {
          resp.response.data.forEach((item) => {
            Clinic.localDbAdd(item)
          })
          offset = offset + max
          setTimeout(this.doClinicGet(offset, max), 2)
        }
      })
    },
    async doPatientLastVisitDetailsGet (clinicId, offset, max) {
      await PatientVisitDetails.apiGetAllLastOfClinic(clinicId, offset, max).then(resp => {
        if (resp.response.data.length > 0) {
          resp.response.data.forEach((item) => {
            PatientVisitDetails.localDbAdd(item)
          })
          offset = offset + max
          setTimeout(this.doPatientLastVisitDetailsGet(offset, max), 2)
        }
      })
    },
    async doPatientVisitGet (clinicId, offset, max) {
      await PatientVisit.apiGetAllLastWithScreeningOfClinic(clinicId, offset, max).then(resp => {
        if (resp.response.data.length > 0) {
          resp.response.data.forEach((item) => {
            PatientVisit.localDbAdd(item)
          })
          offset = offset + max
          setTimeout(this.doPatientVisitGet(offset, max), 2)
        }
      })
    },
    async doPackGet (clinicId, offset, max) {
      await Pack.apiGetAllLastOfClinic(clinicId, offset, max).then(resp => {
        if (resp.response.data.length > 0) {
          resp.response.data.forEach((item) => {
            Pack.localDbAdd(item)
          })
          offset = offset + max
          setTimeout(this.doPackGet(offset, max), 2)
        }
      })
    },
    async doPrescriptionGet (clinicId, offset, max) {
      await Prescription.apiGetAllLastOfClinic(clinicId, offset, max).then(resp => {
        if (resp.response.data.length > 0) {
          resp.response.data.forEach((item) => {
            Prescription.localDbAdd(item)
          })
          offset = offset + max
          setTimeout(this.doPrescriptionGet(offset, max), 2)
        }
      })
    },
    async doIdentifiersGet (clinicId, offset, max) {
      await PatientServiceIdentifier.apiGetAllByClinicId(clinicId, offset, max).then(resp => {
        if (resp.response.data.length > 0) {
          resp.response.data.forEach((item) => {
            PatientServiceIdentifier.localDbAdd(item)
          })
          offset = offset + max
          setTimeout(this.doIdentifiersGet(offset, max), 2)
        }
      })
    },
    async start ($q, clinicId) {
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
    async send () {
      const patientVisitList = await PatientVisitDetails.localDbGetAll().then()
      console.log(patientVisitList)
    }
}
