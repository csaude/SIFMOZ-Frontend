<template>
  <q-card style="width: 900px; max-width: 90vw;" class="q-pt-lg">
        <form @submit.prevent="submitMobilizer" >
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
                              v-model="patient.dateOfBirth"
                              mask="date"
                              ref="birthDate"
                              :rules="['date']"
                              label="Data de Nascimento">
                              <template v-slot:append>
                                  <q-icon name="event" class="cursor-pointer">
                                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                      <q-date v-model="patient.dateOfBirth" >
                                      <div class="row items-center justify-end">
                                          <q-btn v-close-popup label="Close" color="primary" flat />
                                      </div>
                                      </q-date>
                                  </q-popup-proxy>
                                  </q-icon>
                              </template>
                          </q-input>
                            <numberInput v-model="patient.age" label="Idade" class="q-ml-md"/>
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
                      v-model="selectedProvince"
                      use-input
                      input-debounce="0"
                      hide-selected
                      :options="provinces"
                      option-value="id"
                      option-label="description"
                      label="Provincia"
                      @filter="filterProv"/>
                    <q-select
                      class="col q-ml-md"
                      dense outlined
                      v-model="patient.district"
                      use-input
                      input-debounce="0"
                      @new-value="createValue"
                      :options="districts"
                      @filter="filterFn"
                      label="Distrito/Cidade/Vila" />
                    <q-select class="col q-ml-md" dense outlined v-model="model" :options="options" label="Posto Administ./Distrito Urbano" />
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
    </q-card>
</template>

<script>
import Province from '../../../store/models/province/Province'
import { ref } from 'vue'
import Patient from '../../../store/models/patient/Patient'
const stringOptions = [
  'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
]
export default {
    props: ['clinic', 'selectedPatient'],
    data () {
      const provOptions = ref(this.provinces)
        return {
            currClinic: {},
            patient: new Patient(),
            provOptions,
            selectedProvince: {},
            createValue (val, done) {
              if (val.length > 2) {
                if (!stringOptions.includes(val)) {
                  done(val, 'add-unique')
                }
              }
            },
            genders: ['Masculino', 'Femenino'],
              filterFn (val, update) {
                update(() => {
                  if (val === '') {
                    this.districts.value = this.districts
                  } else {
                    const needle = val.toLowerCase()
                    this.districts.value = this.districts.filter(
                      v => v.toLowerCase().indexOf(needle) > -1
                    )
                  }
                })
              },
              filterProv (val, update, abort) {
                const stringOptions = this.provinces
                if (val === '') {
                  update(() => {
                    this.provOptions = stringOptions.map(provincia => provincia)
                  })
                } else if (stringOptions.length === 0) {
                  update(() => {
                    this.provOptions = []
                  })
                } else {
                  update(() => {
                    this.provOptions = stringOptions
                      .map(provincia => provincia)
                      .filter(provincia => {
                        return provincia &&
                            provincia.designacao.toLowerCase().indexOf(val.toLowerCase()) !== -1
                      })
                  })
                }
              }
        }
    },
    methods: {
        getAllProvinces (offset) {
            if (this.provinces.length <= 0) {
                    Province.api().get('/province?offset=' + offset + '&max=100').then(resp => {
                        offset = offset + 100
                        if (resp.response.data.length > 0) { setTimeout(this.getAllProvinces(offset), 2) }
                    }).catch(error => {
                        console.log(error)
                    })
            }
        }
    },
    created () {
        this.currClinic = Object.assign({}, this.clinic)
        if (this.selectedPatient !== '') {
          this.patient = Object.assign({}, this.selectedPatient)
        } else {
          this.patient.clinic = Object.assign({}, this.clinic)
        }
    },
    components: {
        TextInput: require('components/Shared/Input/TextField.vue').default,
        PhoneField: require('components/Shared/Input/PhoneField.vue').default,
        nameInput: require('components/Patient/Inputs/PatientNameInput.vue').default,
        middleNameInput: require('components/Patient/Inputs/PatientMiddleNameInput.vue').default,
        numberInput: require('components/Shared/Input/NumberField.vue').default,
        lastNameInput: require('components/Patient/Inputs/PatientLastNameInput.vue').default
    },
    mounted () {
        const offset = 0
        this.provOptions = this.getAllProvinces(offset)
    },
    computed: {
        provinces () {
            return Province.query().with('districts').get()
        },
        districts () {
          return this.selectedProvince.districts
        }
    }
}
</script>

<style>

</style>
