<template>
  <q-card style="width: 900px; max-width: 90vw;" class="q-pt-lg">
    <q-card-section>
            <div class="text-h6">Tipo de Identificador</div>
        </q-card-section>
        <form @submit.prevent="validateClinicSector" >
            <q-card-section class="q-px-md">
               <div class="row q-mt-md">
                <nameInput
                    v-model="identifierType.description"
                    label="Descrição *"
                    :disable="isDisplayStep"
                    ref="nome" />
            </div>
              <div class="row q-mt-md">
                <codeInput
                    ref="code"
                    v-model="identifierType.code"
                    :disable="isDisplayStep"
                   :rules="[val => codeRules (val)]"
                    lazy-rules
                    label="Código *" />
            </div>
             <div class="row q-mb-md">
                <TextInput
                  v-model="identifierType.pattern"
                  label="Padrão do identificador"
                  ref="pattern"
                  :disable="isDisplayStep"
                  :rules="[ val => !!val || 'Por favor indicar o padrão do identificador']"
                  dense
                  hint="Exemplo: ###/####/#"
                  class="col" />
            </div>
            </q-card-section>
           <q-card-actions align="right" class="q-mb-md">
              <q-btn label="Cancelar" color="red" @click="$emit('close')"/>
                <q-btn type="submit" :loading="submitting" label="Submeter" color="primary"/>
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
import IdentifierType from '../../../store/models/identifierType/IdentifierType'
import { ref } from 'vue'
import Clinic from '../../../store/models/clinic/Clinic'
import { SessionStorage } from 'quasar'
export default {
  props: ['selectedIdentifierType', 'step'],
  data () {
        return {
            databaseCodes: [],
            submitting: false,
           identifierType: new IdentifierType(),
            alert: ref({
              type: '',
              visible: false,
              msg: ''
            })
        }
    },
    created () {
    },
      mounted () {
        IdentifierType.apiGetAll(0, 200)
        this.init()
    },
    computed: {
         clinics () {
            return Clinic.query().has('code').get()
        },
        currClinic () {
        return Clinic.query()
                    .with('province')
                    .with('district.province')
                    .with('facilityType')
                    .where('id', SessionStorage.getItem('currClinic').id)
                    .first()
      },
      isEditStep () {
        return this.step === 'edit'
      },
      isCreateStep () {
        return this.step === 'create'
      },
      isDisplayStep () {
        return this.step === 'display'
      }
    },
    methods: {
      init () {
        if (this.isEditStep) {
          this.identifierType = Object.assign({}, this.selectedIdentifierType)
        }
      },
      validateClinicSector () {
          this.$refs.nome.$refs.ref.validate()
            this.$refs.code.$refs.ref.validate()
            this.$refs.pattern.$refs.ref.validate()
          if (!this.$refs.nome.$refs.ref.hasError && !this.$refs.code.$refs.ref.hasError &&
            !this.$refs.pattern.$refs.ref.hasError) {
              this.doSave()
          }
      },
      doSave () {
          this.submitting = true
          console.log(this.identifierType)
          IdentifierType.apiSave(this.identifierType).then(resp => {
            this.submitting = false
              this.displayAlert('info', this.identifierType.id === null ? 'Identificador adiconado com sucesso.' : 'Identificador actualizado com sucesso.')
          }).catch(error => {
            this.submitting = false
              this.displayAlert('error', error)
          })
      },
      displayAlert (type, msg) {
        this.alert.type = type
        this.alert.msg = msg
        this.alert.visible = true
      },
      closeDialog () {
        this.alert.visible = false
        if (this.alert.type === 'info') {
          this.$emit('close')
        }
      },
      codeRules (val) {
        if (this.identifierType.code === '') {
          return 'o Código é obrigatorio'
        } else if (this.identifierType.id === null) {
          const existingIdentifiers = IdentifierType.all()
          if (existingIdentifiers !== null) {
            const codeExists = existingIdentifiers.some((idType) => {
              return idType.code === val
            })
            return !codeExists || 'o Código indicado já existe'
          }
        }
      }
    },
    components: {
        nameInput: require('components/Shared/NameInput.vue').default,
        codeInput: require('components/Shared/CodeInput.vue').default,
        Dialog: require('components/Shared/Dialog/Dialog.vue').default,
        TextInput: require('components/Shared/Input/TextField.vue').default
    }
}
</script>

<style>

</style>
