<template>
  <q-card style="width: 900px; max-width: 90vw;" class="q-pt-lg">
        <form @submit.prevent="savePatient" >
            <q-card-section class="q-px-md">
                <div class="q-mt-lg">
                    <div class="row items-center q-mb-md">
                        <q-icon name="person_outline" size="sm"/>
                        <span class="q-pl-sm text-subtitle2">Dados Pessoais</span>
                    </div>
                    <q-separator color="grey-13" size="1px"/>
                </div>
                <div class="q-mt-md">
                    <div class="row">
                        <nameInput v-model="patient.firstNames"/>
                        <middleNameInput v-model="patient.middleNames" class="q-ml-md"/>
                        <lastNameInput v-model="patient.lastNames" class="q-ml-md"/>
                    </div>
                    <div class="row">
                          <q-input
                              dense
                              outlined
                              class="col"
                              v-model="dateOfBirth"
                              mask="date"
                              ref="birthDate"
                              :rules="['date']"
                              label="Data de Nascimento">
                              <template v-slot:append>
                                  <q-icon name="event" class="cursor-pointer">
                                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                      <q-date v-model="dateOfBirth" >
                                      <div class="row items-center justify-end">
                                          <q-btn v-close-popup label="Close" color="primary" flat />
                                      </div>
                                      </q-date>
                                  </q-popup-proxy>
                                  </q-icon>
                              </template>
                          </q-input>
                            <numberInput v-model="age" label="Idade" class="q-ml-md"/>
                        <q-select
                          class="col q-ml-md"
                          dense outlined
                          v-model="patient.gender"
                          :options="genders"
                          label="Género" />
                    </div>
                </div>
                <div class="q-mt-lg">
                    <div class="row items-center q-mb-md">
                        <q-icon name="house" size="sm"/>
                        <span class="q-pl-sm text-subtitle2">Endereço</span>
                    </div>
                    <q-separator color="grey-13" size="1px"/>
                </div>
                <div class="row q-mt-md">
                    <q-select
                      class="col" dense outlined
                      v-model="patient.province"
                      use-input
                      input-debounce="0"
                      :options="provinces"
                      option-value="id"
                      option-label="description"
                      label="Provincia"/>
                    <q-select
                      class="col q-ml-md"
                      dense outlined
                      v-model="patient.district"
                      option-value="id"
                      option-label="description"
                      :options="districts"
                      label="Distrito/Cidade" />
                    <q-select class="col q-ml-md" dense outlined v-model="model" :options="options" label="Posto Administivo" />
                </div>
                <div class="row q-mt-md">
                    <q-select class="col" dense outlined v-model="model" :options="options" label="Localidade/Bairro" />
                    <TextInput v-model="patient.address" label="Morada" dense class="col q-ml-md" />
                    <TextInput v-model="patient.addressReference" label="Ponto de Referência" dense class="col col q-ml-md" />
                </div>
                <div class="q-mt-lg">
                    <div class="row items-center q-mb-md">
                        <q-icon name="call" size="sm"/>
                        <span class="q-pl-sm text-subtitle2">Contacto</span>
                    </div>
                    <q-separator color="grey-13" size="1px"/>
                </div>
                <div class="row q-mt-md">
                  <PhoneField v-model="patient.cellphone" dense label="Principal"/>
                  <PhoneField v-model="patient.alternativeCellphone" dense label="Alternativo" class="q-ml-md"/>
                </div>
            </q-card-section>
           <q-card-actions align="right" class="q-mb-md q-mr-sm">
                <q-btn label="Cancelar" color="red" @click="$emit('close')"/>
                <q-btn type="submit" label="Submeter" color="primary" />
            </q-card-actions>
        </form>
        <q-dialog v-model="alert.visible">
          <Dialog :type="alert.type" @closeDialog="closeDialog">
            <template v-slot:title> Informação</template>
            <template v-slot:msg> {{alert.msg}} </template>
          </Dialog>
        </q-dialog>
    </q-card>
</template>

<script>
import Province from '../../../store/models/province/Province'
import { ref } from 'vue'
import Patient from '../../../store/models/patient/Patient'
import { SessionStorage } from 'quasar'
import Clinic from '../../../store/models/clinic/Clinic'
export default {
    props: ['clinic', 'selectedPatient'],
    data () {
        return {
            alert: ref({
              type: '',
              visible: false,
              msg: ''
            }),
            dateOfBirth: '',
            patient: new Patient(),
            selectedProvince: {},
            genders: ['Masculino', 'Femenino'],
            age: ''
        }
    },
    methods: {
        async savePatient () {
           this.patient.dateOfBirth = new Date(this.dateOfBirth)
           await Patient.apiSave(this.patient).then(resp => {
             this.patient = resp.response.data
             this.displayAlert('info', 'Paciente gravado com sucesso.')
           }).catch(error => {
             this.displayAlert('error', error)
           })
           console.log(this.patient)
        },
        displayAlert (type, msg) {
          this.alert.type = type
          this.alert.msg = msg
          this.alert.visible = true
        },
        closeDialog () {
          this.alert.visible = false
          if (this.alert.type === 'info') {
            this.$emit('close')
            SessionStorage.set('selectedPatient', this.patient)
            this.$router.push('/patientpanel')
          }
        },
        initPatient () {
          if (this.isEditStep) {
            this.patient = Patient.query().with('province')
                                          .with('district.province')
                                          .with('postoAdministrativo')
                                          .with('bairro')
                                          .with('clinic.*')
                                          .where('id', this.selectedPatient.id).first()
            this.dateOfBirth = this.patient.dateOfBirth
          } else {
            this.patient.clinic = Clinic.query().with('province').where('id', this.currClinic.id).first()
          }
        }
    },
    components: {
        TextInput: require('components/Shared/Input/TextField.vue').default,
        PhoneField: require('components/Shared/Input/PhoneField.vue').default,
        nameInput: require('components/Patient/Inputs/PatientNameInput.vue').default,
        middleNameInput: require('components/Patient/Inputs/PatientMiddleNameInput.vue').default,
        numberInput: require('components/Shared/Input/NumberField.vue').default,
        Dialog: require('components/Shared/Dialog/Dialog.vue').default,
        lastNameInput: require('components/Patient/Inputs/PatientLastNameInput.vue').default
    },
    computed: {
      provinces () {
          return Province.query().with('districts.*').get()
      },
      districts () {
        if (this.patient.province === null) return null
        return this.patient.province.districts
      },
      currClinic () {
        return new Clinic(SessionStorage.getItem('currClinic'))
      },
      isEditStep () {
        return this.selectedPatient.id !== null
      }
    },
    mounted () {
      this.initPatient()
    }
}
</script>

<style>

</style>
