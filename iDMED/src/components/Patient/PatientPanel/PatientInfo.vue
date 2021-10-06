<template>
  <div>
      <div class="text-center">
            <q-icon class="profile" :name="patient.gender == 'Femenino' ? 'female' : 'male'" size="120px" color="primary"/>
        </div>
      <div class="q-mt-md">
          <div class="row items-center q-mb-sm">
              <span class="text-subtitle2">Dados Pessoais</span>
          </div>
          <q-separator color="grey-13" size="1px" class="q-mb-sm"/>
      </div>
      <div class="row q-mb-sm">
        <div class="col-5 text-grey-9">Nome</div>
        <div class="col text-grey-10">{{patient.fullName}}</div>
      </div>
      <div class="row q-mb-sm">
        <div class="col-5 text-grey-9">Idade</div>
        <div class="col text-grey-10">{{patient.age()}} Anos</div>
      </div>
      <div class="row q-mb-sm">
        <div class="col-5 text-grey-9">Gênero</div>
        <div class="col text-grey-10">{{patient.gender}}</div>
      </div>

      <div class="q-mt-md">
            <div class="row items-center q-mb-sm">
                <span class="text-subtitle2">Endereço</span>
            </div>
            <q-separator color="grey-13" size="1px" class="q-mb-sm"/>
        </div>
        <div class="row q-mb-sm">
          <div class="col-5 text-grey-9">Província</div>
          <div class="col text-grey-10">Maputo Provincia</div>
        </div>
        <div class="row q-mb-sm">
          <div class="col-5 text-grey-9">Distrito</div>
          <div class="col text-grey-10">Boane</div>
        </div>
        <div class="row q-mb-sm">
          <div class="col-5 text-grey-9">Posto Administrativo</div>
          <div class="col text-grey-10">Vila de Boane</div>
        </div>
        <div class="row q-mb-sm">
          <div class="col-5 text-grey-9">Bairro</div>
          <div class="col text-grey-10">Massaca 1</div>
        </div>
        <div class="row q-mb-sm">
          <div class="col-5 text-grey-9">Local Referência</div>
          <div class="col text-grey-10">{{patient.addressReference}}</div>
        </div>
        <div class="row q-mb-sm">
          <div class="col-5 text-grey-9">Morada</div>
          <div class="col text-grey-10">{{patient.address}}</div>
        </div>

        <div class="q-mt-md">
            <div class="row items-center q-mb-sm">
                <span class="text-subtitle2">Contacto</span>
            </div>
            <q-separator color="grey-13" size="1px" class="q-mb-sm"/>
        </div>
        <div class="row q-mb-sm">
          <div class="col-5 text-grey-9">Principal</div>
          <div class="col text-grey-10">{{patient.cellphone}}</div>
        </div>
        <div class="row q-mb-sm">
          <div class="col-5 text-grey-9">Alternativo</div>
          <div class="col text-grey-10">{{patient.alternativeCellphone}}</div>
        </div>
        <div class="row q-my-md">
          <q-btn unelevated color="orange-5" label="Editar" class="col" @click="editPatient()"/>
        </div>
        <div class="row">
          <q-btn unelevated color="primary" label="Unir Duplicados" class="col" />
        </div>
        <q-dialog persistent v-model="showPatientRegister">
          <patientRegister
            :selectedPatient="patient"
            :clinic="currClinic"
            @close="showPatientRegister = false" />
        </q-dialog>
</div>
</template>

<script>
import Patient from '../../../store/models/patient/Patient'
import { SessionStorage } from 'quasar'
export default {
  data () {
    return {
      showPatientRegister: false
    }
  },
  methods: {
    editPatient (patient) {
      this.showPatientRegister = true
    }
  },
  computed: {
    patient () {
        return new Patient(SessionStorage.getItem('selectedPatient'))
      }
  },
  created () {
        this.patient = Object.assign({}, this.selectedPatient)
  },
  components: {
    patientRegister: require('components/Patient/Register/PatientRegister.vue').default
  }

}
</script>

<style lang="scss">
  .profile {
    border: 1px solid $grey-4;
    border-radius: 10px
  }
</style>
