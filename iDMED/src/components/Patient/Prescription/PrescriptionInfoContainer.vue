  <template>
  <div>
  <ListHeader :addVisible="false" bgColor="bg-grey-4" >{{ identifier.service.code }} </ListHeader>
    <q-card
      v-if="lastStartEpisode !== null && lastStartEpisode.lastVisit() !== null"
      class="noRadius">
      <q-card-section class="row q-pa-none">
        <div class="col-5 bg-white q-pa-md">
          <div class="row ">
            <div class="col text-grey-9 text-weight-medium">Regime Terapêutico:</div>
            <div class="col text-grey-8">{{ prescriptionDetails.therapeuticRegimen.description }}</div>
            <div class="col text-grey-9 text-weight-medium">Tipo Paciente:</div>
            <div class="col text-grey-8">Manutenção</div>
          </div>
          <div class="row ">
            <div v-if="prescriptionDetails.therapeuticLine !== null" class="col text-grey-9 text-weight-medium">Linha Terapêutica:</div>
            <div v-if="prescriptionDetails.therapeuticLine !== null" class="col text-grey-8">{{ prescriptionDetails.therapeuticLine.description }}</div>
            <div class="col text-grey-10">Clínico:</div>
            <div class="col text-grey-10">{{ prescription.doctor.fullName }}</div>
          </div>
          <div class="row ">
            <div class="col text-grey-9 text-weight-medium">Tipo Dispensa:</div>
            <div class="col text-grey-8">{{ prescriptionDetails.dispenseType.description }}</div>
            <div class="col text-grey-9 text-weight-medium">Validade:</div>
            <div class="col" :class="validadeColor">{{ patientVisitDetais.getPrescriptionRemainigDuration() }} mes(es)</div>
          </div>
          <div class="row ">
            <div class="col text-grey-9 text-weight-medium">Duração:</div>
            <div class="col text-grey-8">{{ prescription.duration.description }}</div>
            <div class="col text-grey-9 text-weight-medium"></div>
            <div class="col text-grey-8"></div>
          </div>
          <q-separator/>
          <div class="row q-my-md">
            <q-space/>
            <q-btn
              v-if="patientVisitDetais.getPrescriptionRemainigDuration() > 0"
              unelevated
              color="red"
              label="Remover"
              @click="removePrescription()"
              class="float-right q-ml-sm" />
          </div>
        </div>
        <div class="col q-py-md">
          <ListHeader :addVisible="patientVisitDetais.getPrescriptionRemainigDuration() > 0" bgColor="bg-primary" @showAdd="$emit('addNewPack', lastStartEpisode.lastVisit())">Dispensa</ListHeader>
          <EmptyList v-if="curIdentifier.episodes.length <= 0" >Nenhum registo de Levantamentos</EmptyList>
          <span>
            <PackInfo
              @editPack="editPack"
              :pack="lastPack"/>
          </span>
        </div>
      </q-card-section>
    </q-card>
    <EmptyList v-else >Nenhuma Prescrição Adicionada para o serviço {{identifier.service.code}}</EmptyList>
    <q-dialog persistent v-model="alert.visible">
        <Dialog :type="alert.type" @closeDialog="closeDialog">
          <template v-slot:title> Informação</template>
          <template v-slot:msg> {{alert.msg}} </template>
        </Dialog>
      </q-dialog>
  </div>
  <pre>{{lastStartEpisode}}</pre>
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
      showAddEpisode: false,
      selectedEpisode: {},
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
    checkPatientStatusOnService () {
      if (this.curIdentifier.endDate !== '') {
        this.isPatientActive = true
      }
    },
    editPack (episode) {
      this.selectedEpisode = Object.assign({}, episode)
      this.showAddEditEpisode = true
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
    }
  },
  computed: {
    patient () {
      return new Patient(SessionStorage.getItem('selectedPatient'))
    },
    validadeColor () {
      if (this.patientVisitDetais.getPrescriptionRemainigDuration() > 0) {
        return 'text-primary'
      } else {
        return 'text-red'
      }
    },
    curIdentifier () {
      return PatientServiceIdentifier.query().withAllRecursive().where('id', this.identifier.id).first()
    },
    prescriptionDetails () {
      if (this.prescription === null) return null

      return this.prescription.prescriptionDetails[0]
    },
    patientVisitDetais () {
      if (this.prescription === null) return null

      return PatientVisitDetails.query().with('packs').with('prescriptions.*').where('id', this.prescription.patientVisitDetails.id).first()
    },
    prescription () {
      if (this.lastStartEpisode.lastVisit() === null) return null

      return Prescription.query()
                        .with('clinic')
                        .with('doctor')
                        .with('patientVisitDetails')
                        .with('prescriptionDetails.*')
                        .with('duration')
                        .with('prescribedDrugs.*')
                        .where('patientVisitDetails_id', this.lastStartEpisode.lastVisit().id)
                        .first()
    },
    lastStartEpisode () {
      return this.lastStartEpisodeWithPrescription()
    },
    lastPack () {
      return Pack.query()
                 .with('packagedDrugs.*')
                 .with('patientVisitDetails')
                 .where('patientVisitDetails_id', this.patientVisitDetais.id)
                 .orderBy('pickupDate', 'desc')
                 .first()
    }
  },
  created () {
      // this.curIdentifier = new PatientServiceIdentifier(this.identifier)
      this.patient = Object.assign({}, this.selectedPatient)
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
