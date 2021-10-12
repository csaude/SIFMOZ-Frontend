<template>
  <div>
    <ListHeader :addVisible="false" bgColor="bg-grey-4" >{{ curIdentifier.clinicalService.description }} </ListHeader>
    <q-card class="noRadius">
      <q-card-section class="row q-pa-none">
        <div class="col-5 bg-white q-pa-md">
          <q-table
            class="col"
            dense
            :rows="patients"
            :columns="columns"
            row-key="id"
            >
            <template #body="props">
              <q-tr :props="props">
                <q-td key="order" :props="props">
                </q-td>
                <q-td key="identifier" :props="props">
                  {{props.row.preferedIdentifier().value}}
                </q-td>
                <q-td key="name" :props="props">
                  {{props.row.fullName}}
                </q-td>
                <q-td key="age" :props="props">
                  {{props.row.age()}}
                </q-td>
                <q-td key="gender" :props="props">
                  {{props.row.gender}}
                </q-td>
                <q-td key="options" :props="props">
                  <div class="col">
                    <q-btn flat round
                    color="amber-8"
                    icon="edit"
                    @click="editPatient(props.row)">
                    <q-tooltip class="bg-amber-5">Editar</q-tooltip>
                  </q-btn>

                  <q-btn flat round
                    class="q-ml-md"
                    color="green-8"
                    icon="person_search"
                    @click="goToPatientPanel(props.row)">
                    <q-tooltip class="bg-green-5">Visualizar</q-tooltip>
                  </q-btn>
                  </div>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { SessionStorage } from 'quasar'
import Patient from '../../../store/models/patient/Patient'
import PatientServiceIdentifier from '../../../store/models/patientServiceIdentifier/PatientServiceIdentifier'
const columns = [
  { name: 'vitals', required: true, label: 'Dados Vitais', align: 'left', sortable: true },
  { name: 'tb', align: 'left', label: 'Rastreio TB', sortable: false },
  { name: 'pregnancy', align: 'left', label: 'Rastreio Gravidez', sortable: false },
  { name: 'mra', align: 'center', label: 'Monitoria e Reforço a Adesão', sortable: false },
  { name: 'gender', align: 'left', label: 'Reações Adversas', sortable: false }
]
export default {
  props: ['identifier'],
  data () {
    return {
      curIdentifier: {},
      isPatientActive: false,
      showAddEpisode: false,
      selectedEpisode: {},
      showAddEditEpisode: false
    }
  },
  components: {
    ListHeader: require('components/Shared/ListHeader.vue').default,
    EmptyList: require('components/Shared/ListEmpty.vue').default,
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
    }
  },
  computed: {
    patient () {
      return new Patient(SessionStorage.getItem('selectedPatient'))
    }
  },
  created () {
      this.curIdentifier = new PatientServiceIdentifier(this.identifier)
      this.patient = Object.assign({}, this.selectedPatient)
  }
}
</script>

<style>
  .noRadius {
    border-radius: 0px
  }
</style>
