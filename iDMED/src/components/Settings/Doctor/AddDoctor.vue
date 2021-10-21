<template>
  <q-card style="width: 900px; max-width: 90vw;" class="q-pt-lg">
        <form @submit.prevent="validateDoctor" >
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
                        <nameInput v-model="doctor.firstnames"/>
                        <lastNameInput v-model="doctor.lastname" class="q-ml-md"/>
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
                    </div>
                     <div class="row q-mt-md">
                        <q-select
                          class="col"
                          dense outlined
                          v-model="doctor.gender"
                          :options="genders"
                          label="Género" />
                     </div>
                      <div class="row q-mt-md">
                    <q-select
                     class="col" dense outlined
                      v-model="doctor.clinic"
                      use-input
                      input-debounce="0"
                      :options="clinics"
                      option-value="id"
                      option-label="clinicName"
                      label="Clinica"
                      @filter="filterClinic"/>
                      </div>
                </div>
                <div class="q-mt-lg">
                    <div class="row items-center q-mb-md">
                        <q-icon name="call" size="sm"/>
                        <span class="q-pl-sm text-subtitle2">Contacto</span>
                    </div>
                    <q-separator color="grey-13" size="1px"/>
                </div>
                <div class="row q-mt-md">
                  <PhoneField v-model="doctor.cellphone" dense label="Principal"/>
                   <emailInput v-model="doctor.email" dense class="q-ml-md" />
                </div>
            </q-card-section>
           <q-card-actions align="right" class="q-mb-md q-mr-sm">
                <q-btn label="Cancelar" color="red" @click="$emit('close')"/>
                <q-btn type="submit" label="Submeter" color="primary" />
            </q-card-actions>
             <q-dialog v-model="alert.visible">
          <Dialog :type="alert.type" @closeDialog="closeDialog">
            <template v-slot:title> Informação</template>
            <template v-slot:msg> {{alert.msg}} </template>
          </Dialog>
        </q-dialog>
        </form>
    </q-card>
</template>

<script>
import Clinic from '../../../store/models/clinic/Clinic'
import { ref } from 'vue'
import Doctor from '../../../store/models/doctor/Doctor'
const stringOptions = [
  'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
]
export default {
    props: ['clinic', 'selectedDoctor'],
    data () {
      const clinicOptions = ref(this.clinics)
        return {
           alert: ref({
              type: '',
              visible: false,
              msg: ''
            }),
            currClinic: {},
            doctor: new Doctor(),
            clinicOptions,
           dateOfBirth: '',
            createValue (val, done) {
              if (val.length > 2) {
                if (!stringOptions.includes(val)) {
                  done(val, 'add-unique')
                }
              }
            },
            genders: ['Masculino', 'Femenino'],
              filterClinic (val, update, abort) {
                const stringOptions = this.clinics
                if (val === '') {
                  update(() => {
                    this.clinicOptions = stringOptions.map(clinica => clinica)
                  })
                } else if (stringOptions.length === 0) {
                  update(() => {
                    this.clinicOptions = []
                  })
                } else {
                  update(() => {
                    this.clinicOptions = stringOptions
                      .map(clinica => clinica)
                      .filter(clinica => {
                        return clinica &&
                            clinica.designacao.toLowerCase().indexOf(val.toLowerCase()) !== -1
                      })
                  })
                }
              }
        }
    },
    methods: {
        validateDoctor () {
           // this.$refs.nome.$refs.ref.validate()
             // this.$refs.code.$refs.ref.validate()
            // if (this.$refs.nome.$refs.ref.validate() && this.$refs.code.$refs.ref.validate()) {
                this.submitDoctor()
           // }
        },
        submitDoctor () {
          this.doctor.dateofbirth = new Date(this.dateOfBirth)
            Doctor.api().post('/doctor', this.doctor).then(resp => {
                console.log(resp.response.data)
                this.displayAlert('info', 'Clinico gravado com sucesso.')
            }).catch(error => {
                this.displayAlert('error', error)
            })
        },
     async  getAllClinics (offset) {
            if (this.clinics.length <= 0) {
     await Clinic.api().get('/clinic?offset=' + offset + '&max=100').then(resp => {
                        offset = offset + 100
                        if (resp.response.data.length > 0) { setTimeout(this.getAllClinics(offset), 2) }
                    }).catch(error => {
                        console.log(error)
                    })
            }
        },
         displayAlert (type, msg) {
          this.alert.type = type
          this.alert.msg = msg
          this.alert.visible = true
        },
        closeDialog () {
          if (this.alert.type === 'info') {
            this.$emit('close')
           // SessionStorage.set('selectedPatient', this.patient)
           // this.$router.push('/patientpanel')
          }
        }
    },
    created () {
     //   this.currClinic = Object.assign({}, this.clinic)
        if (this.selectedDoctor !== '') {
          this.doctor = Object.assign({}, this.selectedDoctor)
          this.dateOfBirth = this.doctor.dateofbirth
        }
    },
    components: {
        PhoneField: require('components/Shared/Input/PhoneField.vue').default,
        nameInput: require('components/Shared/FirstNameInput.vue').default,
        lastNameInput: require('components/Shared/LastNameInput.vue').default,
        emailInput: require('components/Shared/EmailInput.vue').default,
        Dialog: require('components/Shared/Dialog/Dialog.vue').default
    },
    mounted () {
        const offset = 0
        this.clinicOptions = this.getAllClinics(offset)
    },
    computed: {
        clinics () {
            return Clinic.query()
                           .with('nationalClinic')
                           .with('province')
                           .with('district')
                          .get()
        }
    }
}
</script>

<style>

</style>
