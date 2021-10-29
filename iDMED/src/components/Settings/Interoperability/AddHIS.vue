<template>
<q-card style="width: 900px; max-width: 90vw;" class="q-pt-lg">
        <form @submit.prevent="validateHis" >
        <q-stepper
      v-model="step"
      ref="stepper"
      contracted
      animated
    >
      <q-step
        :name="1"
      >
               <div class="row q-mt-md">
                <nameInput
                    ref="nome"
                    v-model="his.description"
                    label="Nome do Sistema de Informacao" />
            </div>
              <div class="row q-mt-md">
                <codeInput
                    ref="code"
                    v-model="his.abbreviation"
                    :rules="[ val => !this.databaseCodes.includes(val) || 'o Codigo indicado ja existe']"
                    lazy-rules
                    label="Abreviatura" />
            </div>
            <div class="row q-mt-md">
       <q-table
      class="col"
      title="Atributos"
      :rows="interoperabilityAttributes"
      :columns="columnsAttributes"
      row-key="code"
      selection="multiple"
      v-model:selected="selectedAttributes"
        />
                    </div>
      </q-step>
       <q-step
          :name="2"
      >
         <div class="">
                  <selectedAttributesTable  :rows="healthInformationAttributeTypes" :columns="columnsSelectedAttributes"/>
        </div>
       </q-step>
            </q-stepper>
           <q-card-actions align="right" class="q-mb-md">
                <q-stepper-navigation >
                <q-btn label="Cancelar" color="red" @click="$emit('close')" />
                 <q-btn v-if="step > 1" color="primary" @click="$refs.stepper.previous()" label="Voltar" class="q-ml-sm" />
          <q-btn @click="goToNextStep" color="primary" :label="step === 2 ? 'Submeter' : 'Proximo'" class="q-ml-sm"/>
        </q-stepper-navigation>
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
import { ref } from 'vue'
import HealthInformationSystem from '../../../store/models/healthInformationSystem/HealthInformationSystem'
import InteroperabilityAttribute from '../../../store/models/interoperabilityAttribute/InteroperabilityAttribute'
import InteroperabilityType from '../../../store/models/interoperabilityType/InteroperabilityType'

const columnsAttributes = [
  { name: 'name', required: true, label: 'Nome', align: 'left', field: row => row.description, format: val => `${val}`, sortable: true }
]

const columnsSelectedAttributes = [
  { name: 'interoperabilityType', required: true, label: 'Nome', align: 'left', field: row => row.interoperabilityType.description, format: val => `${val}`, sortable: true },
  { name: 'value', required: true, label: 'Valor', align: 'left', field: row => row.value, format: val => `${val}`, sortable: true }
]

export default {
      props: ['selectedHis'],
    data () {
        return {
            databaseCodes: [],
           his: new HealthInformationSystem(),
           codes: [],
           step: ref(1),
           columnsAttributes,
           columnsSelectedAttributes,
            healthInformationAttributeTypes: [],
           interoperabilityAttribute: [],
           selectedAttributes: [],
             alert: ref({
              type: '',
              visible: false,
              msg: ''
            })
        }
    },
    created () {
        if (this.selectedHis !== '') {
          this.his = Object.assign({}, this.selectedHis)
          if (this.selectedHis != null) {
               this.selectedHis.interoperabilityAttributes.forEach(attribute => {
            this.selectedAttributes.push(attribute.interoperabilityType)
          })
          this.healthInformationAttributeTypes = this.selectedHis.interoperabilityAttributes
          }
         // this.selectedAttributes = this.selectedHis.interoperabilityAttributes
        }
    },
      mounted () {
          this.fetchInteroperabilityAttributes()
       // this.extractDatabaseCodes()
    },
    computed: {
        interoperabilityAttributes () {
           return InteroperabilityType.all()
      }
    },
    methods: {
    validateHis () {
           // this.$refs.nome.$refs.ref.validate()
             // this.$refs.code.$refs.ref.validate()
            // if (this.$refs.nome.$refs.ref.validate() && this.$refs.code.$refs.ref.validate()) {
                this.submitHis()
           // }
        },
        submitHis () {
            console.log(this.his)
            this.his.interoperabilityAttributes = this.healthInformationAttributeTypes
            HealthInformationSystem.api().post('/healthInformationSystem', this.his).then(resp => {
                console.log(resp.response.data)
             this.displayAlert('info', 'Sistema De informacao de saude gravado com sucesso.')
            }).catch(error => {
                this.displayAlert('error', error)
            })
        },
        goToNextStep () {
          if (this.step === 1) {
          // try
           this.selectedAttributes.forEach(attribute => {
               if (!this.healthInformationAttributeTypes.find(x => x.interoperabilityType === attribute)) {
             this.interoperabilityAttribute = new InteroperabilityAttribute()
            this.interoperabilityAttribute.interoperabilityType = attribute
            this.healthInformationAttributeTypes.push(this.interoperabilityAttribute)
               }
          })
          this.$refs.stepper.next()
          console.log(this.healthInformationAttributeTypes)
        } else {
          this.submitHis()
             }
        },
    extractDatabaseCodes () {
        this.codes.forEach(element => {
            this.databaseCodes.push(element.code)
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
    fetchInteroperabilityAttributes () {
        InteroperabilityType.apiGetAll()
    }
    },
    components: {
        nameInput: require('components/Shared/NameInput.vue').default,
        codeInput: require('components/Shared/CodeInput.vue').default,
        selectedAttributesTable: require('components/Settings/Interoperability/HealthInformationSystemAttributeTable.vue').default,
        Dialog: require('components/Shared/Dialog/Dialog.vue').default
    }

}
</script>

<style>
    .fild-radius {
        border-radius: 5px;
    }
</style>
