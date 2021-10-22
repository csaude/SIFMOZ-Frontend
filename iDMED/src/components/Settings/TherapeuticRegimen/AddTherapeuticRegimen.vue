<template>
  <q-card style="width: 900px; max-width: 90vw;" class="q-pt-lg">
        <form @submit.prevent="validateTherapeuticRegimen" >
            <q-card-section class="q-px-md">
                <div class="q-mt-md">
                    <div class="row">
                        <nameInput v-model="therapeuticRegimen.regimenScheme" :disable="onlyView" label="Esquema do Regime" />
                    </div>
                     <div class="row q-mt-md">
                       <nameInput v-model="therapeuticRegimen.description" :disable="onlyView" />
                    </div>
                    <div class="row q-mt-md">
                        <codeInput v-model="therapeuticRegimen.code" :disable="onlyView" />
                    </div>
                     <div class="row q-mt-md">
                         <q-table
      class="col"
      title="Medicamentos"
      :rows="drugs"
      :columns="columnsDrug"
      row-key="fnmCode"
      selection="multiple"
      v-model:selected="therapeuticRegimen.drugs"
        />
                    </div>
                </div>
            </q-card-section>
           <q-card-actions align="right" class="q-mb-md q-mr-sm">
                <q-btn label="Cancelar" color="red" @click="$emit('close')" />
                <q-btn type="submit" label="Submeter" color="primary" v-if="!onlyView"/>
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
import TherapeuticRegimen from '../../../store/models/therapeuticRegimen/TherapeuticRegimen'
import { ref } from 'vue'
import Drug from '../../../store/models/drug/Drug'
import RegimenDrug from '../../../store/models/regimenDrug/RegimenDrug'
const stringOptions = [
  'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
]
const columnsDrug = [
  { name: 'fnmCode', required: true, label: 'Codigo FNM', align: 'left', field: row => row.fnmCode, format: val => `${val}`, sortable: true },
  { name: 'name', required: true, label: 'Nome', align: 'left', field: row => row.name, format: val => `${val}`, sortable: true }
]
export default {
    props: ['selectedTherapeuticRegimen', 'onlyView'],
    data () {
      const formOptions = ref(this.forms)
        return {
          columnsDrug,
           alert: ref({
              type: '',
              visible: false,
              msg: ''
            }),
            therapeuticRegimen: new TherapeuticRegimen(),
            formOptions,
            selectedDrugs: [],
            regimenDrugs: [],
            regimenDrug: [],
            periodsTime: ['Ano', 'Mes', 'Semana', 'Dia'],
            createValue (val, done) {
              if (val.length > 2) {
                if (!stringOptions.includes(val)) {
                  done(val, 'add-unique')
                }
              }
            }
        }
    },
    methods: {
          validateTherapeuticRegimen () {
           // this.$refs.nome.$refs.ref.validate()
             // this.$refs.code.$refs.ref.validate()
            // if (this.$refs.nome.$refs.ref.validate() && this.$refs.code.$refs.ref.validate()) {
                this.submitTherapeuticRegimen()
           // }
        },
        submitTherapeuticRegimen () {
       //   this.createRegimenDrugs()
        //  this.therapeuticRegimen.regimenDrugs = this.regimenDrugs
            console.log(this.therapeuticRegimen)
            TherapeuticRegimen.api().post('/therapeuticRegimen', this.therapeuticRegimen).then(resp => {
                console.log(resp.response.data)
                this.displayAlert('info', 'Regime Terapeutico gravado com sucesso.')
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
         async  getAllDrugs (offset) {
            if (this.drugs.length <= 0) {
         await Drug.api().get('/drug?offset=' + offset + '&max=100').then(resp => {
                        offset = offset + 100
                        if (resp.response.data.length > 0) { setTimeout(this.getAllDrugs(offset), 2) }
                    }).catch(error => {
                        console.log(error)
                    })
            }
        },
        createRegimenDrugs () {
          this.selectedDrugs.forEach(drug => {
            this.regimenDrug = new RegimenDrug()
            this.regimenDrug.drug = drug
           // this.regimenDrug.therapeutic_regimen = this.therapeuticRegimen
            this.regimenDrugs.push(this.regimenDrug)
          })
        }
    },
    created () {
        if (this.therapeuticRegimen !== '') {
          this.therapeuticRegimen = Object.assign({}, this.selectedtherapeuticRegimen)
        }
    },
    components: {
        nameInput: require('components/Shared/NameInput.vue').default,
         codeInput: require('components/Shared/CodeInput.vue').default,
        Dialog: require('components/Shared/Dialog/Dialog.vue').default
        //   details1: require('components/Settings/TherapeuticRegimen/details.vue').default
    },
    mounted () {
          const offset = 0
    this.getAllDrugs(offset)
    },
    computed: {
        drugs () {
             return Drug.all()
      }
    }
}
</script>

<style>

</style>
