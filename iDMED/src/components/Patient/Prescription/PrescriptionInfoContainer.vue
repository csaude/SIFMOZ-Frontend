  <template>
  <div>
  <ListHeader :addVisible="false" :bgColor="headerColor" >{{ (curIdentifier.service === null || curIdentifier.service === undefined) ? 'Sem Info' : curIdentifier.service.code }} </ListHeader>
    <q-card
      v-if="lastStartEpisode !== null && lastStartEpisode.lastVisit() !== null && prescriptionDetails !== null"
      class="noRadius">
      <q-card-section class="row q-pa-none">
        <div class="col-5 bg-white q-pa-md">
          <div class="row ">
            <div class="col text-grey-9 text-weight-medium">Regime Terapêutico:</div>
            <div class="col text-grey-8">{{ (prescriptionDetails.therapeuticRegimen === null || prescriptionDetails.therapeuticRegimen === undefined) ? 'Sem Info' : prescriptionDetails.therapeuticRegimen.description }}</div>
            <div class="col text-grey-9 text-weight-medium">Tipo Paciente:</div>
            <div class="col text-grey-8">Manutenção</div>
          </div>
          <div class="row ">
            <div v-if="prescriptionDetails.therapeuticLine !== null" class="col text-grey-9 text-weight-medium">Linha Terapêutica:</div>
            <div v-if="prescriptionDetails.therapeuticLine !== null" class="col text-grey-8">{{ (prescriptionDetails.therapeuticLine === null || prescriptionDetails.therapeuticLine === undefined) ? 'Sem Info' : prescriptionDetails.therapeuticLine.description }}</div>
            <div class="col text-grey-10">Clínico:</div>
            <div v-if="prescription.doctor !== null" class="col text-grey-10">{{ (prescription.doctor === null || prescription.doctor === undefined) ? 'Sem Info' : prescription.doctor.fullName }}</div>
          </div>
          <div class="row ">
            <div class="col text-grey-9 text-weight-medium">Tipo Dispensa:</div>
            <div v-if="prescriptionDetails.dispenseType !== null" class="col text-grey-8">{{ (prescriptionDetails.dispenseType === null || prescriptionDetails.dispenseType === undefined) ? 'Sem Info' : prescriptionDetails.dispenseType.description }}</div>
            <div class="col text-grey-9 text-weight-medium">Validade:</div>
            <div class="col" :class="validadeColor">{{ (prescriptionDetails === null || prescriptionDetails === undefined) ? 'Sem Info' : remainigDuration }} mes(es)</div>
          </div>
          <div class="row ">
            <div class="col text-grey-9 text-weight-medium">Duração:</div>
            <div class="col text-grey-8">{{ (prescription === null || prescription === undefined) ? 'Sem Info' : prescription.duration.description }}</div>
            <div class="col text-grey-9 text-weight-medium"></div>
            <div class="col text-grey-8"></div>
          </div>
          <q-separator/>
          <div class="row q-my-md">
            <q-space/>
            <q-btn
              v-if="!isClosed"
              unelevated
              color="red"
              label="Remover"
              @click="removePrescription()"
              class="float-right q-ml-sm" />
          </div>
        </div>
        <div class="col q-py-md">
          <ListHeader :addVisible="!isClosed" bgColor="bg-primary" @showAdd="$emit('addNewPack', lastStartEpisode.lastVisit())">Dispensa</ListHeader>
          <EmptyList v-if="lastPackOnPrescription === null" >Nenhum registo de Levantamentos</EmptyList>
          <span v-if="lastPackOnPrescription !== null && lastPackOnPrescription.packagedDrugs.length > 0 && lastPackOnPrescription.packagedDrugs[0].drug !== null">
            <PackInfo
              @editPack="editPack"
              @removePack="removePack"
              :isClosed="isClosed"
              :pack="lastPackOnPrescription"/>
          </span>
        </div>
      </q-card-section>
    </q-card>
    <EmptyList v-else >Nenhuma Prescrição Adicionada para o serviço {{(identifier.service === null || identifier.service === undefined) ? 'Sem Info' : identifier.service.code}}</EmptyList>
    <q-dialog persistent v-model="alert.visible">
        <Dialog :type="alert.type" @closeDialog="closeDialog">
          <template v-slot:title> Informação</template>
          <template v-slot:msg> {{alert.msg}} </template>
        </Dialog>
      </q-dialog>
  </div>
</template>

<script>
import { SessionStorage } from 'quasar'
import { ref } from 'vue'
import Patient from '../../../store/models/patient/Patient'
import PatientServiceIdentifier from '../../../store/models/patientServiceIdentifier/PatientServiceIdentifier'
import Episode from '../../../store/models/episode/Episode'
import Prescription from '../../../store/models/prescription/Prescription'
import PatientVisitDetails from '../../../store/models/patientVisitDetails/PatientVisitDetails'
import Pack from '../../../store/models/packaging/Pack'
import TherapeuticRegimen from '../../../store/models/therapeuticRegimen/TherapeuticRegimen'
import TherapeuticLine from '../../../store/models/therapeuticLine/TherapeuticLine'
import Doctor from '../../../store/models/doctor/Doctor'
import Duration from '../../../store/models/Duration/Duration'
import DispenseType from '../../../store/models/dispenseType/DispenseType'
import PrescriptionDetail from '../../../store/models/prescriptionDetails/PrescriptionDetail'
import Drug from '../../../store/models/drug/Drug'
import ClinicalService from '../../../store/models/ClinicalService/ClinicalService'
export default {
  props: ['identifier'],
  data () {
    return {
      alert: ref({
        type: '',
        visible: false,
        msg: ''
      }),
      isPatientActive: false,
      selectedPack: new Pack(),
      showAddEditEpisode: false
    }
  },
  components: {
    ListHeader: require('components/Shared/ListHeader.vue').default,
    EmptyList: require('components/Shared/ListEmpty.vue').default,
    Dialog: require('components/Shared/Dialog/Dialog.vue').default,
    PackInfo: require('components/Patient/Prescription/PackInfo.vue').default
  },
  methods: {
     init () {
      if (this.identifier !== null) {
        PatientServiceIdentifier.apiFetchById(this.identifier.id)
        if (this.identifier.service !== null) {
           ClinicalService.apiFetchById(this.identifier.service.id)
        }
      }
      if (this.prescriptionDetails !== null) {
      PrescriptionDetail.apiFetchById(this.prescriptionDetails.id)
      }
    },
    checkPatientStatusOnService () {
      if (this.curIdentifier.endDate !== '') {
        this.isPatientActive = true
      }
    },
    editPack () {
      this.$emit('editPack', this.patientVisitDetais)
    },
    removePack () {
      PatientVisitDetails.apiDelete(this.patientVisitDetais).then(resp => {
        console.log(resp)
      })
    },
    removePrescription () {
      if (this.lastPack !== null) {
        this.displayAlert('error', 'Esta prescrição ja possui registo de dispensas associados, remova primeiro as dispensas.')
      } else {
        // remotion code
      }
    },
    displayAlert (type, msg) {
      this.alert.type = type
      this.alert.msg = msg
      this.alert.visible = true
    },
    closeDialog () {
      this.alert.visible = false
    },
    lastStartEpisodeWithPrescription () {
      let episode = null
      const episodes = Episode.query()
                              .with('startStopReason')
                              .with('clinicSector')
                              .with('patientServiceIdentifier')
                              .with('patientVisitDetails.*')
                              .whereHas('episodeType', (query) => {
                                    query.where('code', 'INICIO')
                                  })
                              .where('patientServiceIdentifier_id', this.identifier.id)
                              .orderBy('creationDate', 'desc')
                              .get()
      Object.keys(episodes).forEach(function (k) {
        const id = episodes[k]
        if (episode === null && id.hasVisits()) {
          episode = id
        }
      })
      return episode
    },
    reloadParams () {
      TherapeuticRegimen.apiGetAll()
      TherapeuticLine.apiGetAll()
      Doctor.apiGetAll()
      Duration.apiGetAll()
      DispenseType.apiGetAll()
      Drug.apiGetAll(0, 200)
    },
    async reloadPrescriptionDetails (id) {
      await PrescriptionDetail.apiFetchById(id)
    },
    async reloadPrescription (id) {
      await Prescription.apiFetchById(id)
    },
    getRemainigDuration () {
      if (this.prescription === null) return null
      if (this.prescription.patientVisitDetails.length <= 0) {
        this.prescription.patientVisitDetails = PatientVisitDetails.query()
                                                                   .with('pack')
                                                                   .where('prescription_id', this.prescription.id)
                                                                   .get()
      }
      return this.prescription.remainigDuration()
    },
    loadAllPacksOfPrescription () {
      if (this.prescription === null) return null
      if (this.prescription.patientVisitDetails.length <= 0) {
        this.prescription.patientVisitDetails = PatientVisitDetails.query()
                                                                   .with('pack.packagedDrugs.drug')
                                                                   .where('prescription_id', this.prescription.id)
                                                                   .get()
      }
      return this.prescription.lastPackOnPrescription()
    }
  },
  computed: {
    episodes: {
      get () {
          const episodes = Episode.query()
                                .withAll()
                                .with('episodeType')
                                .with('clinicSector')
                                .where('patientServiceIdentifier_id', this.identifier.id)
                                .orderBy('creationDate', 'desc')
                                .limit(2)
                                .get()
        if (episodes.length > 0) {
          episodes[0].isLast = true
        }
        return episodes
      }
    },
    lastPackOnPrescription () {
      if (this.loadAllPacksOfPrescription() === null) return null
      return Pack.query()
                 .with('packagedDrugs.*')
                 .with('patientVisitDetails')
                 .where('id', this.loadAllPacksOfPrescription().id)
                 .orderBy('pickupDate', 'desc')
                 .first()
    },
    patient: {
      get () {
        return new Patient(SessionStorage.getItem('selectedPatient'))
      }
    },
    validadeColor () {
      if (this.prescription !== null && this.prescription.remainigDuration() > 0) {
        return 'text-primary'
      } else {
        return 'text-red'
      }
    },
    curIdentifier: {
        get () {
          return PatientServiceIdentifier.query()
                                      .with('identifierType')
                                      .with('service.*')
                                      .with('episodes.*', (query) => {
                                              query.orderBy('creationDate', 'desc')
                                            })
                                      .where('id', this.identifier.id).first()
        }
      },
    /*
    curIdentifier () {
      return PatientServiceIdentifier.query().withAllRecursive().where('id', this.identifier.id).first()
    }, */
    prescriptionDetails: {
      get () {
        if (this.prescription === null) return null
        return PrescriptionDetail.query().withAll().where('prescription_id', this.prescription.id).first()
      }
    },
    /*
    prescriptionDetails () {
      if (this.prescription === null) return null
      return PrescriptionDetail.query().withAll().where('prescription_id', this.prescription.id).first()
    }, */

    patientVisitDetais: {
      get () {
        if (this.prescription === null) return null
        return PatientVisitDetails.query().with('pack').with('prescription.*').where('id', this.prescription.patientVisitDetails[0].id).first()
      }
    },

    prescription () {
      if (this.lastStartEpisode === null || this.lastStartEpisode.lastVisit() === null) return null
        const presc = Prescription.query()
                                  .with('clinic')
                                  .with('doctor')
                                  .with('patientVisitDetails.pack')
                                  .with('prescriptionDetails.*')
                                  .with('duration')
                                  .with('prescribedDrugs.*')
                                  .where('id', this.lastStartEpisode.lastVisit().prescription.id)
                                  .first()
        return presc
    },
    remainigDuration () {
      return this.getRemainigDuration()
    },
    lastStartEpisode () {
      return this.lastStartEpisodeWithPrescription()
    },
    lastPack: {
      get () {
         return Pack.query()
                 .with('packagedDrugs.*')
                 .with('patientVisitDetails')
                 .where('id', this.lastStartEpisode.lastVisit().pack.id)
                 .orderBy('pickupDate', 'desc')
                 .first()
      }
    },
    /*
    lastPack () {
      return Pack.query()
                 .with('packagedDrugs.*')
                 .with('patientVisitDetails')
                 .where('patientVisitDetails_id', this.patientVisitDetais.id)
                 .orderBy('pickupDate', 'desc')
                 .first()
    }, */
    lastEpisode: {
      get () {
        return Episode.query()
                    .withAll()
                    .where('patientServiceIdentifier_id', this.identifier.id)
                    .orderBy('episodeDate', 'desc')
                    .first()
      }
    },
    /*
    lastEpisode () {
      return Episode.query()
                    .withAll()
                    .where('patientServiceIdentifier_id', this.identifier.id)
                    .orderBy('creationDate', 'desc')
                    .first()
    }, */
    showEndDetails () {
      return this.lastEpisode !== null && this.lastEpisode.isCloseEpisode() && !this.lastEpisode.isDCReferenceEpisode()
    },
    headerColor () {
      if (!this.showEndDetails) {
        return 'bg-grey-4'
      } else {
        return 'bg-red-7'
      }
    },
    isClosed () {
      return this.showEndDetails || this.prescription.remainigDuration() <= 0
    }
  },
  created () {
    this.init()
    this.patient = Object.assign({}, this.selectedPatient)
    this.reloadParams()
  },
  mounted () {
  }
}
</script>

<style>
  .noRadius {
    border-radius: 0px
  }
</style>
