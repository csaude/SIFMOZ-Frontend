<template>
<q-card style="width: 900px; max-width: 90vw;" class="q-pt-lg">
  <div class="row q-py-lg q-mt-md text-weight-bold text-subtitle1">
         Cadastrar Clinica
        </div>
        <form @submit.prevent="validateClinic" >
            <q-card-section class="q-px-md">
               <div class="row q-mt-md">
                <nameInput
                    v-model="clinic.clinicName"
                    label="Nome da Clinica" />
            </div>
              <div class="row q-mt-md">
                <codeInput
                    ref="code"
                    v-model="clinic.code"
                    :rules="[ val => !this.databaseCodes.includes(val) || 'o Codigo indicado ja existe']"
                    lazy-rules
                    label="Codigo" />
            </div>
             <div class="row q-mb-md">
                <q-select
                    dense outlined
                    class="col"
                    v-model="clinic.province"
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
            <div class="row q-mb-md">
                <q-select
                    class="col"
                    dense outlined
                     transition-show="flip-up"
                    transition-hide="flip-down"
                    v-model="clinic.district"
                    :options="districts"
                    ref="district"
                    option-value="id"
                    option-label="description"
                    :rules="[ val => ( val != null) || ' Por favor indique a Distrito']"
                    lazy-rules
                    label="Distrito" />
            </div>
            <div class="row q-mt-md">
                  <PhoneField v-model="clinic.telephone" dense label="Numero de Telefone"/>
                </div>
                 <div class="row q-mt-md">
                  <q-input
                  outlined
                  class="col"
      v-model="clinic.notes"
      type="textarea"
      label="Notas"
      dense  />
                 </div>
            </q-card-section>
           <q-card-actions align="right" class="q-mb-md">
              <q-btn label="Cancelar" color="red" @click="$emit('close')"/>
                <q-btn type="submit" label="Submeter" color="primary"/>
            </q-card-actions>
        </form>
        <pre>{{clinic}}</pre>
    </q-card>

</template>

<script>
import Clinic from '../../../store/models/clinic/Clinic'
import Province from '../../../store/models/province/Province'
import District from '../../../store/models/district/District'

export default {
      props: ['selectedClinic'],
    data () {
        return {
            databaseCodes: [],
           clinic: new Clinic(),
            clinico: ''
        }
    },
    created () {
        this.currClinic = Object.assign({}, this.newClinic)
    },
      mounted () {
        const offset = 0
        const provinceOffset = 0
        this.getAllClinics(offset)
        this.getAllProvinces(provinceOffset)
        this.extractDatabaseCodes()
    },
    computed: {
         clinicos () {
            return Clinic.all()
        },
          provinces () {
            return Province.all()
        },
        districts () {
        if (this.clinic.province !== null) {
            console.log(District.query().withAll().where('province_id', 1).get())
            return District.query().where('province_id', 1).get()
        } else {
            return null
        }
        }
    },
    methods: {
    validateClinic () {
            this.$refs.nome.$refs.ref.validate()
             this.$refs.code.$refs.ref.validate()
            this.$refs.latitude.$refs.ref.validate()
            this.$refs.longitude.$refs.ref.validate()
            console.log(!this.$refs.nome.$refs.ref.validate() && !this.$refs.latitude.hasError && !this.$refs.longitude.hasError)
            if (this.$refs.nome.$refs.ref.validate() && this.$refs.latitude.$refs.ref.validate() && this.$refs.longitude.$refs.ref.validate() && this.$refs.code.$refs.ref.validate()) {
                this.submitClinic()
            }
        },
        submitClinic () {
            console.log(this.newClinic)
            Clinic.api().post('/clinic', this.newClinic).then(resp => {
                console.log(resp.response.data)
                alert('Clinica Cadastrada Com Sucesso')
            }).catch(error => {
                console.log(error)
            })
        },
        getAllClinics (offset) {
        if (this.clinicos.length <= 0) {
                Clinic.api().get('/clinic?offset=' + offset + '&max=100').then(resp => {
                    offset = offset + 100
                    if (resp.response.data.length > 0) { setTimeout(this.getAllClinics(offset), 2) }
                }).catch(error => {
                    console.log(error)
                })
        }
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
    extractDatabaseCodes () {
        this.clinicos.forEach(element => {
            this.databaseCodes.push(element.code)
    })
    }
    },
    components: {
        nameInput: require('components/Shared/NameInput.vue').default,
        codeInput: require('components/Shared/CodeInput.vue').default,
       // 'combo-field': require('components/Shared/ComboField.vue').default,
         PhoneField: require('components/Shared/Input/PhoneField.vue').default
      //  'input-number-phone-field': require('components/Shared/InputFieldPhoneNumber.vue').default
    }

}
</script>

<style>
    .fild-radius {
        border-radius: 5px;
    }
</style>
