<template>
<q-card style="width: 900px; max-width: 90vw;" class="q-pt-lg">
        <form @submit.prevent="validateClincalService" >
            <q-card-section class="q-px-md">
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
              <div class="q-pa-md">
         <q-table
      title="Regimes Terapeuticos"
      :rows="therapeuticRegimens"
      :columns="columnsRegimen"
      row-key="code"
      selection="multiple"
      v-model:selected="clinicalService.therapeuticRegimens"
        />
              </div>
            </q-card-section>
           <q-card-actions align="right" class="q-mb-md">
              <q-btn label="Cancelar" color="red" @click="$emit('close')"/>
                <q-btn type="submit" label="Submeter" color="primary"/>
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

const columnsRegimen = [
  { name: 'code', required: true, label: 'Nome', align: 'left', field: row => row.code, format: val => `${val}`, sortable: true },
  { name: 'description', required: true, label: 'Code', align: 'left', field: row => row.description, format: val => `${val}`, sortable: true }
]

export default {
  data () {
 const $q = useQuasar()
  const selected = ref([])

    return {
      selected,
      columnsRegimen,
      $q,
       clinicalService: new ClinicalService(),
      alert: ref({
              type: '',
              visible: false,
              msg: ''
            })
  }
  },
  computed: {
      therapeuticRegimens () {
             return TherapeuticRegimen.all()
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
        }
  },
  mounted () {
    const offset = 0
    this.getAllTherapeuticRegimens(offset)
  },
  components: {
  //  addDrug: require('components/Settings/Drug/AddDrug.vue').default
  //   nationalClinicsTable: require('components/Settings/NationalClinic/NationalClinicsTable.vue').default
        nameInput: require('components/Shared/FirstNameInput.vue').default,
          codeInput: require('components/Shared/CodeInput.vue').default,
            Dialog: require('components/Shared/Dialog/Dialog.vue').default
  }
}
</script>
