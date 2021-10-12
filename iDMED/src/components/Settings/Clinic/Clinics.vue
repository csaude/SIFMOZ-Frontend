<template>
    <div>
        <div class="">
                  <clinicsTable  :rows="getClinicos" :columns="columns"/>
        </div>
         <div class="absolute-bottomg">
              <q-page-sticky position="bottom-right" :offset="[18, 18]">
                <q-btn size="xl" fab icon="add" @click="showClinicRegistrationScreen = true" color="primary" />
             </q-page-sticky>
        </div>
          <q-dialog persistent v-model="showClinicRegistrationScreen">
          <addClinic
            :selectedPatient="currPatient"
            :clinic="currClinic"
            @close="showClinicRegistrationScreen = false" />
      </q-dialog>
    </div>
</template>
<script>
import { useQuasar } from 'quasar'
import Clinic from '../../../store/models/clinic/Clinic'

const columns = [
  { name: 'clinicName', required: true, label: 'Nome', align: 'left', field: row => row.clinicName, format: val => `${val}`, sortable: true },
  { name: 'code', required: true, label: 'Codigo', align: 'left', field: row => row.code, format: val => `${val}`, sortable: true },
  { name: 'province', required: true, label: 'Provincia', align: 'left', field: row => row.province.description, format: val => `${val}`, sortable: true },
 { name: 'district', required: true, label: 'Districto', align: 'left', field: row => row.district.description, format: val => `${val}`, sortable: true }
]
export default {
  data () {
    const $q = useQuasar()

    return {
        columns,
        $q,
         showClinicRegistrationScreen: false
    }
  },
 computed: {
      getClinicos () {
          return Clinic.query()
                           .with('province')
                           .with('district')
                          .get()
      }
  },
  methods: {
    getClinics () {
            Clinic.api().get('/clinic')
       }
  },
  mounted () {
    this.getClinics()
  },
  components: {
     addClinic: require('components/Settings/Clinic/AddClinic.vue').default,
     clinicsTable: require('components/Settings/Clinic/ClinicsTable.vue').default
  }
}
</script>
