<template>
<q-card style="width: 900px; max-width: 90vw;" class="q-pt-lg">
  <div class="row q-py-lg q-mt-md text-weight-bold text-subtitle1">
         Cadastrar Clinica Nacional
        </div>
        <form @submit.prevent="validateNationalClinic" >
            <q-card-section class="q-px-md">
               <div class="row q-mt-md">
                <nameInput
                    ref="nome"
                    v-model="nationalClinic.facilityName"
                    label="Nome da Clinica" />
            </div>
              <div class="row q-mt-md">
                <codeInput
                    ref="code"
                    v-model="nationalClinic.code"
                    :rules="[ val => !this.databaseCodes.includes(val) || 'o Codigo indicado ja existe']"
                    lazy-rules
                    label="Codigo" />
            </div>
              <div class="row q-mb-md">
                <q-select
                    class="col"
                    dense outlined
                     transition-show="flip-up"
                    transition-hide="flip-down"
                    v-model="nationalClinic.facilityType"
                    :options="facilityTypes"
                    ref="facilityType"
                    option-value="id"
                    option-label="description"
                    :rules="[ val => ( val != null) || ' Por favor indique o tipo de instalação']"
                    lazy-rules
                    label="Tipo de instalação" />
            </div>
             <div class="row q-mb-md">
                <q-select
                    dense outlined
                    class="col"
                    v-model="nationalClinic.province"
                    :options="provinces"
                    transition-show="flip-up"
                    transition-hide="flip-down"
                    ref="province"
                    option-value="id"
                    option-label="description"
                    :rules="[ val => ( val != null ) || ' Por favor indique a província']"
                    lazy-rules
                    label="Província" />
            </div>
            <div class="row q-mt-md">
                  <PhoneField v-model="nationalClinic.telephone" dense label="Numero de Telefone"/>
                </div>
            </q-card-section>
           <q-card-actions align="right" class="q-mb-md">
              <q-btn label="Cancelar" color="red" @click="$emit('close')"/>
                <q-btn type="submit" label="Submeter" color="primary"/>
            </q-card-actions>
        </form>
        <pre>{{nationalClinic}}</pre>
    </q-card>
</template>

<script>
import NationalClinic from '../../../store/models/nationalClinic/NationalClinic'
import Province from 'src/store/models/province/Province'
import FacilityType from '../../../store/models/facilityType/FacilityType'

export default {
      props: ['selectedNationalClinic'],
    data () {
        return {
            databaseCodes: [],
           nationalClinic: new NationalClinic(),
            clinico: ''
        }
    },
    created () {
       //  this.nationalClinic = Object.assign({}, this.nationalClinic)
        if (this.selectedNationalClinic !== '') {
          this.nationalClinic = Object.assign({}, this.selectedNationalClinic)
        } else {
          this.nationalClinic.facilityType = Object.assign({}, this.facilityType)
        }
    },
      mounted () {
        const provinceOffset = 0
        const facilityOffset = 0
        this.getAllProvinces(provinceOffset)
        this.getAllFacilityTypes(facilityOffset)
       // this.extractDatabaseCodes()
    },
    computed: {
         nationalClinics () {
            return NationalClinic.all()
        },
          provinces () {
            return Province.all()
        },
        facilityTypes () {
          return FacilityType.all()
        }
    },
    methods: {
    validateNationalClinic () {
           // this.$refs.nome.$refs.ref.validate()
             // this.$refs.code.$refs.ref.validate()
            // if (this.$refs.nome.$refs.ref.validate() && this.$refs.code.$refs.ref.validate()) {
                this.submitNationalClinic()
           // }
        },
        submitNationalClinic () {
            console.log(this.nationalClinic)
            NationalClinic.api().post('/nationalClinic', this.nationalClinic).then(resp => {
                console.log(resp.response.data)
             //  this.$emit('close')
                alert('Clinica Nacional Cadastrada Com Sucesso')
            }).catch(error => {
                console.log(error)
            })
        },
    getAllProvinces (offset) {
        if (this.provinces.length <= 0) {
            Province.api().get('/province?offset=' + offset + '&max=100').then(resp => {
                    offset = offset + 100
                    if (resp.response.data.length > 0) { setTimeout(this.getAllProvinces(offset), 2) }
                }).catch(error => {
                    console.log(error)
                })
        }
    },
     getAllFacilityTypes (facilityOffset) {
        if (this.facilityTypes.length <= 0) {
                FacilityType.api().get('/facilityType?offset=' + facilityOffset + '&max=100').then(resp => {
                    facilityOffset = facilityOffset + 100
                    if (resp.response.data.length > 0) { setTimeout(this.getAllFacilityTypes(facilityOffset), 2) }
                }).catch(error => {
                    console.log(error)
                })
        }
    },
    extractDatabaseCodes () {
        this.clinicos.forEach(element => {
            this.databaseCodes.push(element.code)
    })
    }
    },
    components: {
        nameInput: require('components/Shared/NameInput.vue').default,
        codeInput: require('components/Shared/CodeInput.vue').default,
         PhoneField: require('components/Shared/Input/PhoneField.vue').default
    }

}
</script>

<style>
    .fild-radius {
        border-radius: 5px;
    }
</style>
