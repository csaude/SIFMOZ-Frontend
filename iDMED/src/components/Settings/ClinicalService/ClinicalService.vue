<template>
    <div>
     <div class="row q-py-lg q-mt-md text-weight-bold text-subtitle1">
        Servico Clinico
        </div>
        <div class="">
                 <!-- <nationalClinicsTable  :rows="getNationalClinicos" :columns="columns"  :showNationalClinicRegistrationScreen="showNationalClinicRegistrationScreen" /> -->
        <q-table
     :rows="clinicServices"
      :columns="columns"
      :filter="filter"
      virtual-scroll>
        <template v-slot:top-right>
            <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
            <template v-slot:append>
                <q-icon name="search" />
            </template>
                </q-input>
        </template>
        <template v-slot:body="props">
            <q-tr :props="props">
            <q-td key="code" :props="props">
                {{ props.row.code }}
            </q-td>
            <q-td key="description" :props="props">
                {{ props.row.description }}
            </q-td>
                  <q-td key="options" :props="props">
                  <div class="col">
                    <q-btn flat round
                    color="amber-8"
                    icon="edit"
                   @click="editClinicService(props.row)">
                    <q-tooltip class="bg-amber-5">Editar</q-tooltip>
                  </q-btn>

                  <q-btn flat round
                    class="q-ml-md"
                    color="green-8"
                    icon="search"
                    @click="goToPatientPanel(props.row)">
                    <q-tooltip class="bg-green-5">Visualizar</q-tooltip>
                  </q-btn>
                  </div>
                  </q-td>
            </q-tr>
        </template>
    </q-table>
        </div>
         <div class="absolute-bottomg">
              <q-page-sticky position="bottom-right" :offset="[18, 18]">
                <q-btn size="xl" fab icon="add" @click="addClinicService" color="primary" />
             </q-page-sticky>
        </div>
          <q-dialog persistent v-model="showClinicServiceRegistrationScreen" full-width>
          <addClinicalService
          :selectedclinicService="ClinicalService"
            @close="showClinicServiceRegistrationScreen = false" />
      </q-dialog>
    </div>
</template>
<script>
import { useQuasar } from 'quasar'
import ClinicalService from '../../../store/models/ClinicalService/ClinicalService'

const columns = [
  { name: 'code', required: true, label: 'Codigo', align: 'left', field: row => row.code, format: val => `${val}`, sortable: true },
  { name: 'description', required: true, label: 'Nome', align: 'left', field: row => row.description, format: val => `${val}`, sortable: true },
  { name: 'options', align: 'left', label: 'Opções', sortable: false }
]
export default {
  data () {
    const $q = useQuasar()

    return {
        columns,
        $q,
         showClinicServiceRegistrationScreen: false
    }
  },
 computed: {
      clinicServices () {
          return ClinicalService.query().with('attributes').get()
      }
  },
  methods: {
  async  getClinicServices () {
          await ClinicalService.api().get('/clinicalService')
       },
       editClinicService (ClinicalService) {
        this.ClinicalService = Object.assign({}, ClinicalService)
         this.showClinicServiceRegistrationScreen = true
      },
        addClinicService () {
          this.ClinicalService = new ClinicalService()
         this.showClinicServiceRegistrationScreen = true
      }
  },
  mounted () {
    this.getClinicServices()
  },
  components: {
     addClinicalService: require('components/Settings/ClinicalService/AddClinicalService.vue').default
  //   nationalClinicsTable: require('components/Settings/NationalClinic/NationalClinicsTable.vue').default
  }
}
</script>
