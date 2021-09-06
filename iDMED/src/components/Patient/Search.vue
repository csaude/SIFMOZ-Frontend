<template>
  <div class="q-mx-xl q-mt-lg q-px-lg">
    <div class="row items-center q-mb-md">
        <q-icon name="person_outline" size="sm"/>
        <span class="q-pl-sm text-subtitle2">Informação inicial</span>
    </div>
    <div class="row">
        <identifierInput/>
        <nameInput class="q-ml-md"/>
        <lastNameInput class="q-ml-md"/>
        <q-select class="col q-ml-md" dense outlined v-model="model" :options="options" label="Outros Sistemas" />
    </div>
    <div class="q-mt-lg">
        <div class="row items-center q-mb-md">
            <q-icon name="search" size="sm"/>
            <span class="q-pl-sm text-subtitle2">Resultado da Pesquisa</span>
        </div>
        <q-separator color="grey-13" size="1px"/>
    </div>
    <div>
        <q-table
            class="col"
            :rows="mobilizers"
            :columns="columns"
            row-key="name"
            v-model:selected="selected"
            >
        </q-table>
    </div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn class="q-mb-xl q-mr-xl" fab color="primary" icon="add" @click="showPatientRegister = true"/>
    </q-page-sticky>
    <q-dialog v-model="showPatientRegister">
        <patientRegister :clinic="currClinic" @close="showPatientRegister = false" />
    </q-dialog>
  </div>
</template>

<script>
import { ref } from 'vue'
const columns = [
  {
    name: 'name',
    required: true,
    label: 'Ordem',
    align: 'left',
    field: row => row.fullName,
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'identifier',
    field: row => row.contacts,
    format: val => `${val}`,
    align: 'center',
    label: 'Identificador',
    sortable: false
    },
  {
    name: 'name',
    field: row => row.contacts,
    format: val => `${val}`,
    align: 'center',
    label: 'Nome',
    sortable: false
    },
  {
    name: 'age',
    field: row => row.contacts,
    format: val => `${val}`,
    align: 'center',
    label: 'Idade',
    sortable: false
    },
  {
    name: 'gender',
    field: row => row.contacts,
    format: val => `${val}`,
    align: 'center',
    label: 'Género',
    sortable: false
    },
  {
    name: 'options',
    align: 'center',
    label: 'Opções',
    sortable: false
    }
]
export default {
    data () {
        return {
            searchField: '',
            selected: ref([]),
            columns,
            showPatientRegister: true
        }
    },
    components: {
        patientRegister: require('components/Patient/PatientRegister.vue').default,
        nameInput: require('components/Patient/Inputs/PatientNameInput.vue').default,
        identifierInput: require('components/Patient/Inputs/PatientIdentifierInput.vue').default,
        lastNameInput: require('components/Patient/Inputs/PatientLastNameInput.vue').default
    }
}
</script>

<style>

</style>
