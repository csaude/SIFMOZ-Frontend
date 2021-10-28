<template>
    <div>
    <div class="row q-py-lg q-mt-md text-weight-bold text-subtitle1">
        Sistemas Interoperando
        </div>
        <div class="">
        <q-table
          style="height: 700px"
     :rows="getHis"
      :columns="columns"
      :filter="filter"
      virtual-scroll
      row-key="index"
      v-model:pagination="pagination"
      :rows-per-page-options="[0]">
        <template v-slot:top-right>
            <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
            <template v-slot:append>
                <q-icon name="search" />
            </template>
                </q-input>
        </template>
        <template v-slot:body="props">
            <q-tr :props="props">
            <q-td auto-width>
            <q-btn size="sm" color="primary" round dense @click="props.expand = !props.expand" :icon="props.expand ? 'expand_less' : 'expand_more'" />
          </q-td>
            <q-td key="abbreviation" :props="props">
                {{ props.row.abbreviation }}
            </q-td>
            <q-td key="description" :props="props">
                {{ props.row.description }}
            </q-td>
                  <q-td key="options" :props="props">
                  <div class="col">
                    <q-btn flat round
                    color="amber-8"
                    icon="edit"
                   @click="editHealthInformationSystem(props.row)">
                    <q-tooltip class="bg-amber-5">Editar</q-tooltip>
                  </q-btn>

                  </div>
                  </q-td>
            </q-tr>
             <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
           <selectedAttributesTable  :rows="props.row.interoperabilityAttributes" :columns="columnsSelectedAttributes"   :viewMode="props.expand"/>
          </q-td>
        </q-tr>
        </template>
    </q-table>
        </div>
         <div class="absolute-bottomg">
              <q-page-sticky position="bottom-right" :offset="[18, 18]">
                <q-btn size="xl" fab icon="add" @click="showHISRegistrationScreen = true" color="primary" />
             </q-page-sticky>
        </div>
          <q-dialog persistent v-model="showHISRegistrationScreen">
          <addHIS
          :selectedHis="healthInformationSystem"
            @close="showHISRegistrationScreen = false" />
      </q-dialog>
    </div>
</template>
<script>
import { useQuasar } from 'quasar'
import HealthInformationSystem from '../../../store/models/healthInformationSystem/HealthInformationSystem'

const columns = [
   { name: '', required: true, label: '' },
  { name: 'abbreviation', required: true, label: 'Abreviatura', align: 'left', field: row => row.abbreviation, format: val => `${val}`, sortable: true },
  { name: 'description', required: true, label: 'Descricao', align: 'left', field: row => row.description, format: val => `${val}`, sortable: true },
  { name: 'options', align: 'left', label: 'Opções', sortable: false }
]

const columnInteroperabilityTypes = [
  { name: 'code', required: true, label: 'Nome', align: 'left', field: row => row.fnmCode, format: val => `${val}`, sortable: true }
]

const columnsSelectedAttributes = [
  { name: 'interoperabilityType', required: true, label: 'Nome', align: 'left', field: row => row.interoperabilityType.description, format: val => `${val}`, sortable: true },
  { name: 'value', required: true, label: 'Valor', align: 'left', field: row => row.value, format: val => `${val}`, sortable: true }
]
export default {
  data () {
    const $q = useQuasar()

    return {
        columns,
        columnInteroperabilityTypes,
        columnsSelectedAttributes,
        $q,
         showHISRegistrationScreen: false
    }
  },
 computed: {
      getHis () {
          return HealthInformationSystem.query().with('interoperabilityAttributes.interoperabilityType').get()
      }
  },
  methods: {
    getHealthInformationSystem () {
            HealthInformationSystem.api().get('/healthInformationSystem')
       },
       editHealthInformationSystem (healthInformationSystem) {
        this.healthInformationSystem = Object.assign({}, healthInformationSystem)
         this.showHISRegistrationScreen = true
      }
  },
  mounted () {
    this.getHealthInformationSystem()
  },
  components: {
     addHIS: require('components/Settings/Interoperability/AddHIS.vue').default,
      selectedAttributesTable: require('components/Settings/Interoperability/HealthInformationSystemAttributeTable.vue').default
  //   nationalClinicsTable: require('components/Settings/NationalClinic/NationalClinicsTable.vue').default
  }
}
</script>
