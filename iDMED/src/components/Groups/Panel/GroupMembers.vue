<template>
  <div>
    <ListHeader
        :addVisible="!selectedGroup.isDesintegrated()"
        :mainContainer="true"
        @showAdd="addMember"
        bgColor="bg-primary">Membros do Grupo
      </ListHeader>
    <span v-if="dataFechComplete && loadedMembers.length > 0">
      <div class="q-mb-md box-border">
        <q-table
          class="col"
          dense
          flat
          :rows="loadedMembers"
          :columns="columns"
          row-key="id"
          >
          <template v-slot:no-data="{ icon, filter }">
            <div class="full-width row flex-center text-primary q-gutter-sm text-body2">
              <span>
                Nenhum Paciente adicionado
              </span>
              <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
            </div>
          </template>
          <template #body="props">
            <q-tr :props="props">
              <!--q-td key="order" :props="props">
              </q-td-->
              <q-td key="id" :props="props">
                {{props.row.patient.preferedIdentifier().value}}
              </q-td>
              <q-td key="name" :props="props">
                {{props.row.patient.fullName}}
              </q-td>
              <q-td key="lasPrescriptionDate" :props="props">
                {{getDDMMYYYFromJSDate(props.row.patient.identifiers[0].episodes[0].lastVisit().prescription.prescriptionDate)}}
              </q-td>
              <q-td key="remainingTime" :props="props">
                {{props.row.patient.identifiers[0].episodes[0].lastVisit().prescription.remainigDuration()}} mes(es)
              </q-td>
              <q-td key="lastDispenseDate" :props="props">
                {{
                  props.row.patient.identifiers[0].episodes[0].lastVisit().prescription.lastPackOnPrescription() !== null ?
                  getDDMMYYYFromJSDate(props.row.patient.identifiers[0].episodes[0].lastVisit().prescription.lastPackOnPrescription().pickupDate)
                  :
                  '-'
                  }}
              </q-td>
              <q-td key="nextPickupDate" :props="props">
                {{
                  props.row.patient.identifiers[0].episodes[0].lastVisit().prescription.lastPackOnPrescription() !== null ?
                  getDDMMYYYFromJSDate(props.row.patient.identifiers[0].episodes[0].lastVisit().prescription.lastPackOnPrescription().nextPickUpDate)
                  :
                  '-'
                  }}
              </q-td>
              <q-td key="options" :props="props">
                <div class="col">
                <q-btn flat round
                  color="blue-8"
                  :disable="selectedGroup.isDesintegrated()"
                  icon="post_add"
                  @click="newPrescription(props.row.patient, props.row.patient.identifiers[0])">
                  <q-tooltip class="bg-blue-5">Nova Prescrição</q-tooltip>
                </q-btn>
                  <q-btn flat round
                  color="red-8"
                  :disable="selectedGroup.isDesintegrated()"
                  icon="group_remove"
                  @click="removeMember(props.row)">
                  <q-tooltip class="bg-red-5">Remover do Grupo</q-tooltip>
                </q-btn>
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </span>
    <q-dialog v-model="alert.visible" persistent>
      <Dialog :type="alert.type" @cancelOperation="cancelOperation" @closeDialog="closeDialog" @commitOperation="doOnConfirm">
        <template v-slot:title> {{dialogTitle}}</template>
        <template v-slot:msg> {{alert.msg}} </template>
      </Dialog>
    </q-dialog>
  </div>
</template>

<script>
import { ref } from 'vue'
import Group from '../../../store/models/group/Group'
import { SessionStorage } from 'quasar'
import Episode from '../../../store/models/episode/Episode'
import Patient from '../../../store/models/patient/Patient'
import Pack from '../../../store/models/packaging/Pack'
import Prescription from '../../../store/models/prescription/Prescription'
import moment from 'moment'
import PatientVisitDetails from '../../../store/models/patientVisitDetails/PatientVisitDetails'
import GroupMember from '../../../store/models/groupMember/GroupMember'
import Clinic from '../../../store/models/clinic/Clinic'
const columns = [
  { name: 'id', align: 'left', label: 'Identificador', sortable: false },
  { name: 'name', align: 'left', label: 'Nome', sortable: false },
  { name: 'lasPrescriptionDate', align: 'left', label: 'Data da Última Prescrição', sortable: false },
  { name: 'remainingTime', align: 'left', label: 'Validade', sortable: false },
  { name: 'lastDispenseDate', align: 'left', label: 'Data da Última Dispensa', sortable: false },
  { name: 'nextPickupDate', align: 'left', label: 'Data do Próximo Levantamento', sortable: false },
  { name: 'options', align: 'left', label: 'Opções', sortable: false }
]
export default {
  data () {
    return {
      alert: ref({
        type: '',
        visible: false,
        msg: ''
      }),
      columns,
      fecthedMemberData: 0,
      members: ref([]),
      allMembers: ref([]),
      dialogTitle: 'Informação',
      selectedMember: null,
      step: 'display'
    }
  },
  methods: {
    addMember () {
      this.$emit('addNewMember')
    },
    removeMember (member) {
      this.selectedMember = member
      this.dialogTitle = 'Confirmação da remoção do membro.'
      if (this.members.length === 1) {
        this.step = 'desintagrate'
        this.displayAlert('confirmation', 'Nota: Ao remover este membro o grupo será desintegrado. Continuar?')
      } else {
        this.step = 'memberRemotion'
        this.displayAlert('confirmation', 'Confirma a remoção do membro [' + member.patient.fullName + '], deste grupo?')
      }
    },
    doOnConfirm () {
      this.alert.visible = false
      if (this.isGroupDesintagrationStep) {
        this.$emit('desintagrateGroup')
      } else if (this.isMemberRemotionStep) {
        this.doMemberRemotion()
      }
    },
    cancelOperation () {
      this.step = 'display'
      this.alert.visible = false
    },
    doMemberRemotion () {
      this.selectedMember.endDate = new Date()
      const member = Object.assign({}, this.selectedMember)
      member.patient = Patient.query()
                              .with(['clinic.province', 'clinic.district.province', 'clinic.facilityType'])
                              .with('province')
                              .with('district.province')
                              .where('id', member.patient.id)
                              .first()
      member.group = Group.query()
                          .with(['clinic.province', 'clinic.district.province', 'clinic.facilityType'])
                          .where('id', member.group_id)
                          .first()
      member.clinic = Clinic.query()
                            .with('province')
                            .with('district.province')
                            .with('facilityType')
                            .where('id', member.clinic_id)
                            .first()
      GroupMember.apiUpdate(member).then(resp => {
        this.getGroupMembers()
        this.displayAlert('info', 'Operação efectuada com sucesso.')
      })
    },
    newPrescription (patient, identifier) {
      this.$emit('newPrescription', patient, identifier)
    },
    getJSDateFromDDMMYYY (dateString) {
      const dateParts = dateString.split('-')
      return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0])
    },
    getDDMMYYYFromJSDate (jsDate) {
      return moment(jsDate).format('DD-MM-YYYY')
    },
    getGroupMembers () {
      const group = Group.query()
                        .with('service')
                        .with('members.patient.identifiers.identifierType')
                        .with('groupType')
                        .where('id', SessionStorage.getItem('selectedGroup').id)
                        .first()
      group.members.forEach((member) => {
          member.patient = Patient.query().with(['identifiers.identifierType', 'identifiers.service.identifierType'])
                                  .with('province')
                                  .with(['clinic.province', 'clinic.district.province', 'clinic.facilityType'])
                                  .where('id', member.patient.id)
                                  .first()
          member.patient.identifiers = member.patient.identifiers.filter((identifier) => {
            return identifier.service.id === this.selectedGroup.service.id
          })
          member.patient.identifiers[0].episodes = []
          member.patient.identifiers[0].episodes[0] = this.lastStartEpisodeWithPrescription(member.patient.identifiers[0].id)
         this.fecthMemberPrescriptionData(member.patient.identifiers[0].episodes[0].lastVisit())
      })
      this.allMembers = group.members
      if (!group.isDesintegrated()) {
        this.members = group.members.filter((member) => { return member.isActive() })
      } else {
        this.members = group.members
      }
    },
    fecthMemberPrescriptionData (visitDetails) {
      if (visitDetails.pack !== null) Pack.apiFetchById(visitDetails.pack.id)
      Prescription.apiFetchById(visitDetails.prescription.id).then(resp => {
        this.fecthedMemberData = this.fecthedMemberData + 1
      })
    },
    getAllVisitsOfPrescription (prescription) {
      const visits = PatientVisitDetails.query().withAll().where('prescription_id', prescription.id).get()
      let lastVisit = null

      visits.forEach((visit) => {
        if (lastVisit === null) {
          lastVisit = visit
        } else if (visit.pack !== null && visit.pack.pickupDate > lastVisit.pack.pickupDate) {
          lastVisit = visit
        }
      })
      return visits
    },
    loadMembers () {
      if (this.dataFechComplete) {
        if (this.selectedGroup.isDesintegrated()) {
          this.members = this.allMembers
        }
        this.members.forEach((member) => {
          if (member.patient.identifiers[0].episodes[0].lastVisit().pack !== null) {
            member.patient.identifiers[0].episodes[0].lastVisit().pack = Pack.query()
                                                                              .with('dispenseMode')
                                                                              .with('packagedDrugs')
                                                                              .where('id', member.patient.identifiers[0].episodes[0].lastVisit().pack.id)
                                                                              .first()
          }
          const prescription = Prescription.query()
                                          .with('prescriptionDetails')
                                          .with('duration')
                                          .with('prescribedDrugs.drug.form')
                                          .with('doctor')
                                          .with('patientVisitDetails.*')
                                          .where('id', member.patient.identifiers[0].episodes[0].lastVisit().prescription.id)
                                          .first()
          prescription.patientVisitDetails = PatientVisitDetails.query().withAll().where('prescription_id', prescription.id).get()
          member.patient.identifiers[0].episodes[0].lastVisit().prescription = prescription
        })
        return this.members
      } else {
        return []
      }
    },
    lastStartEpisodeWithPrescription (identifierId) {
      let episode = null
      const episodes = Episode.query()
                              .with('startStopReason')
                              .with('clinicSector')
                              .with('patientServiceIdentifier')
                              .with('patientVisitDetails.*')
                              .has('patientVisitDetails')
                              .whereHas('episodeType', (query) => {
                                    query.where('code', 'INICIO')
                                  })
                              .where('patientServiceIdentifier_id', identifierId)
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
    displayAlert (type, msg) {
      this.alert.type = type
      this.alert.msg = msg
      this.alert.visible = true
    },
    closeDialog () {
      this.alert.visible = false
    }
  },
  mounted () {
    this.getGroupMembers()
  },
  computed: {
    selectedGroup: {
      get () {
        return Group.query().with('service').with('members.patient.identifiers.identifierType').where('id', SessionStorage.getItem('selectedGroup').id).first()
      }
    },
    dataFechComplete () {
      return this.fecthedMemberData >= this.selectedGroup.members.length
    },
    loadedMembers: {
      get () {
        return this.loadMembers()
      }
    },
    isGroupDesintagrationStep () {
      return this.step === 'desintagrate'
    },
    isMemberRemotionStep () {
      return this.step === 'memberRemotion'
    },
    isDisplayStep () {
      return this.step === 'display'
    }
  },
  components: {
    ListHeader: require('components/Shared/ListHeader.vue').default,
    Dialog: require('components/Shared/Dialog/Dialog.vue').default
  }
}
</script>

<style lang="scss">
  .box-border {
    border: 1px solid $grey-4
  }
</style>
