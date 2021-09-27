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
          <nameInput class="q-ml-md" v-model="currPatient.firstNames"/>
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
import Patient from '../../store/models/patient/Patient.js'
import PatientServiceIdentifier from '../../store/models/patientServiceIdentifier/PatientServiceIdentifier.js'
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
        patients: [
          new Patient({
            id: 'fa84b596-1c7f-11ec-9621-0242ac130002',
            clinic: {},
            firstNames: 'Jose',
            middleNames: 'Antonio',
            lastNames: 'Silva',
            dateOfBirth: '2001/09/30',
            gender: 'Masculino',
            cellphone: '856326987',
            alternativeCellphone: '826532985',
            address: 'Q.12, Rua 12, Casa 4',
            addressReference: 'Substação',
            identifiers: [
              new PatientServiceIdentifier({
                id: 'da9e9288-1c7f-11ec-9621-0242ac130002',
                startDate: '30/05/2020',
                value: '0120010101/0203/00365',
                prefered: false
              }),
              new PatientServiceIdentifier({
                id: '9c4b5036-1c87-11ec-9621-0242ac130002',
                startDate: '30/05/2020',
                value: '0120010101/0203/55555',
                prefered: true
              })
            ]
          }),
          new Patient({
            id: 'f18979d6-1c7f-11ec-9621-0242ac130002',
            clinic: {},
            firstNames: 'Sandra',
            middleNames: 'Felismina',
            lastNames: 'Santos',
            dateOfBirth: '2003/09/30',
            gender: 'Femenino',
            cellphone: '856326987',
            alternativeCellphone: '826532985',
            address: 'Q.12, Rua 12, Casa 4',
            addressReference: 'Substação',
            identifiers: [
              new PatientServiceIdentifier({
                id: 'e78d3c60-1c7f-11ec-9621-0242ac130002',
                startDate: '30/05/2020',
                value: '0120000101/0222/00332',
                prefered: true
              })
            ]
          })
        ]
      }
    },
    methods: {
      search () {
      },
      editPatient (patient) {
        this.currPatient = Object.assign({}, patient)
        this.showPatientRegister = true
      },
      goToPatientPanel (selectedPatient) {
        this.$emit('goToPatientPanel', selectedPatient)
      }
    },
    components: {
        TitleBar: require('components/Shared/TitleBar.vue').default,
        patientRegister: require('components/Patient/PatientRegister.vue').default,
        nameInput: require('components/Patient/Inputs/PatientNameInput.vue').default,
        identifierInput: require('components/Patient/Inputs/PatientIdentifierInput.vue').default,
        TextField: require('components/Shared/Input/TextField.vue').default,
        lastNameInput: require('components/Patient/Inputs/PatientLastNameInput.vue').default
    }
}
</script>

<style>

</style>
