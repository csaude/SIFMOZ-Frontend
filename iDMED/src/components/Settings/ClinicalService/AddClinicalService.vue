<template>
<q-card style="width: 900px; max-width: 90vw;" class="q-pt-lg">
        <form @submit.prevent="validateClincalService" >
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
                    label="Nome do Servico Clinico" />
            </div>
              <div class="row q-mt-md">
                <codeInput
                    ref="code"
                    v-model="clinicalService.code"
                    lazy-rules
                    label="Codigo" />
            </div>
              <div class="row q-mt-md">
                             <q-select
                              class="col"
                          dense outlined
                          v-model="clinicalService.identifierType"
                          :options="identifierTypes"
                          option-value="id"
                          option-label="description"
                          label="Tipo de Identificador" />
                     </div>
               <div class="q-mt-md">
         <q-table
      title="Atributos do Servico Clinico"
      :rows="clinicalServiceAttributes"
      :columns="columnAttributes"
      row-key="code"
      selection="multiple"
      v-model:selected="selectedAttributes"
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
import { useQuasar } from 'quasar'
import TherapeuticRegimen from '../../../store/models/therapeuticRegimen/TherapeuticRegimen'
import ClinicalService from '../../../store/models/ClinicalService/ClinicalService'
import ClinicalServiceAttributeType from '../../../store/models/ClinicalServiceAttributeType/ClinicalServiceAttributeType'
import ClinicalServiceAttribute from '../../../store/models/ClinicalServiceAttribute/ClinicalServiceAttribute'
import IdentifierType from '../../../store/models/identifierType/IdentifierType'

const columnsRegimen = [
    { name: '', required: true, label: '' },
      { name: '', required: true, label: '' },
  { name: 'code', required: true, label: 'Nome', align: 'left', field: row => row.code, format: val => `${val}`, sortable: true },
  { name: 'description', required: true, label: 'Code', align: 'left', field: row => row.description, format: val => `${val}`, sortable: true }
]

const columnAttributes = [
  { name: 'description', required: true, label: 'Code', align: 'left', field: row => row.description, format: val => `${val}` }
]

export default {
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
            })
  }
  },
  computed: {
      therapeuticRegimens () {
           return TherapeuticRegimen.query().with('drugs.form').get()
      },
       clinicalServiceAttributes () {
             return ClinicalServiceAttributeType.all()
      },
      identifierTypes () {
         return IdentifierType.all()
      }
  },
  methods: {
        async  getAllTherapeuticRegimens (offset) {
            if (this.therapeuticRegimens.length <= 0) {
         await TherapeuticRegimen.api().get('/therapeuticRegimen?offset=' + offset + '&max=100').then(resp => {
                        offset = offset + 100
                        if (resp.response.data.length > 0) { setTimeout(this.getAllTherapeuticRegimens(offset), 2) }
                    }).catch(error => {
                        console.log(error)
                    })
            }
        },
         validateClincalService () {
           // this.$refs.nome.$refs.ref.validate()
             // this.$refs.code.$refs.ref.validate()
            // if (this.$refs.nome.$refs.ref.validate() && this.$refs.code.$refs.ref.validate()) {
                this.submitClinicalService()
           // }
        },
        submitClinicalService () {
               this.createClinicServiceAttribute()
          this.clinicalService.attributes = this.clinicalServiceAttributeTypes
            console.log(this.clinicalService)
            ClinicalService.api().post('/clinicalService', this.clinicalService).then(resp => {
                console.log(resp.response.data)
                this.displayAlert('info', 'Servico Clinico gravado com sucesso.')
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
          this.submitClinicalService()
             }
        } else {
          this.submitClinicalService()
             }
        },
        createClinicServiceAttribute () {
          this.selectedAttributes.forEach(attribute => {
            this.clinicServiceAttribute = new ClinicalServiceAttribute()
            this.clinicServiceAttribute.clinicalServiceAttributeType = attribute
            this.clinicalServiceAttributeTypes.push(this.clinicServiceAttribute)
          })
        }
  },
  mounted () {
    const offset = 0
    this.getAllTherapeuticRegimens(offset)
    ClinicalServiceAttributeType.apiGetAll()
    IdentifierType.apiGetAll()
  },
  components: {
  //  addDrug: require('components/Settings/Drug/AddDrug.vue').default
  //   nationalClinicsTable: require('components/Settings/NationalClinic/NationalClinicsTable.vue').default
        nameInput: require('components/Shared/FirstNameInput.vue').default,
          codeInput: require('components/Shared/CodeInput.vue').default,
            Dialog: require('components/Shared/Dialog/Dialog.vue').default
       //     TherapeuticRegimenExTable: require('components/Settings/ClinicalService/TherapeuticRegimenExTable.vue').default
  }
}
</script>
