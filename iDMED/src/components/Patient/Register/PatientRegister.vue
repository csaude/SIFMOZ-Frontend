<template>
  <q-card style="width: 900px; max-width: 90vw;">
        <form @submit.prevent="submitForm" >
            <q-card-section class="q-pa-none bg-green-2">
                  <div class="row items-center text-center text-subtitle1 q-pa-md">
                    <div class="col text-bold text-grey-10 q-ml-sm">{{isEditStep ? 'Actualizar' : 'Registar'}} Paciente</div>
                  </div>
                  <q-separator/>
            </q-card-section>
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
                              ref="birthDate"
                              :input="idadeCalculator()"
                              label="Data de Nascimento *">
                              <template v-slot:append>
                                  <q-icon name="event" class="cursor-pointer">
                                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                      <q-date v-model="dateOfBirth" mask="DD-MM-YYYY" >
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
                      :options="filterRedDistricts"
                      label="Distrito/Cidade *"
                      @filter="filterDistricts"
                      use-input
                      hide-selected
                      fill-input
                      input-debounce="0">
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            Sem Resultados
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                    <q-select
                      class="col q-ml-md"
                      dense outlined
                      :options="filterRedPostos"
                       v-model="patient.postoAdministrativo"
                      option-value="id"
                      option-label="description"
                      label="Posto Administivo"
                      @filter="filterPostos"
                      use-input
                      hide-selected
                      fill-input
                      input-debounce="0">
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            Sem Resultados
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                </div>
                <div class="row q-mt-md">
                    <q-select
                      class="col"
                      dense
                      outlined
                      :options="filterRedBairros"
                      v-model="patient.bairro"
                      option-value="id"
                      option-label="description"
                      label="Localidade/Bairro"
                      @filter="filterBairros"
                      use-input
                      hide-selected
                      fill-input
                      @new-value="createBairro"
                      input-debounce="0">
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            Sem Resultados
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
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
import PostoAdministrativo from '../../../store/models/PostoAdministrativo/PostoAdministrativo'
import Localidade from '../../../store/models/Localidade/Localidade'
import TransferenceService from 'src/services/Transferences/TransferenceService'
import PatientVisit from '../../../store/models/patientVisit/PatientVisit'
import Episode from 'src/store/models/episode/Episode'
import Pack from 'src/store/models/packaging/Pack'
import Prescription from 'src/store/models/prescription/Prescription'
import PatientServiceIdentifier from 'src/store/models/patientServiceIdentifier/PatientServiceIdentifier'
export default {
    props: ['clinic', 'selectedPatient', 'newPatient', 'transferencePatientData'],
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
            patient: new Patient(),
            filterRedDistricts: ref([]),
            filterRedPostos: ref([]),
            filterRedBairros: ref([])
        }
    },
    methods: {
      createBairro (val, done) {
        if (val.length > 0) {
          const bairro = new Localidade({ code: val.toUpperCase(), description: val, postoAdministrativo: this.patient.postoAdministrativo })
          if (!this.objectExistsOnArray(val, this.bairros)) {
            this.filterRedBairros.push(bairro)
          }
          done(bairro, 'toggle')
        }
      },
      objectExistsOnArray (description, array) {
        const exists = array.some((o) => {
          return o.description.toLowerCase() === description.toLowerCase()
        })
        return exists
      },
      filterPostos (val, update, abort) {
        if (val === '') {
            update(() => {
              this.filterRedPostos = this.postos
            })
            return
          }

        update(() => {
          this.filterRedPostos = this.postos.filter((f) => { return this.stringContains(f.description, val) })
        })
      },
      filterDistricts (val, update, abort) {
        if (val === '') {
            update(() => {
              this.filterRedDistricts = this.districts
            })
            return
          }

        update(() => {
          this.filterRedDistricts = this.districts.filter((f) => { return this.stringContains(f.description, val) })
        })
      },
      filterBairros (val, update, abort) {
        if (val === '') {
            update(() => {
              this.filterRedBairros = this.bairros
            })
            return
          }

        update(() => {
          this.filterRedBairros = this.bairros.filter((f) => { return this.stringContains(f.description, val) })
        })
      },
      stringContains (stringToCheck, stringText) {
          if (stringText === '') return false
          return stringToCheck.toLowerCase().includes(stringText.toLowerCase())
      },
      submitForm () {
        this.$refs.firstNames.$refs.nome.$refs.ref.validate()
        this.$refs.middleNames.$refs.midleName.$refs.ref.validate()
        this.$refs.lastNames.$refs.lastName.$refs.ref.validate()
        this.$refs.gender.validate()
        this.$refs.province.validate()
        this.$refs.district.validate()
        if (!this.$refs.firstNames.$refs.nome.$refs.ref.hasError &&
            !this.$refs.middleNames.$refs.midleName.$refs.ref.hasError &&
            !this.$refs.lastNames.$refs.lastName.$refs.ref.hasError &&
            !this.$refs.province.hasError &&
            !this.$refs.gender.hasError &&
            !this.$refs.district.hasError) {
              const dateObject = this.getJSDateFromDDMMYYY(this.dateOfBirth)
              if (dateObject > new Date()) {
                this.displayAlert('error', 'A data de nascimento indicada é maior que a data da corrente.')
              } else if (this.isEditStep && (this.patient.hasIdentifiers() && (new Date(this.patient.getOldestIdentifier().startDate) < dateObject))) {
                this.displayAlert('error', 'A data de nascimento indicada é maior que a data da admissão ao serviço se saúde [ ' + this.patient.getOldestIdentifier().service.code + ' ]')
              } else {
                this.savePatient()
              }
        }
      },
      async savePatient () {
        if (!this.newPatient) {
          this.patient.identifiers = []
        }
        if (this.patient.identifiers.length > 0 && this.patient.identifiers[0].clinic === null) {
          this.patient.identifiers = []
        }
        console.log(this.newPatient)
        console.log(this.patient)
          this.patient.dateOfBirth = this.getJSDateFromDDMMYYY(this.dateOfBirth)
          if (this.patient.bairro !== null && this.patient.bairro.id === null) {
            Localidade.apiSave(this.patient.bairro).then(resp => {
              this.patient.bairro.id = resp.response.data.id
              this.doSave()
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
          } else {
            this.doSave()
          }
      },
      async doSave () {
        console.log(this.patient)
        await Patient.apiSave(this.patient).then(resp => {
            this.patient.id = resp.response.data.id
            this.patient.$id = resp.response.data.id
            SessionStorage.set('selectedPatient', new Patient(this.patient))
             if (this.transferencePatientData !== undefined && this.transferencePatientData.length > 0) {
             const psi = TransferenceService.buildPatientIdentifierFromIdmed((this.transferencePatientData[0]))
             psi.patient = this.patient
           //  psi.patient_id = this.patient.id
            // psi.$patient_id = this.patient.$id
            psi.patient.id = resp.response.data.id
             psi.patient.$id = resp.response.data.id
              PatientServiceIdentifier.apiSave(psi).then(respPatientSI => {
             const episode = TransferenceService.buildEpisodeFromIdmed((this.transferencePatientData[0]))
             episode.patientServiceIdentifier = psi
            // episode.patientServiceIdentifier_id = respPatientSI.response.data.id
            // episode.$patientServiceIdentifier_id = respPatientSI.response.data.id
            episode.patientServiceIdentifier.id = respPatientSI.response.data.id
            episode.patientServiceIdentifier.$id = respPatientSI.response.data.id
              Episode.apiSave(episode).then(respEpi => {
              const patientVisit = TransferenceService.getPatientVisitWithDetailsPRescriptionAndPack(this.transferencePatientData[0])
       Prescription.apiSave(patientVisit.patientVisitDetails[0].prescription).then(respPres => {
         patientVisit.patientVisitDetails[0].prescription.id = respPres.response.data.id
        patientVisit.patientVisitDetails[0].prescription.$id = respPres.response.data.id
       Pack.apiSave(patientVisit.patientVisitDetails[0].pack).then(respPack => {
          patientVisit.patientVisitDetails[0].pack.id = respPack.response.data.id
        patientVisit.patientVisitDetails[0].pack.$id = respPack.response.data.id
        patientVisit.patientVisitDetails[0].episode = respEpi.response.data
        patientVisit.patientVisitDetails[0].episode.id = respEpi.response.data.id
        patientVisit.patientVisitDetails[0].episode.$id = respEpi.response.data.id
        patientVisit.patient = this.patient
        patientVisit.patient.id = resp.response.data.id
         patientVisit.patient.$id = resp.response.data.id
         PatientVisit.apiSave(patientVisit).then(resp => {
            this.displayAlert('info', 'Dados do paciente gravados com sucesso.')
            })
       })
       })
          }
          )
      })
      } else {
        this.displayAlert('info', 'Dados do paciente gravados com sucesso.')
      }
           }).catch(error => {
            this.listErrors = []
          if (error.request !== undefined && error.request.status !== 0) {
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
       if (!this.newPatient) {
          if (this.isEditStep) {
              this.patient = Patient.query().with('province')
                                        .with('district.province')
                                        .with('identifiers.*')
                                        .with('postoAdministrativo')
                                        .with('bairro')
                                        .with(['clinic.province', 'clinic.district.province', 'clinic.facilityType'])
                                        .where('id', this.selectedPatient.id).first()
              this.dateOfBirth = moment(this.patient.dateOfBirth).format('DD-MM-YYYY')
          }
        } else {
              if (this.selectedPatient === null) {
                this.patient.clinic = this.currClinic
                this.patient.province = this.currClinic.province
              } else {
                this.patient = this.selectedPatient
                if (this.patient.dateOfBirth !== '') this.dateOfBirth = moment(this.patient.dateOfBirth).format('DD-MM-YYYY')
                this.patient.clinic = this.currClinic
                this.patient.province = this.currClinic.province
              }
          }
      },
      getJSDateFromDDMMYYY (dateString) {
        const dateParts = dateString.split('-')
        return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0])
      },
      formatDate (dateString) {
        if (!dateString || !moment(dateString).isValid()) return ''
        const dateMoment = moment(dateString).format('DD-MM-YYYY')
        return dateMoment
      },
      initParams () {
        const offset = 0
        const max = 200
        Province.apiGetAll(offset, max)
        PostoAdministrativo.apiGetAll(offset, max)
        Clinic.apiFetchById(SessionStorage.getItem('currClinic').id)
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
      provinces: {
        get () {
          return Province.query().with('districts.*').has('code').get()
          }
      },
      districts: {
        get () {
          if (this.patient.province !== null && this.patient.province !== undefined) {
            return District.query().with('province').where('province_id', this.patient.province.id).has('code').get()
          } else {
            return null
          }
        }
      },
      postos: {
        get () {
          if (this.patient.district !== null && this.patient.district !== undefined) {
            return PostoAdministrativo.query().with('district.province').where('district_id', this.patient.district.id).has('code').get()
          } else {
            return null
          }
        }
      },
      bairros: {
        get () {
          if (this.patient.postoAdministrativo !== null && this.patient.postoAdministrativo !== undefined) {
            return Localidade.query().with('postoAdministrativo.district').where('postoAdministrativo_id', this.patient.postoAdministrativo.id).has('code').get()
          } else {
            return null
          }
        }
      },
      currClinic: {
        get () {
          return Clinic.query()
                      .with('province')
                      .with('district.province')
                      .with('facilityType')
                      .where('id', SessionStorage.getItem('currClinic').id)
                      .first()
        }
      },
      isEditStep () {
        return this.selectedPatient.id !== null
      }
    },
    mounted () {
      this.initParams()
      this.initPatient()
      console.log(this.transferencePatientData)
    }
}
</script>

<style>

</style>
