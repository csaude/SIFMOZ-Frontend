<template>
  <div>
    <TitleBar>Detalhe do Grupo</TitleBar>
    <div class="row q-mt-md">
      <div class="col-3 q-pa-md q-pl-lg q-ml-lg q-mr-lg panel">
        <groupInfo @editGroup="editGroup"/>
      </div>
      <div class="col q-mr-lg">
        <q-scroll-area
          :thumb-style="thumbStyle"
          :content-style="contentStyle"
          :content-active-style="contentActiveStyle"
          style="height: 700px;"
          class="q-pr-md"
        >
          <span v-if="fecthedEpisodes >= group.members.length">
            <group-members @addNewMember="addNewMember" @newPrescription="newPrescription"/>
            <groupPacks :packHeaders="group.packHeaders" @newPacking="newPacking" />
          </span>
        </q-scroll-area>
      </div>
    </div>
      <q-dialog persistent v-model="showRegisterRegister">
        <groupRegister
          :step="groupAddEditStep"
          @close="showRegisterRegister = false" />
      </q-dialog>
      <q-dialog persistent v-model="showNewPackingForm" full-width>
        <groupPack
          :group="group"
          @close="showNewPackingForm = false" />
      </q-dialog>
      <q-dialog persistent v-model="showAddPrescription" full-width>
          <addEditPrescription
            :selectedVisitDetails="patientVisitDetails"
            step="create"
            @close="showAddPrescription = false" />
      </q-dialog>
  </div>
</template>

<script>
import { QSpinnerBall, SessionStorage } from 'quasar'
import Group from '../../store/models/group/Group'
import Patient from '../../store/models/patient/Patient'
import Episode from '../../store/models/episode/Episode'
import DispenseMode from '../../store/models/dispenseMode/DispenseMode'
import PatientVisitDetails from '../../store/models/patientVisitDetails/PatientVisitDetails'
import PatientVisit from '../../store/models/patientVisit/PatientVisit'
import Prescription from '../../store/models/prescription/Prescription'
import Clinic from '../../store/models/clinic/Clinic'
export default {
  data () {
    return {
      contentStyle: {
        backgroundColor: 'rgba(0,0,0,0.02)',
        color: '#555'
      },

      contentActiveStyle: {
        backgroundColor: '#eee',
        color: 'black'
      },

      thumbStyle: {
        right: '2px',
        borderRadius: '5px',
        backgroundColor: '#0ba58b',
        width: '5px',
        opacity: 0.75
      },
      fecthedEpisodes: 0,
      showRegisterRegister: false,
      groupAddEditStep: '',
      showNewPackingForm: false,
      showAddPrescription: false,
      patientVisitDetails: ''
    }
  },
  methods: {
    fecthMembersData () {
      this.$q.loading.show({
        message: 'Carregando detalhes do grupo...',
        spinnerColor: 'grey-4',
        spinner: QSpinnerBall
      })

      setTimeout(() => {
        this.$q.loading.hide()
      }, 700)
      DispenseMode.apiGetAll()
      this.group.members.forEach((member) => {
        member.patient = Patient.query().with(['identifiers.identifierType', 'identifiers.service.identifierType'])
                                .with('province')
                                .with('clinic').where('id', member.patient.id).first()
        member.patient.identifiers = member.patient.identifiers.filter((identifier) => {
          return identifier.service.id === this.group.service.id
        })
        Episode.apiGetAllByIdentifierId(member.patient.identifiers[0].id).then(resp => {
          console.log(resp.response.data)
          this.fecthedEpisodes = this.fecthedEpisodes + 1
        })
      })
    },
    newPrescription (patient, identifier) {
      const pvd = new PatientVisitDetails({
                          patientVisit: new PatientVisit({
                                          visitDate: new Date(),
                                          patient: Patient.query()
                                                          .with('province')
                                                          .with('district.province')
                                                          .with('clinic.province')
                                                          .where('id', patient.id)
                                                          .first(),
                                          clinic: this.clinic
                                        }),
                          clinic: this.clinic,
                          createPackLater: true,
                          prescription: new Prescription(),
                          episode: Episode.query()
                                          .with('startStopReason')
                                          .with('episodeType')
                                          .with('clinicSector')
                                          .with('patientServiceIdentifier')
                                          .where('id', identifier.episodes[0].id)
                                          .first()
                        })
      this.patientVisitDetails = pvd
      SessionStorage.set('selectedPatient', patient)
      this.showAddPrescription = true
    },
    addNewMember () {
      this.groupAddEditStep = 'addMember'
      this.showRegisterRegister = true
    },
    editGroup () {
      this.groupAddEditStep = 'edit'
      this.showRegisterRegister = true
    },
    newPacking () {
      this.showNewPackingForm = true
    }
  },
  mounted () {
    this.fecthMembersData()
  },
  computed: {
    group: {
      get () {
        return Group.query()
                    .with('service')
                    .with(['packHeaders.groupPacks.pack', 'packHeaders.duration'])
                    .with('members.patient.identifiers.identifierType')
                    .with('groupType')
                    .with('clinic.province')
                    .where('id', SessionStorage.getItem('selectedGroup').id)
                    .first()
      }
    },
    clinic () {
      return Clinic.query().with('province').where('id', SessionStorage.getItem('currClinic').id).first()
    }
  },
  components: {
    TitleBar: require('components/Shared/TitleBar.vue').default,
    groupInfo: require('components/Groups/Panel/GroupInfo.vue').default,
    groupRegister: require('components/Groups/AddEditGroup.vue').default,
    groupPack: require('components/Groups/GroupDispense.vue').default,
    groupMembers: require('components/Groups/Panel/GroupMembers.vue').default,
    groupPacks: require('components/Groups/Panel/GroupDispenses.vue').default,
    addEditPrescription: require('components/Patient/PatientPanel/AddEditPrescription.vue').default
  }
}
</script>

<style lang="scss">
  .panel {
    border: 1px solid $grey-13;
    border-radius: 10px
  }
</style>
