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
import Episode from 'src/store/models/episode/Episode'
import Group from 'src/store/models/group/Group'
import GroupType from 'src/store/models/groupType/GroupType'
import DispenseMode from 'src/store/models/dispenseMode/DispenseMode'
import GroupMember from 'src/store/models/groupMember/GroupMember'
import GroupMemberPrescription from 'src/store/models/group/GroupMemberPrescription'

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
    await Stock.apiGetAll(offset, max).then(resp => {
        Stock.localDbUpdateAll(resp.response.data)
    })
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
      await GroupType.apiGetAll().then(resp => {
        GroupType.localDbUpdateAll(resp.response.data)
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
              item.members.forEach((member) => {
              member.patient = Patient.query()
              .with('identifiers.identifierType')
              .with('identifiers.service.episodes')
              .where('id', member.patient_id).get()
              console.log('Member: ', Patient
              .query()
              .with('identifiers.identifierType')
              .where('id', member.patient_id).get())
              // member.patient.identifiers = PatientServiceIdentifier.query().withAll().where('patient_id', member.patient_id).get()
              // console.log('Member_1: ', member)
              member.patient.identifiers.forEach(identifier => {
                // identifier = PatientServiceIdentifier.query().withAll().where('id', identifier.id).first()
                // if (identifier.service.code === this.group.service.code) {
                //   identifier.episodes = Episode.query().withAll().where('patientServiceIdentifier_id', identifier.id).get()
                //   console.log(identifier.episodes.length)
                //   identifier.episodes.forEach(episode => {
                //     episode.patientVisitDetails[0] = PatientVisitDetails.query().withAll().where('episode_id', episode.id).first()
                //     this.loadVisitDetailsInfo(episode.patientVisitDetails, 0)
                //     console.log('OffLINE_MODE_END1')
                //   })
                // }
              })
            })

            if (resp.response.data.length > 0) {
              Group.localDbAdd(item)
            }
          })
          offset = offset + max
          setTimeout(this.doGroupGet(clinicId, offset, max), 2)
        }).catch(error => {
            console.log(error)
        })
    },
    doClinicalServiceGet (offset, max) {
      ClinicalService.apiGetAll(offset, max).then(resp => {
          resp.response.data.forEach((item) => {
            ClinicalService.localDbAdd(item)
          })
          offset = offset + max
          setTimeout(this.doClinicalServiceGet(offset, max), 2)
        }).catch(error => {
            console.log(error)
        })
    },
    doGroupTypeGet () {
      GroupType.apiGetAll().then(resp => {
          resp.response.data.forEach((item) => {
            GroupType.localDbAdd(item)
          })
          // offset = offset + max
          // setTimeout(this.doClinicalServiceGet(offset, max), 2)
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
    doGroupMemberOfClinicGet (clinicId, offset, max) {
      GroupMember.apiGetAllOfClinic(clinicId, offset, max).then(resp => {
        if (resp.response.data.length > 0) {
          resp.response.data.forEach((item) => {
            GroupMember.localDbAdd(item)
          })
          offset = offset + max
          setTimeout(this.doGroupMemberOfClinicGet(clinicId, offset, max), 2)
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
          console.log('SIZE_IDENTIFIERS: ', resp.response.data.length)
          resp.response.data.forEach((item) => {
            PatientServiceIdentifier.localDbAdd(item)
          })
          offset = offset + max
          setTimeout(this.doIdentifiersGet(clinicId, offset, max), 2)
        }
      })
    },
    doEpisodeTypeGet (offset, max) {
      EpisodeType.apiGetAll(offset, max).then(resp => {
        console.log('EPISODE_Type: ', resp.response.status)
        if (resp.response.data.length > 0) {
          console.log('EPISODE_Types: ', resp.response.data.length)
          resp.response.data.forEach((item) => {
            EpisodeType.localDbAdd(item)
          })
          offset = offset + max
          setTimeout(this.doEpisodesGet(offset, max), 2)
        }
      })
    },
    doEpisodesGet (clinicId, offset, max) {
      Episode.apiGetAllByClinicId(clinicId, offset, max).then(resp => {
        console.log('EPISODES: ', resp.response.status)
        if (resp.response.data.length > 0) {
          console.log('SIZE_Episodes: ', resp.response.data.length)
          resp.response.data.forEach((item) => {
            Episode.localDbAdd(item)
          })
          offset = offset + max
          setTimeout(this.doEpisodesGet(clinicId, offset, max), 2)
        }
      })
    },
    doDispenseModeGet () {
      DispenseMode.apiGetAll().then(resp => {
        if (resp.response.data.length > 0) {
          resp.response.data.forEach((item) => {
            DispenseMode.localDbAdd(item)
          })
        }
      })
    },
    doGroupMemberPrescriptionGet () {
      GroupMemberPrescription.apiGetAll().then(resp => {
        console.log('STATUS: ', resp.response.status)
        if (resp.response.data.length > 0) {
          resp.response.data.forEach((item) => {
            console.log('SIZE_GroupMemberPrescription: ', resp.response.data.length)
            GroupMemberPrescription.localDbAdd(item)
          })
        }
      })
    },
    doIdentifierTypeGet () {
      IdentifierType.apiGetAll().then(resp => {
        console.log('STATUS_IDENTIFIERTYPE: ', resp.response.status)
        if (resp.response.data.length > 0) {
          console.log('SIZE_IDENTIFIERTYPE: ', resp.response.data.length)
          resp.response.data.forEach((item) => {
            IdentifierType.localDbAdd(item)
          })
        }
      })
    },

    async start ($q, clinicId) {
      this.doPatientGet(clinicId, 0, 100)
      this.doStockEntranceGet(clinicId, 0, 100)
      this.doIdentifierTypeGet()
      this.doIdentifiersGet(clinicId, 0, 100)
      this.doPatientLastVisitDetailsGet(clinicId, 0, 100)
      this.doPatientVisitGet(clinicId, 0, 100)
      this.doPackGet(clinicId, 0, 100)
      this.doPrescriptionGet(clinicId, 0, 100)
      this.doInventoryGet(clinicId, 0, 100)
      this.doGroupTypeGet()
      this.doGroupGet(clinicId, 0, 100)
      this.doClinicalServiceGet(clinicId, 0, 100)
      this.doDispenseModeGet()
      this.doGroupMemberOfClinicGet(clinicId, 0, 100)
      this.doGroupMemberPrescriptionGet()
      this.doEpisodeTypeGet(0, 100)
      this.doEpisodesGet(clinicId, 0, 100)
      await this.loadAndSaveAppParameters(clinicId)
      LocalStorage.set('system-sync-status', 'done')
      $q.loading.hide()
    },
    async send () {}
}
