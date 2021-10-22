<template>
    <div>
        <div class="">
                 <!-- <nationalClinicsTable  :rows="getNationalClinicos" :columns="columns"  :showNationalClinicRegistrationScreen="showNationalClinicRegistrationScreen" /> -->
        <q-table
     :rows="getNationalClinicos"
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
            <q-td key="nationalClinicName" :props="props">
                {{ props.row.facilityName }}
            </q-td>
            <q-td key="code" :props="props">
                {{ props.row.code }}
            </q-td>
             <q-td key="telephone" :props="props">
                {{ props.row.telephone }}
            </q-td>
             <q-td key="facilityType" :props="props">
                {{ props.row.facilityType.description }}
            </q-td>
            <q-td key="province" :props="props">
                {{ props.row.province.description }}
            </q-td>
                  <q-td key="options" :props="props">
                  <div class="col">
                    <q-btn flat round
                    color="amber-8"
                    icon="edit"
                   @click="editNationalClinic(props.row)">
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
                <q-btn size="xl" fab icon="add" @click="showNationalClinicRegistrationScreen = true" color="primary" />
             </q-page-sticky>
        </div>
          <q-dialog persistent v-model="showNationalClinicRegistrationScreen">
          <addNationalClinic
          :selectedNationalClinic="nationalClinic"
            @close="showNationalClinicRegistrationScreen = false" />
      </q-dialog>
    </div>
</template>
<script>
import { useQuasar } from 'quasar'
import NationalClinic from '../../../store/models/nationalClinic/NationalClinic'

const columns = [
  { name: 'nationalClinicName', required: true, label: 'Nome', align: 'left', field: row => row.clinicName, format: val => `${val}`, sortable: true },
  { name: 'code', required: true, label: 'Codigo', align: 'left', field: row => row.code, format: val => `${val}`, sortable: true },
   { name: 'telephone', required: true, label: 'Telefone', align: 'left', field: row => row.telephone, format: val => `${val}`, sortable: true },
   { name: 'facilityType', required: true, label: 'Tipo de Instalacao', align: 'left', field: row => row.facilityType.description, format: val => `${val}`, sortable: true },
  { name: 'province', required: true, label: 'Provincia', align: 'left', field: row => row.province.description, format: val => `${val}`, sortable: true },
  { name: 'options', align: 'left', label: 'Opções', sortable: false }
]
export default {
  data () {
    const $q = useQuasar()

    return {
        columns,
        $q,
         showNationalClinicRegistrationScreen: false
    }
  },
 computed: {
      getNationalClinicos () {
          return NationalClinic.query()
                           .with('province')
                           .with('facilityType')
                          .get()
      }
  },
  methods: {
    getNationalClinics () {
            NationalClinic.api().get('/nationalClinic')
       },
       editNationalClinic (nationalClinic) {
        this.nationalClinic = Object.assign({}, nationalClinic)
         this.showNationalClinicRegistrationScreen = true
      }
  },
  mounted () {
    this.getNationalClinics()
  },
  components: {
     addNationalClinic: require('components/Settings/NationalClinic/AddNationalClinic.vue').default
  //   nationalClinicsTable: require('components/Settings/NationalClinic/NationalClinicsTable.vue').default
  }
}
</script>
