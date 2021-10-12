<template>
  <div class="q-mt-lg">
    <TitleBar>Procurar ou adicionar Utentes/Pacientes</TitleBar>
    <div class="q-mx-xl">
      <div class="row">
        <q-space/>
        <q-select
          class="col-2 q-mt-md"
          dense outlined
          v-model="selectedDataSources"
          :options="dataSources"
          label="Fonte de dados" />
      </div>
      <div class="row items-center q-my-md">
          <q-icon name="person_outline" size="sm"/>
          <span class="q-pl-sm text-subtitle2">Informação inicial</span>
      </div>
      <div class="row">
          <identifierInput v-model="currPatient.identifiers[0].value"/>
          <nameInput @blur="search()" class="q-ml-md" v-model="currPatient.firstNames"/>
          <TextField label="Outros Nomes" v-model="currPatient.middleNames" dense class="col q-ml-md"/>
          <lastNameInput v-model="currPatient.lastNames" class="q-ml-md"/>
      </div>
      <div class="q-mt-lg q-mb-md">
          <div class="row items-center q-mb-md">
              <q-icon name="search" size="sm"/>
              <span class="q-pl-sm text-subtitle2">Resultado da Pesquisa</span>
          </div>
          <q-separator color="grey-13" size="1px"/>
      </div>
      <div>
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
                  {{props.row.preferedIdentifierValue()}}
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
        <div class="q-mt-md"></div>
      </div>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
          <q-btn class="q-mb-xl q-mr-xl" fab color="primary" icon="add" @click="showPatientRegister = true"/>
      </q-page-sticky>
      <q-dialog persistent v-model="showPatientRegister">
          <patientRegister
            :selectedPatient="currPatient"
            :clinic="currClinic"
            @close="showPatientRegister = false" />
      </q-dialog>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { SessionStorage } from 'quasar'
import Patient from '../../store/models/patient/Patient.js'
import PatientServiceIdentifier from '../../store/models/patientServiceIdentifier/PatientServiceIdentifier.js'
import Clinic from '../../store/models/clinic/Clinic.js'
const columns = [
  { name: 'order', required: true, label: 'Ordem', align: 'left', sortable: true },
  { name: 'identifier', align: 'left', label: 'Identificador', sortable: false },
  { name: 'name', align: 'left', label: 'Nome', sortable: false },
  { name: 'age', align: 'center', label: 'Idade', sortable: false },
  { name: 'gender', align: 'left', label: 'Género', sortable: false },
  { name: 'options', align: 'left', label: 'Opções', sortable: false }
]
export default {
    data () {
      return {
        searchField: '',
        selected: ref([]),
        columns,
        showPatientRegister: false,
        currPatient: new Patient({
          identifiers: [
            new PatientServiceIdentifier({})
          ]
        }),
        dataSources: [
          'SiDMED',
          'OpenMRS'
        ],
        selectedDataSources: 'SiDMED',
        patients: []
      }
    },
    methods: {
      init () {},
      search () {
        this.patients = Patient.query().with('identifiers|province|attributes|appointments|district|postoAdministrativo|bairro|clinic').where((patient) => {
          // if (patient.firstNames !== '') { }
          return patient.firstNames.toLowerCase().includes(this.currPatient.firstNames.toLowerCase()) || patient.middleNames.toLowerCase().includes(this.currPatient.middleNames.toLowerCase()) || patient.lastNames.toLowerCase().includes(this.currPatient.lastNames.toLowerCase())
        }).get()
      },
      editPatient (patient) {
        this.currPatient = Object.assign({}, patient)
        this.showPatientRegister = true
      },
      goToPatientPanel (selectedPatient) {
        SessionStorage.set('selectedPatient', selectedPatient)
        this.$router.push('/patientpanel')
      }
    },
    computed: {
      clinic () {
        return new Clinic(SessionStorage.getItem('currClinic'))
      }
    },
    created () {
      this.init()
    },
    components: {
        TitleBar: require('components/Shared/TitleBar.vue').default,
        patientRegister: require('components/Patient/Register/PatientRegister.vue').default,
        nameInput: require('components/Patient/Inputs/PatientNameInput.vue').default,
        identifierInput: require('components/Patient/Inputs/PatientIdentifierInput.vue').default,
        TextField: require('components/Shared/Input/TextField.vue').default,
        lastNameInput: require('components/Patient/Inputs/PatientLastNameInput.vue').default
    }
}
</script>

<style>

</style>
