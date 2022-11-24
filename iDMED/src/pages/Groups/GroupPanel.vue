<template>
  <div>
    <PanelTitleBar
      v-if="mobile"
      :name="group.name"
      :groupType="group.groupType.description"
      @showGroupDetails="showGroupDetails"
    >
    Detalhe do Grupo
    </PanelTitleBar>
    <TitleBar v-else >Detalhe do Grupo</TitleBar>
    <div class="q-pa-md" v-if="mobile">
      <div class="q-pa-md q-gutter-sm">
        <q-drawer
          v-model="showGroupInfo"
          :width="500"
          :breakpoint="500"
          overlay
          bordered
          behavior="mobile"
        >
          <q-scroll-area class="fit">
                <div class="row q-mt-md">
                  <div class="col q-pa-md q-pl-lg q-ml-lg q-mr-lg panel">
                    <groupInfo @editGroup="editGroup" @desintagrateGroup="desintagrateGroup"/>
                  </div>
                </div>
          </q-scroll-area>
        </q-drawer>
        <q-scroll-area style="height: 565px">
        <group-members
              v-if="dataFetchDone"
              @addNewMember="addNewMember"
              @newPrescription="newPrescription"
              @desintagrateGroup="desintagrateGroup"/>
            <groupPacks :packHeaders="group.packHeaders" @newPacking="newPacking" />
        </q-scroll-area>
      </div>
    </div>

   <span v-if="website">
      <div class="row q-mt-md">
        <div class="col-3 q-pa-md q-pl-lg q-ml-lg q-mr-lg panel">
          <groupInfo @editGroup="editGroup" @desintagrateGroup="desintagrateGroup"/>
        </div>
        <div class="col q-mr-lg">
          <q-scroll-area
            :thumb-style="thumbStyle"
            :content-style="contentStyle"
            :content-active-style="contentActiveStyle"
            style="height: 700px"
            class="q-pa-md"
          >
            <span>
              <group-members
                v-if="dataFetchDone"
                @addNewMember="addNewMember"
                @newPrescription="newPrescription"
                @desintagrateGroup="desintagrateGroup"/>
              <groupPacks :packHeaders="group.packHeaders" @newPacking="newPacking" />
            </span>
          </q-scroll-area>
        </div>
      </div>
    </span>

      <q-dialog v-model="alert.visible" persistent>
        <Dialog :type="alert.type" @cancelOperation="cancelOperation" @closeDialog="closeDialog" @commitOperation="doOnConfirm">
          <template v-slot:title> {{dialogTitle}}</template>
          <template v-slot:msg> {{alert.msg}} </template>
        </Dialog>
      </q-dialog>
      <q-dialog persistent v-model="showRegisterRegister">
        <groupRegister
          :step="groupAddEditStep"
          @close="showRegisterRegister = false" />
      </q-dialog>
      <q-dialog persistent v-model="showNewPackingForm" >
        <groupPack
          :group="group"
          :defaultPickUpDate="defaultPickUpDate"
          @close="showNewPackingForm = false" />
      </q-dialog>
      <q-dialog persistent v-model="showAddPrescription" >
          <addEditPrescription
            :selectedVisitDetails="patientVisitDetails"
            :service="group.service"
            :member="selectedMember"
            step="create"
            @close="showAddPrescription = false" />
      </q-dialog>
  </div>
</template>

<script>
import { ref } from 'vue'
import { SessionStorage, useQuasar, QSpinnerBall } from 'quasar'
import Group from '../../store/models/group/Group'
import Patient from '../../store/models/patient/Patient'
import Episode from '../../store/models/episode/Episode'
import DispenseMode from '../../store/models/dispenseMode/DispenseMode'
import PatientVisitDetails from '../../store/models/patientVisitDetails/PatientVisitDetails'
import PatientVisit from '../../store/models/patientVisit/PatientVisit'
import Clinic from '../../store/models/clinic/Clinic'
import ClinicalService from '../../store/models/ClinicalService/ClinicalService'
import PrescriptionDetail from '../../store/models/prescriptionDetails/PrescriptionDetail'
import IdentifierType from '../../store/models/identifierType/IdentifierType'
import PatientServiceIdentifier from '../../store/models/patientServiceIdentifier/PatientServiceIdentifier'
import Prescription from '../../store/models/prescription/Prescription'
import Pack from '../../store/models/packaging/Pack'
import GroupMemberPrescription from '../../store/models/group/GroupMemberPrescription'
import mixinplatform from 'src/mixins/mixin-system-platform'
import GroupMember from 'src/store/models/groupMember/GroupMember'
export default {
  mixins: [mixinplatform],
  data () {
    return {
      showGroupInfo: ref(false),
      alert: ref({
        type: '',
        visible: false,
        msg: ''
      }),
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
      patientVisitDetails: '',
      membersInfoLoaded: false,
      $q: useQuasar(),
      selectedMember: null,
      defaultPickUpDate: null
    }
  },
  watch: {
     membersInfoLoaded (oldp, newp) {
      if (oldp !== newp) {
        this.fecthMembersData()
        this.hideLoading()
      }
    }
  },
  methods: {
    init () {
        // Province.localDbGetAll().then(provinces => {
        //   Province.insert({ data: provinces })
        // })
        if (this.website) {
          // Episode.localDbGetAll().then(episodes => {
          //   Episode.insert({ data: episodes })
          // })
          // Pack.localDbGetAll().then(packs => {
          //   Pack.insert({ data: JSON.parse(JSON.stringify(packs)) })
          // })
          // ClinicalService.localDbGetAll().then(services => {
          //   ClinicalService.insert({ data: services })
          // })
          // Prescription.localDbGetAll().then(prescriptions => {
          //   Prescription.insert({ data: JSON.parse(JSON.stringify(prescriptions)) })
          // })
          // PatientVisitDetails.localDbGetAll().then(patientVisitDetails => {
          //   PatientVisitDetails.insert({ data: patientVisitDetails })
          // })
          // PatientServiceIdentifier.localDbGetAll().then(identifiers => {
          //   PatientServiceIdentifier.insert({ data: identifiers })
          // })
          // EpisodeType.localDbGetAll().then(episodeTypes => {
          //   EpisodeType.insert({ data: episodeTypes })
          // })
          // StartStopReason.localDbGetAll().then(startStopReasons => {
          //   StartStopReason.insert({ data: startStopReasons })
          // })
          Patient.localDbGetAll().then(patients => {
            console.log(patients)
            Patient.insert({ data: JSON.parse(JSON.stringify(patients)) })
          })
        }
        // await PatientServiceIdentifier.localDbGetAll().then(identifiers => {
        //   PatientServiceIdentifier.insert({ data: identifiers })
        // })
        // await ClinicSectorType.localDbGetAll().then(setorTypes => {
        //   ClinicSectorType.insert({ data: setorTypes })
        // })
        // await ClinicSector.localDbGetAll().then(sectors => {
        //   ClinicSector.insert({ data: sectors })
        // })
        // await EpisodeType.localDbGetAll().then(episodeTypes => {
        //   EpisodeType.insert({ data: episodeTypes })
        // })
        // await IdentifierType.localDbGetAll().then(idTypes => {
        //   IdentifierType.insert({ data: idTypes })
        // })
        // await StartStopReason.localDbGetAll().then(startStopReasons => {
        //   StartStopReason.insert({ data: startStopReasons })
        // })
        // GroupType.localDbGetAll().then(groupTypes => {
        //   GroupType.insert({ data: JSON.parse(JSON.stringify(groupTypes)) })
        // })
        // DispenseMode.localDbGetAll().then(dispenseModes => {
        //   DispenseMode.insert({ data: JSON.parse(JSON.stringify(dispenseModes)) })
        // })
        // Prescription.localDbGetAll().then(prescriptions => {
        //   Prescription.insert({ data: JSON.parse(JSON.stringify(prescriptions)) })
        // })
        // Pack.localDbGetAll().then(packs => {
        //   Pack.insert({ data: JSON.parse(JSON.stringify(packs)) })
        // })
        // GroupMember.localDbGetAll().then(members => {
        //   GroupMember.insert({ data: JSON.parse(JSON.stringify(members)) })
        // })
    },
    showGroupDetails () {
      this.showGroupInfo = !this.showGroupInfo
    },
    showloading () {
      console.log('loaging')
       this.$q.loading.show({
          spinner: QSpinnerBall,
          spinnerColor: 'gray',
          spinnerSize: 140,
          message: 'Processando, aguarde por favor...',
          messageColor: 'white'
        })
    },
    hideLoading () {
      this.$q.loading.hide()
    },
    fecthMembersData () {
      this.group.members.forEach((member) => {
        member.patient = Patient.query().with(['identifiers.identifierType', 'identifiers.service.identifierType'])
                                .with('province')
                                .with(['clinic.province', 'clinic.district.province', 'clinic.facilityType'])
                                .where('id', member.patient.id).first()
        member.patient.identifiers = member.patient.identifiers.filter((identifier) => {
          return identifier.service.id === this.group.service.id
        })
      })
    },
    loadMemberInfo () {
      if (this.website) { // Depois mudar para Mobile
        // this.showloading()
        console.log('MMMM: ', this.groupMembers)
        this.group.members.forEach((member) => {
          member.patient = Patient.query().where('id', member.patient_id).get()
          console.log('Member: ', Patient.query().where('id', member.patient_id).get())
          member.patient.identifiers = PatientServiceIdentifier.query().withAll().where('patient_id', member.patient_id).get()
          console.log('Member_1: ', member)
          member.patient.identifiers.forEach(identifier => {
            identifier = PatientServiceIdentifier.query().withAll().where('id', identifier.id).first()
            if (identifier.service.code === this.group.service.code) {
              identifier.episodes = Episode.query().withAll().where('patientServiceIdentifier_id', identifier.id).get()
              console.log(identifier.episodes.length)
              identifier.episodes.forEach(episode => {
                episode.patientVisitDetails[0] = PatientVisitDetails.query().withAll().where('episode_id', episode.id).first()
                this.loadVisitDetailsInfo(episode.patientVisitDetails, 0)
                console.log('OffLINE_MODE_END1')
              })
            }
          })
        })
      } else {
        this.showloading()
        DispenseMode.apiGetAll()
        this.group.members.forEach((member) => {
          GroupMemberPrescription.apiFetchByMemberId(member.id).then(respd => {
            console.log('STATUS: ', respd.response.status)
            if (respd.response.status === 200) {
              console.log('GROUPMEMBERPRESCRIPTION: ', respd.response.data)
              Prescription.apiFetchById(respd.response.data.prescription.id)
            }
          })
          Patient.apiFetchById(member.patient.id).then(res0 => {
            console.log('STATUS_1: ', res0.response.status)
            member.patient = res0.response.data
            member.patient.identifiers.forEach((identifier) => {
              identifier = PatientServiceIdentifier.query().withAll().where('id', identifier.id).first()
              if (identifier.service.code === this.group.service.code) {
                Episode.apiGetAllByIdentifierId(identifier.id).then(resp => {
                  if (resp.response.data.length > 0) {
                    identifier.episodes = resp.response.data
                    identifier.episodes.forEach(episode => {
                      PatientVisitDetails.apiGetLastByEpisodeId(episode.id).then(resp => {
                        if (resp.response.data) {
                          episode.patientVisitDetails[0] = resp.response.data
                          PatientVisitDetails.apiGetAllofPrecription(episode.patientVisitDetails[0].prescription.id).then(resp1 => {
                          })
                          this.loadVisitDetailsInfo(episode.patientVisitDetails, 0)
                          console.log('OnLINE_MODE_END')
                        }
                      })
                    })
                  }
                })
              }
            })
          })
        })
      }
    },
    loadVisitDetailsInfo (visitDetails, i) {
      if (this.website) { // Depois mudar para mobile
          console.log('VISIT_DETAILS: ', visitDetails[i].prescription)
          visitDetails[i].prescription = Prescription.query().withAll().where('id', visitDetails[i].prescription.id).first()
          visitDetails[i].pack = Pack.query().withAll().where('id', visitDetails[i].pack.id).first()
          this.membersInfoLoaded = true
      } else {
        Prescription.apiFetchById(visitDetails[i].prescription.id).then(resp => {
          visitDetails[i].prescription = resp.response.data
            Pack.apiFetchById(visitDetails[i].pack.id).then(resp => {
              visitDetails[i].pack = resp.response.data
              this.membersInfoLoaded = true
            })
        })
      }
    },
    desintagrateGroup () {
      this.group.members = this.group.members.filter((member) => { return member.isActive() })
          this.group.members.forEach((member) => {
          member.endDate = new Date()
          member.patient = Patient.query()
                                  .with(['clinic.province', 'clinic.district.province', 'clinic.facilityType'])
                                  .with('province')
                                  .with('district.province')
                                  .where('id', member.patient.id)
                                  .first()
          member.group = null
          member.clinic = Clinic.query()
                                .with('province')
                                .with('district.province')
                                .with('facilityType')
                                .where('id', member.clinic_id)
                                .first()
       })
       this.group.service.identifierType = IdentifierType.find(this.group.service.identifier_type_id)
       this.group.endDate = new Date()
       const group = Object.assign({}, this.group)
       group.packHeaders = []
       Group.apiUpdate(group).then(resp => {
         Group.apiFetchById(group.id)
         this.displayAlert('info', 'Operação efectuada com sucesso.')
       })
    },
    displayAlert (type, msg) {
      this.alert.type = type
      this.alert.msg = msg
      this.alert.visible = true
    },
    closeDialog () {
      this.alert.visible = false
    },
    newPrescription (member, identifier) {
      this.selectedMember = member
      const patient = member.patient
      patient.identifiers[0].episodes[0].lastVisit().prescription.prescriptionDetails[0] = PrescriptionDetail.query()
                                                                                                          .with('therapeuticLine')
                                                                                                          .with('therapeuticRegimen')
                                                                                                          .with('dispenseType')
                                                                                                          .where('prescription_id', patient.identifiers[0].episodes[0].lastVisit().prescription.id)
                                                                                                          .first()
      const pvd = new PatientVisitDetails({
                          patientVisit: new PatientVisit({
                                          visitDate: new Date(),
                                          patient: Patient.query()
                                                          .with('province')
                                                          .with('district.province')
                                                          .with(['clinic.province', 'clinic.district.province', 'clinic.facilityType'])
                                                          .where('id', patient.id)
                                                          .first(),
                                          clinic: this.clinic
                                        }),
                          clinic: this.clinic,
                          createPackLater: true,
                          prescription: patient.identifiers[0].episodes[0].lastVisit().prescription,
                          episode: Episode.query()
                                          .with('startStopReason')
                                          .with('episodeType')
                                          .with('clinicSector')
                                          .with('patientServiceIdentifier.service')
                                          .where('id', identifier.episodes[0].id)
                                          .first()
                        })
      this.patientVisitDetails = pvd
      this.group.service = ClinicalService.query()
                                          .with('identifierType')
                                          .with('attributes.clinicalServiceAttributeType')
                                          .with('therapeuticRegimens')
                                          .where('id', this.group.service.id)
                                          .first()
      SessionStorage.set('selectedPatient', patient)
      SessionStorage.set('selectedMember', member)
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
    newPacking (lasHeader) {
      console.log(lasHeader)
      if (lasHeader !== null && lasHeader !== undefined) this.defaultPickUpDate = lasHeader.nextPickUpDate
      this.showNewPackingForm = true
    }
  },
  mounted () {
    this.init()
    this.loadMemberInfo()
  },
  computed: {
    group: {
      get () {
        return Group.query()
                    .with('service')
                    .with(['packHeaders.groupPacks.pack', 'packHeaders.duration'])
                    .with('members.patient.identifiers.identifierType')
                    .with('groupType')
                    .with(['clinic.province', 'clinic.district.province', 'clinic.facilityType'])
                    .where('id', SessionStorage.getItem('selectedGroup').id)
                    .first()
      }
    },
    groupMembers: {
      get () {
        return GroupMember.query()
                    .with('group')
                    .with(['packHeaders.groupPacks.pack', 'packHeaders.duration'])
                   .with('patient.identifiers.identifierType')
                    .where('group_id', SessionStorage.getItem('selectedGroup').id)
                    .first()
      }
    },
    clinic () {
      return Clinic.query()
                    .with('province')
                    .with('district.province')
                    .with('facilityType')
                    .where('id', SessionStorage.getItem('currClinic').id)
                    .first()
    },
    dataFetchDone () {
      return this.membersInfoLoaded
    }
  },
  components: {
    TitleBar: require('components/Shared/TitleBar.vue').default,
    groupInfo: require('components/Groups/Panel/GroupInfo.vue').default,
    groupRegister: require('components/Groups/AddEditGroup.vue').default,
    groupPack: require('components/Groups/GroupDispense.vue').default,
    groupMembers: require('components/Groups/Panel/GroupMembers.vue').default,
    groupPacks: require('components/Groups/Panel/GroupDispenses.vue').default,
    addEditPrescription: require('components/Patient/PatientPanel/AddEditPrescription.vue').default,
    Dialog: require('components/Shared/Dialog/Dialog.vue').default,
    PanelTitleBar: require('components/Groups/Panel/PanelTitleBar.vue').default
  }
}
</script>

<style lang="scss">
  .panel {
    border: 1px solid $grey-13;
    border-radius: 10px
  }
</style>
