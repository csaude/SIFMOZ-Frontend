<template>
  <q-card style="width: 900px; max-width: 90vw;" class="q-pt-lg">
        <form @submit.prevent="submitForm" >
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
                        <nameInput ref="firstNames" v-model="patient.firstNames"/>
                        <middleNameInput ref="middleNames" v-model="patient.middleNames" class="q-ml-md"/>
                        <lastNameInput ref="lastNames" v-model="patient.lastNames" class="q-ml-md"/>
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
                              :input="idadeCalculator()"
                              label="Data de Nascimento *">
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
                            <numberInput v-model="age" label="Idade" class="q-ml-md" readonly/>
                        <q-select
                          class="col q-ml-md"
                          dense outlined
                          ref="gender"
                          :rules="[ val => !!val || 'Por favor indicar o sexo']"
                          v-model="patient.gender"
                          :options="genders"
                          label="Sexo *" />
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
                      ref="province"
                      :rules="[ val => !!val || 'Por favor indicar a Província']"
                      input-debounce="0"
                      :options="provinces"
                      option-value="id"
                      option-label="description"
                      label="Provincia *"/>
                    <q-select
                      class="col q-ml-md"
                      dense outlined
                      v-model="patient.district"
                      option-value="id"
                      option-label="description"
                      ref="district"
                      :rules="[ val => !!val || 'Por favor indicar o Distrito']"
                      :options="districts"
                      label="Distrito/Cidade *" />
                    <q-select
                      class="col q-ml-md"
                      dense outlined
                       v-model="patient.postoAdministrativo"
                      option-value="id"
                      option-label="description"
                      :options="postosAdministrativos"
                      label="Posto Administivo" />
                </div>
                <div class="row q-mt-md">
                    <q-select
                      class="col"
                      dense
                      outlined
                      v-model="patient.bairro"
                      :options="bairros"
                      label="Localidade/Bairro" />
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
import District from '../../../store/models/district/District'
import moment from 'moment'
export default {
    props: ['clinic', 'selectedPatient', 'newPatient'],
    emits: ['update:newPatient'],
    data () {
        return {
            alert: ref({
              type: '',
              visible: false,
              msg: ''
            }),
            dateOfBirth: '',
            selectedProvince: {},
            genders: ['Masculino', 'Feminino'],
            age: '',
            patient: new Patient()
        }
    },
    methods: {
      submitForm () {
        this.$refs.firstNames.$refs.nome.$refs.ref.validate()
        this.$refs.middleNames.$refs.midleName.$refs.ref.validate()
        this.$refs.lastNames.$refs.lastName.$refs.ref.validate()
        this.$refs.birthDate.validate()
        this.$refs.gender.validate()
        this.$refs.province.validate()
        this.$refs.district.validate()
        if (!this.$refs.firstNames.$refs.nome.$refs.ref.hasError &&
            !this.$refs.middleNames.$refs.midleName.$refs.ref.hasError &&
            !this.$refs.lastNames.$refs.lastName.$refs.ref.hasError &&
            !this.$refs.birthDate.hasError &&
            !this.$refs.province.hasError &&
            !this.$refs.gender.hasError &&
            !this.$refs.district.hasError) {
              if (new Date(this.dateOfBirth) > new Date()) {
                this.displayAlert('error', 'A data de nascimento indicada é maior que a data da corrente.')
              } else if (this.isEditStep && (this.patient.hasIdentifiers() && (new Date(this.patient.getOldestIdentifier().startDate) < new Date(this.dateOfBirth)))) {
                this.displayAlert('error', 'A data de nascimento indicada é maior que a data da admissão ao serviço se saúde [ ' + this.patient.getOldestIdentifier().service.code + ' ]')
              } else {
                this.savePatient()
              }
        }
      },
      async savePatient () {
        console.log(this.patient.hasIdentifiers)
        if (this.patient.hasIdentifiers) {
            if (this.patient.identifiers[0] === null) {
              this.patient.identifiers = []
            } else {
                if (this.patient.identifiers[0].id === null) {
                  this.patient.identifiers = []
                }
            }
        }
          this.patient.dateOfBirth = new Date(this.dateOfBirth)
          await Patient.apiSave(this.patient).then(resp => {
            this.patient.id = resp.response.data.id
            this.patient.$id = resp.response.data.id
            SessionStorage.set('selectedPatient', new Patient(this.patient))
            this.displayAlert('info', 'Dados do paciente gravados com sucesso.')
          }).catch(error => {
            this.listErrors = []
          if (error.request.status !== 0) {
            const arrayErrors = JSON.parse(error.request.response)
            if (arrayErrors.total == null) {
              this.listErrors.push(arrayErrors.message)
            } else {
              arrayErrors._embedded.errors.forEach(element => {
                this.listErrors.push(element.message)
              })
            }
          }
            this.displayAlert('error', this.listErrors)
          })
      },
      displayAlert (type, msg) {
        this.alert.type = type
        this.alert.msg = msg
        this.alert.visible = true
      },
      closeDialog () {
        this.alert.visible = false
        if (this.alert.type === 'info' && this.newPatient) {
          this.$emit('update:newPatient', false)
          this.$emit('close')
          this.$router.push('/patientpanel')
        } else if (this.alert.type === 'info' && this.isEditStep) {
          this.$emit('update:newPatient', false)
          this.$emit('close')
        }
      },
      initPatient () {
       if (this.newPatient === false) {
          if (this.isEditStep) {
              this.patient = Patient.query().with('province')
                                        .with('district.province')
                                        .with('identifiers.*')
                                        .with('postoAdministrativo')
                                        .with('bairro')
                                        .with('clinic.*')
                                        .where('id', this.selectedPatient.id).first()
              this.dateOfBirth = this.patient.dateOfBirth
          }
        } else {
              if (this.selectedPatient === null) {
                this.patient.clinic = this.currClinic
                this.patient.province = this.currClinic.province
              } else {
                this.patient = this.selectedPatient
                this.dateOfBirth = this.patient.dateOfBirth
                this.patient.clinic = this.currClinic
              }
          }
      },
      moment,
        idadeCalculator () {
            if (this.dateOfBirth && moment(this.dateOfBirth).isValid()) {
                const utentBirthDate = moment(this.dateOfBirth)
                const todayDate = moment(new Date())
                const idade = todayDate.diff(utentBirthDate, 'years')
                this.age = idade
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
          return Province.query().with('districts.*').has('code').get()
      },
      districts () {
        if (this.patient.province !== null && this.patient.province !== undefined) {
          return District.query().with('province').where('province_id', this.patient.province.id).has('code').get()
        } else {
          return null
        }
      },
      currClinic () {
        return Clinic.query()
                    .with('province')
                    .where('id', SessionStorage.getItem('currClinic').id)
                    .first()
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
