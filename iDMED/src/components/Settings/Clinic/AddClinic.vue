<template>
<q-card style="width: 900px; max-width: 90vw;" class="q-pt-lg">
        <form @submit.prevent="validateClinic" >
            <q-card-section class="q-px-md">
               <div class="row q-mt-md">
                <nameInput
                    v-model="clinic.clinicName"
                    label="Nome da Farmácia *"
                    :disable="onlyView"
                    ref="nome"/>
            </div>
              <div class="row q-mt-md">
                <codeInput
                    ref="code"
                    v-model="clinic.code"
                    :rules="[val => codeRules (val)]"
                    :disable="onlyView"
                    lazy-rules
                    label="Codigo *" />
            </div>
             <div class="row q-mb-md">
                <q-select
                    dense outlined
                    class="col"
                    v-model="clinic.province"
                    :disable="onlyView"
                    :options="provinces"
                    transition-show="flip-up"
                    transition-hide="flip-down"
                    ref="province"
                    option-value="id"
                    option-label="description"
                    :rules="[ val => ( val != null ) || ' Por favor indique a província']"
                    lazy-rules
                    label="Província *" />
            </div>
            <div class="row q-mb-md">
                <q-select
                    class="col"
                    dense outlined
                     transition-show="flip-up"
                    transition-hide="flip-down"
                    :disable="onlyView"
                    v-model="clinic.district"
                    :options="districts"
                    ref="district"
                    option-value="id"
                    option-label="description"
                    :rules="[ val => ( val != null) || ' Por favor indique o Distrito']"
                    lazy-rules
                    label="Distrito" />
            </div>
            <div class="row q-mt-md">
                  <PhoneField v-model="clinic.telephone"
                  dense
                  label="Numero de Telefone"
                  :disable="onlyView" />
                </div>
                 <div class="row q-mt-md">
                  <q-input
                  outlined
                  class="col"
      v-model="clinic.notes"
      type="textarea"
      label="Notas"
      dense
       :disable="onlyView"  />
                 </div>
            </q-card-section>
           <q-card-actions align="right" class="q-mb-md">
              <q-btn label="Cancelar" color="red" @click="$emit('close')"/>
                <q-btn type="submit" label="Submeter" color="primary"  v-if="!onlyView"/>
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
import Province from '../../../store/models/province/Province'
import District from '../../../store/models/district/District'
import { ref } from 'vue'
export default {
      props: ['selectedClinic', 'onlyView'],
    data () {
        return {
            databaseCodes: [],
           clinic: new Clinic(),
            clinico: '',
            alert: ref({
              type: '',
              visible: false,
              msg: ''
            })
        }
    },
    created () {
        if (this.clinic !== '') {
          this.clinic = Object.assign({}, this.selectedClinic)
          }
    },
      mounted () {
        this.extractDatabaseCodes()
    },
    computed: {
         clinicos () {
             return Clinic.query()
                           .with('province')
                           .with('district.province')
                           .has('code')
                          .get()
        },
          provinces () {
            return Province.query().with('districts').has('code').get()
        },
        districts () {
        if (this.clinic.province !== null) {
            return District.query().with('province').where('province_id', this.clinic.province.id).get()
        } else {
            return null
        }
        }
    },
    methods: {
    validateClinic () {
            this.$refs.nome.$refs.ref.validate()
             this.$refs.code.$refs.ref.validate()
              this.$refs.province.validate()
              this.$refs.district.validate()
            if (!this.$refs.nome.$refs.ref.hasError && !this.$refs.code.$refs.ref.hasError &&
             !this.$refs.province.hasError && !this.$refs.district.hasError) {
                this.submitClinic()
            }
        },
        submitClinic () {
            this.clinic.mainClinic = 0
            this.clinic.active = true
            this.clinic.province.districts = []
            console.log(this.clinic)
           Clinic.apiSave(this.clinic).then(resp => {
                 this.displayAlert('info', this.clinic.id === null ? 'Clinica Cadastrada Com Sucesso' : 'Clinica actualizada com sucesso.')
            }).catch(error => {
                  this.displayAlert('error', error)
            })
    },
     displayAlert (type, msg) {
          this.alert.type = type
          this.alert.msg = msg
          this.alert.visible = true
        },
        closeDialog () {
          if (this.alert.type === 'info') {
            this.$emit('close')
          }
        },
    extractDatabaseCodes () {
        this.clinicos.forEach(element => {
            this.databaseCodes.push(element.code)
    })
    },
    codeRules (val) {
      if (this.clinic.code === '') {
        return 'o Codigo e obrigatorio'
      } else if (!this.clinic.id && this.selectedClinic.id === this.clinic.id) {
      return !this.databaseCodes.includes(val) || 'o Codigo indicado ja existe'
         }
    }
    },
    components: {
        nameInput: require('components/Shared/NameInput.vue').default,
        codeInput: require('components/Shared/CodeInput.vue').default,
         PhoneField: require('components/Shared/Input/PhoneField.vue').default,
            Dialog: require('components/Shared/Dialog/Dialog.vue').default
    }

}
</script>

<style>
    .fild-radius {
        border-radius: 5px;
    }
</style>
