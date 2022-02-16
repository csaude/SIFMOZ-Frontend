<template>
  <div>
    <ListHeader
        :addVisible="true"
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
                {{getDDMMYYYFromJSDate(props.row.patient.identifiers[0].episodes[0].lastVisit().prescription.lastPackOnPrescription().pickupDate)}}
              </q-td>
              <q-td key="nextPickupDate" :props="props">
                {{getDDMMYYYFromJSDate(props.row.patient.identifiers[0].episodes[0].lastVisit().prescription.lastPackOnPrescription().nextPickUpDate)}}
              </q-td>
              <q-td key="options" :props="props">
                <div class="col">
                <q-btn flat round
                  color="blue-8"
                  icon="post_add"
                  @click="newPrescription(props.row.patient, props.row.patient.identifiers[0])">
                  <q-tooltip class="bg-blue-5">Nova Prescrição</q-tooltip>
                </q-btn>
                  <q-btn flat round
                  color="red-8"
                  icon="group_remove"
                  @click="removePatient(props.row)">
                  <q-tooltip class="bg-red-5">Remover</q-tooltip>
                </q-btn>
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </span>
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
      columns,
      fecthedMemberData: 0,
      members: ref([])
    }
  },
  methods: {
    addMember () {
      this.$emit('addNewMember')
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
                                .with('clinic').where('id', member.patient.id).first()
        member.patient.identifiers = member.patient.identifiers.filter((identifier) => {
          return identifier.service.id === this.selectedGroup.service.id
        })
        member.patient.identifiers[0].episodes = []
        member.patient.identifiers[0].episodes[0] = this.lastStartEpisodeWithPrescription(member.patient.identifiers[0].id)
        PatientVisitDetails.apiGetAllByEpisodeId(member.patient.identifiers[0].episodes[0].id, 0, 200)
        this.fecthMemberPrescriptionData(member.patient.identifiers[0].episodes[0].lastVisit())
      })
      this.members = group.members
    },
    fecthMemberPrescriptionData (visitDetails) {
      Pack.apiFetchById(visitDetails.pack.id)
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
        } else if (visit.pack.pickupDate > lastVisit.pack.pickupDate) {
          lastVisit = visit
        }
      })
      return visits
    },
    loadMembers () {
      if (this.dataFechComplete) {
        this.members.forEach((member) => {
          member.patient.identifiers[0].episodes[0].lastVisit().pack = Pack.query()
                                                                            .with('dispenseMode')
                                                                            .with('packagedDrugs')
                                                                            .where('id', member.patient.identifiers[0].episodes[0].lastVisit().pack.id)
                                                                            .first()
          const prescription = Prescription.query()
                                          .with('prescriptionDetails')
                                          .with('duration')
                                          .with('prescribedDrugs')
                                          .with('patientVisitDetails.*')
                                          .where('id', member.patient.identifiers[0].episodes[0].lastVisit().prescription.id)
                                          .first()
          prescription.patientVisitDetails = PatientVisitDetails.query().withAll().where('prescription_id', prescription.id).get()
          member.patient.identifiers[0].episodes[0].lastVisit().prescription = prescription
        })
        console.log(this.members)
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
    }
  },
  components: {
    ListHeader: require('components/Shared/ListHeader.vue').default
  }
}
</script>

<style lang="scss">
  .box-border {
    border: 1px solid $grey-4
  }
</style>
