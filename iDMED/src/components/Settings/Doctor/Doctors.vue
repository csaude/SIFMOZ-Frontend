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
            <q-td key="firstnames" :props="props">
                {{ props.row.firstnames }}
            </q-td>
            <q-td key="lastname" :props="props">
                {{ props.row.lastname }}
            </q-td>
             <q-td key="telephone" :props="props">
                {{ props.row.telephone }}
            </q-td>
            <q-td key="email" :props="props">
                {{ props.row.email }}
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
                <q-btn size="xl" fab icon="add" @click="showDoctorRegistrationScreen = true" color="primary" />
             </q-page-sticky>
        </div>
          <q-dialog persistent v-model="showDoctorRegistrationScreen">
          <addDoctor
          :selectedNationalClinic="nationalClinic"
            @close="showDoctorRegistrationScreen = false" />
      </q-dialog>
    </div>
</template>
<script>
import { useQuasar } from 'quasar'
import Doctor from '../../../store/models/doctor/Doctor'

const columns = [
  { name: 'firstnames', required: true, label: 'Nome', align: 'left', field: row => row.firstnames, format: val => `${val}`, sortable: true },
  { name: 'lastname', required: true, label: 'Codigo', align: 'left', field: row => row.lastname, format: val => `${val}`, sortable: true },
   { name: 'telephone', required: true, label: 'Telefone', align: 'left', field: row => row.telephone, format: val => `${val}`, sortable: true },
  { name: 'email', required: true, label: 'Email', align: 'left', field: row => row.email, format: val => `${val}`, sortable: true },
  { name: 'options', align: 'left', label: 'Opções', sortable: false }
]
export default {
  data () {
    const $q = useQuasar()

    return {
        columns,
        $q,
         showDoctorRegistrationScreen: false
    }
  },
 computed: {
      doctors () {
          return Doctor.all()
      }
  },
  methods: {
    getDoctors () {
            Doctor.api().get('/doctor')
       },
       editDoctor (doctor) {
        this.doctor = Object.assign({}, doctor)
         this.showNationalClinicRegistrationScreen = true
      }
  },
  mounted () {
    this.getDoctors()
  },
  components: {
     addDoctor: require('components/Settings/Doctor/AddDoctor.vue').default
  //   nationalClinicsTable: require('components/Settings/NationalClinic/NationalClinicsTable.vue').default
  }
}
</script>
