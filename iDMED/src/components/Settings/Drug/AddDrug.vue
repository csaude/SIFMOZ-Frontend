<template>
  <q-card style="width: 900px; max-width: 90vw;" class="q-pt-lg">
        <form @submit.prevent="validateDrug" >
            <q-card-section class="q-px-md">
                <div class="q-mt-md">
                    <div class="row">
                        <nameInput v-model="drug.name" :disable="onlyView" ref="nome" />
                    </div>
                     <div class="row q-mt-md">
                        <codeInput v-model="drug.fnmCode" :disable="onlyView" label="fnmCode"/>
                    </div>
                    <div class="row q-mt-md">
                         <numberField v-model="drug.packSize" label="Tamanho do pacote" :disable="onlyView"/>
                    </div>
                    <div class="q-mt-md">
                    </div>
                    <div class="row">
                        <numberField v-model="drug.defaultTimes" label="N de toma"  :disable="onlyView" />
                      <numberField v-model="drug.defaultTreatment" class="q-ml-md" label="Numero de vezes a tomar"  :disable="onlyView"/>
                        <q-select
                              class="col q-ml-md"
                          dense outlined
                          v-model="drug.defaultPeriodTreatment"
                          :options="periodsTime"
                           :disable="onlyView"
                          label="Periodo a Tomar" />
                    </div>
                        <div class="row q-mt-md">
                    <q-select
                     class="col" dense outlined
                      v-model="drug.form"
                      use-input
                      input-debounce="0"
                      :options="forms"
                      option-value="id"
                      option-label="description"
                      label="Forma"
                      @filter="filterForm"
                      :disable="onlyView"/>
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
import Drug from '../../../store/models/drug/Drug'
import { ref } from 'vue'
import Form from '../../../store/models/form/Form'
const stringOptions = [
  'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
]
export default {
    props: ['selectedDrug', 'onlyView'],
    data () {
      const formOptions = ref(this.forms)
        return {
           alert: ref({
              type: '',
              visible: false,
              msg: ''
            }),
            drug: new Drug(),
            formOptions,
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
          validateDrug () {
      //      console.log(this.$refs.nome.ref.validate())
      //      this.$refs.nome.$refs.ref.validate()
       //      this.$refs.code.$refs.ref.validate()
         //    if (this.$refs.nome.$refs.ref.validate() && this.$refs.code.$refs.ref.validate()) {
                this.submitDrug()
           // }
        },
        submitDrug () {
            console.log(this.drug)
            Drug.api().post('/drug', this.drug).then(resp => {
                console.log(resp.response.data)
                this.displayAlert('info', 'Medicamento gravado com sucesso.')
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
    created () {
        if (this.drug !== '') {
          this.drug = Object.assign({}, this.selectedDrug)
        }
    },
    components: {
        nameInput: require('components/Shared/NameInput.vue').default,
         codeInput: require('components/Shared/CodeInput.vue').default,
        numberField: require('components/Shared/Input/NumberField.vue').default,
        Dialog: require('components/Shared/Dialog/Dialog.vue').default
    },
    mounted () {
         // const offset = 0
        this.formOptions = this.forms
    },
    computed: {
      forms () {
            return Form.all()
        }
    }
}
</script>

<style>

</style>
