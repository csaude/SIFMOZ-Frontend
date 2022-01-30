<template>
  <div>
    <search
      v-if="isSearch"
      @goToPatientPanel="showSelected"/>

    <PatientPanel
      :selectedPatient="currPatient"
      v-if="isPatientDetails" />
  </div>
</template>

<script>
// import { LocalStorage } from 'quasar'
import { SessionStorage } from 'quasar'
import Patient from '../../store/models/patient/Patient'
import Clinic from '../../store/models/clinic/Clinic'
export default {
    data () {
      return {
        isSearch: true,
        isPatientDetails: false,
        currPatient: new Patient()
      }
    },
    methods: {
      showSelected (patient) {
        this.currPatient = Object.assign({}, patient)
        this.isSearch = false
        this.isPatientDetails = true
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
      },
      getAllPatientsOfClinic () {
        const offset = 0
        const max = 100
        this.doPatientGet(this.clinic.id, offset, max)
      }
    },
    mounted () {
      console.log(this.clinic)
      // this.getAllPatientsOfClinic()
    },
    computed: {
      clinic: {
        get () {
          return Clinic.query()
                    .where('id', SessionStorage.getItem('currClinic').id)
                    .first()
        }
      }
      /*
      clinic () {
        return LocalStorage.getItem('currClinic')
      }
      */
    },
    components: {
        search: require('components/Patient/Search.vue').default
    }
}
</script>

<style>

</style>
