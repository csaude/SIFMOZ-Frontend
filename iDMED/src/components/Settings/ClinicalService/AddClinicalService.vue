<template>
<q-card style="width: 900px; max-width: 90vw;" class="q-pt-lg">
        <form  >
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
                    v-model="clinicalService.description"
                     ref="nome"
                     :disable="onlyView"
                    label="Nome do Servico Clinico *" />
            </div>
              <div class="row q-mt-md">
                <codeInput
                    ref="code"
                    v-model="clinicalService.code"
                    lazy-rules
                     :disable="onlyView"
                    label="Codigo*"
                     :rules="[val => codeRules (val)]" />
            </div>
              <div class="row q-mt-md">
                             <q-select
                              class="col"
                          dense outlined
                          :disable="onlyView"
                          v-model="clinicalService.identifierType"
                          :options="identifierTypes"
                          option-value="id"
                          ref="identifierType"
                          option-label="description"
                          label="Tipo de Identificador*" />
                     </div>
               <div class="q-mt-md">
         <q-table
      title="Atributos do Servico Clinico"
      :rows="clinicalServiceAttributes"
      :columns="columnAttributes"
      row-key="code"
      selection="multiple"
      v-model:selected="selectedAttributes"
       v-if="!onlyView"
        />
              </div>
               <div class="q-mt-md">
         <q-table
      title="Atributos do Servico Clinico"
      :rows="clinicalServiceAttributes"
      :columns="columnAttributes"
      row-key="code"
       v-if="onlyView"
        />
              </div>
              <div class="q-mt-md">
         <q-table
      title="Regimes Terapeuticos"
      :rows="therapeuticRegimens"
      :columns="columnsRegimen"
      row-key="code"
       v-if="onlyView && therapeuticRegimens.length > 0"
        />
              </div>
      </q-step>
         <q-step
          :name="2"
      >
       <q-card-section class="q-px-md">
               <div class="q-pa-md">
         <q-table
      title="Regimes Terapeuticos"
      :rows="therapeuticRegimens"
      :columns="columnsRegimen"
      row-key="code"
      selection="multiple"
       virtual-scroll
        v-model:pagination="pagination"
      :rows-per-page-options="[0]"
      v-model:selected="clinicalService.therapeuticRegimens"
        />
              </div>
            </q-card-section>
         </q-step>
            </q-stepper>
           <q-card-actions align="right" class="q-mb-md">
                <q-stepper-navigation >
                <q-btn label="Cancelar" color="red" @click="$emit('close')" />
                 <q-btn v-if="step > 1 && !onlyView" color="primary" @click="$refs.stepper.previous()" label="Voltar" class="q-ml-sm" />
          <q-btn @click="goToNextStep"  v-if="!onlyView" color="primary" :label="step !== 2 ? 'Submeter' : 'Proximo'" class="q-ml-sm"/>
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
import { useQuasar } from 'quasar'
import TherapeuticRegimen from '../../../store/models/therapeuticRegimen/TherapeuticRegimen'
import ClinicalService from '../../../store/models/ClinicalService/ClinicalService'
import ClinicalServiceAttributeType from '../../../store/models/ClinicalServiceAttributeType/ClinicalServiceAttributeType'
import ClinicalServiceAttribute from '../../../store/models/ClinicalServiceAttribute/ClinicalServiceAttribute'
import IdentifierType from '../../../store/models/identifierType/IdentifierType'

const columnsRegimen = [
  { name: 'code', required: true, label: 'Nome', align: 'left', field: row => row.description, format: val => `${val}`, sortable: true },
  { name: 'description', required: true, label: 'Code', align: 'left', field: row => row.code, format: val => `${val}`, sortable: true }
]

const columnAttributes = [
  { name: 'description', required: true, label: 'Code', align: 'left', field: row => row.description, format: val => `${val}` }
]

export default {
      props: ['selectedClinicalService', 'onlyView', 'editMode'],
  data () {
 const $q = useQuasar()
  const selected = ref([])

    return {
      selected,
      columnsRegimen,
      columnAttributes,
      $q,
       step: ref(1),
       clinicalService: new ClinicalService(),
       clinicalServiceAttributeTypes: [],
       regimenDrugs: [],
       clinicServiceAttribute: [],
       selectedAttributes: [],
      alert: ref({
              type: '',
              visible: false,
              msg: ''
            }),
      databaseCodes: []
  }
  },
  computed: {
      therapeuticRegimens () {
        if (this.editMode) {
     return TherapeuticRegimen.query().with('drugs.form').with('clinicalService').where((therapeuticRegimen) => {
     return therapeuticRegimen.clinical_service_id === this.clinicalService.id || therapeuticRegimen.clinical_service_id === ''
      }).get()
        } if (this.onlyView) {
      return TherapeuticRegimen.query().with('drugs.form').with('clinicalService').where((therapeuticRegimen) => {
     return therapeuticRegimen.clinical_service_id === this.clinicalService.id
      }).get()
        } else {
          return TherapeuticRegimen.query().with('drugs.form').hasNot('clinicalService').get()
          }
      },
       clinicalServiceAttributes () {
             return ClinicalServiceAttributeType.all()
      },
      identifierTypes () {
         return IdentifierType.all()
      },
       clinicalServices () {
          return ClinicalService.query().with('attributes.clinicalServiceAttributeType').with('identifierType').with('therapeuticRegimens').has('code').get()
      }
  },
  methods: {
         validateClinicalService () {
            this.$refs.nome.$refs.ref.validate()
             this.$refs.code.$refs.ref.validate()
            this.$refs.identifierType.validate()
            if (!this.$refs.nome.$refs.ref.hasError && !this.$refs.code.$refs.ref.hasError && !this.$refs.identifierType.hasError) {
               this.submitClinicalService()
            }
        },
        submitClinicalService () {
               this.createClinicServiceAttribute()
          this.clinicalService.attributes = this.clinicalServiceAttributeTypes
          this.clinicalService.active = true
             ClinicalService.apiSave(this.clinicalService).post('/clinicalService', this.clinicalService).then(resp => {
                this.displayAlert('info', this.clinicalService.id === null ? 'Servico Clinico adicionado com sucesso.' : 'Servico Clinico actualizado com sucesso.')
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
        goToNextStep () {
          if (this.step === 1) {
        const attribute = this.selectedAttributes.filter(x => x.code === 'THERAPEUTICAL_REGIMEN')
        if (attribute.length >= 1 && attribute[0].code === 'THERAPEUTICAL_REGIMEN') {
          // try
          this.$refs.stepper.next()
        } else {
          this.validateClinicalService()
             }
        } else {
          this.validateClinicalService()
             }
        },
        createClinicServiceAttribute () {
          this.selectedAttributes.forEach(attribute => {
            this.clinicServiceAttribute = new ClinicalServiceAttribute()
            this.clinicServiceAttribute.clinicalServiceAttributeType = attribute
            this.clinicalServiceAttributeTypes.push(this.clinicServiceAttribute)
          })
        },
         extractDatabaseCodes () {
        this.clinicalServices.forEach(element => {
            this.databaseCodes.push(element.code)
    })
    },
    codeRules (val) {
       if (!this.clinicalService.id && this.selectedClinicalService.id === this.clinicalService.id) {
      return !this.databaseCodes.includes(val) || 'o Codigo indicado ja existe'
         }
    }
  },
  mounted () {
    ClinicalServiceAttributeType.apiGetAll()
    IdentifierType.apiGetAll()
  },
   created () {
        if (this.clinicalService !== '') {
          this.clinicalService = Object.assign({}, this.selectedClinicalService)
          // this.clinicalService.attributes = this.selectedClinicalService.attributes
          if (this.selectedClinicalService != null) {
            this.clinicalService.attributes.forEach(attribute => {
          this.selectedAttributes.push(attribute.clinicalServiceAttributeType)
        })
          }
        }
        this.extractDatabaseCodes()
    },
  components: {
        nameInput: require('components/Shared/NameInput.vue').default,
          codeInput: require('components/Shared/CodeInput.vue').default,
            Dialog: require('components/Shared/Dialog/Dialog.vue').default
  }
}
</script>
