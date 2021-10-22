<template>
  <div class="row q-ma-xl q-pa-xl text-center">
    <div class="col">
        <q-btn icon="person_outline" round stack color="brown-9" class="q-py-md q-px-lg q-ma-xl" no-caps>
            <div class="text-center">
                Pacientes<br>Utentes
            </div>
        </q-btn>
        <q-btn icon="person_outline" round stack color="brown-9" class="q-py-md q-px-lg q-ma-xl" no-caps>
            <div class="text-center">
                Grupos<br/>&nbsp;
            </div>
        </q-btn>
        <q-btn icon="person_outline" round stack color="brown-9" class="q-py-md q-px-lg q-ma-xl" no-caps>
            <div class="text-center">
                Stock
            </div>
        </q-btn>
        <br/>
        <q-btn icon="person_outline" round stack color="brown-9" class="q-py-md q-px-lg q-ma-xl" no-caps>
            <div class="text-center">
                Administração
            </div>
        </q-btn>
        <q-btn icon="person_outline" round stack color="brown-9" class="q-py-md q-px-lg q-ma-xl" no-caps>
            <div class="text-center">
                Pacientes<br>Utentes
            </div>
        </q-btn>
        <q-btn icon="person_outline" round stack color="brown-9" class="q-py-md q-px-lg q-ma-xl" no-caps>
            <div class="text-center">
                Pacientes<br>Utentes
            </div>
        </q-btn>
    </div>
  </div>
</template>

<script>
import { SessionStorage } from 'quasar'
import Clinic from '../../store/models/clinic/Clinic'
import District from '../../store/models/district/District'
import Province from '../../store/models/province/Province'
import Patient from '../../store/models/patient/Patient'
export default {
    components: {
    },
    methods: {
      loadAppParameters () {
        Province.apiGetAll()
        District.apiGetAll()
      },
      saveCurrClinic () {
        Clinic.apiFetchById('ff8081817c7591b1017c75d9f4d4000c').then(resp => {
          SessionStorage.set('currClinic', resp.response.data)
        })
      },
      getAllPatientsOfClinic () {
        const offset = 0
        const max = 100
        this.doPatientGet(this.clinic.id, offset, max)
      },
      doPatientGet (clinicId, offset, max) {
        Patient.apiGetAllByClinicId(clinicId, offset, max).then(resp => {
              if (resp.response.data.length > 0) {
                offset = offset + max
                setTimeout(this.doPatientGet(clinicId, offset, max), 2)
              }
          }).catch(error => {
              console.log(error)
          })
      }
    },
    mounted () {
      this.loadAppParameters()
      this.getAllPatientsOfClinic()
    },
    created () {
      this.saveCurrClinic()
    },
    computed: {
      clinic () {
        return new Clinic(SessionStorage.getItem('currClinic'))
      }
    }
}
</script>

<style>

</style>
