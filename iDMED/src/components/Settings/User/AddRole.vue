<template>
<q-card style="width: 900px; max-width: 90vw;" class="q-pt-lg">
        <q-card-section>
            <div class="text-h6">Cadastrar Perfil</div>
        </q-card-section>
              <form @submit.prevent="validateRole" >
            <q-card-section class="q-px-md">
               <div class="row q-mt-md">
                  <nameInput
                    ref="nome"
                    square
                    v-model="role.name"
                    :rules="[ val => val.length >= 3 || 'O nome indicado é inválido']"
                    lazy-rules
                    :disable="onlyView"
                    class="col fild-radius"
                    label="Nome" />
            </div>
               <div class="row q-mt-md">
                  <nameInput
                    ref="description"
                    square
                    v-model="role.description"
                    :rules="[ val => val.length >= 3 || 'A Descrição indicado é inválido']"
                    lazy-rules
                    :disable="onlyView"
                    class="col fild-radius"
                    label="Descrição" />
            </div>
              <div class="q-pa-md">
         <q-table
            title="Funcionalidades"
            :rows="menus"
            :columns="columns"
            row-key="code"
            selection="multiple"
            v-model:selected="role.menus"
            class="my-sticky-header-table"
              v-if="!onlyView"
            rows-per-page-options="8"
          >
         </q-table>
            <q-table
      class="col"
      title="Funcionalidades"
      :rows="role.menus"
      :columns="columns"
      row-key="code"
      v-if="onlyView"
        />
              </div>
                <q-card-actions align="right" class="q-mb-md q-mr-sm">
                <q-btn label="Cancelar" color="red" @click="$emit('close')" />
                <q-btn type="submit" :loading="submitting" label="Submeter" color="primary" v-if="!onlyView"/>
            </q-card-actions>
              </q-card-section>
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
import Role from 'src/store/models/userLogin/Role'
import { ref } from 'vue'
import Menu from 'src/store/models/userLogin/Menu'

const columns = [
  { name: 'descricao', required: true, label: 'Descrição', align: 'left', field: row => row.description, format: val => `${val}`, sortable: true }
]

export default {
      props: ['selectedRole', 'onlyView'],
    data () {
        return {
            databaseCodes: [],
            submitting: false,
            role: new Role(),
            userRole: '',
            clinico: '',
            alert: ref({
              type: '',
              visible: false,
              msg: ''
            }),
            columns,
            step: ref(1),
             isPwd: ref(true)
        }
    },
    created () {
        if (this.role !== '') {
          this.role = Object.assign({}, this.selectedRole)
          }
    },
      mounted () {
    },
    computed: {
         userRoles () {
          return Role.query().with('menus').get()
        },
        menus () {
          return Menu.all()
        }
    },
    methods: {
    validateRole () {
      this.$refs.nome.$refs.ref.validate()
        this.$refs.description.$refs.ref.validate()
        if (!this.$refs.nome.$refs.ref.hasError &&
            !this.$refs.description.hasError) {
                        if (this.role.menus.length <= 0) {
           this.displayAlert('error', 'Por Favor seleccione pelo menos uma funcionalidade')
            } else {
                   this.submitUser()
            }
        }
        },
        submitUser () {
           this.submitting = true
            console.log(this.role)
            this.role.active = true
            this.role.authority = 'ROLE_' + this.role.name
           Role.apiSave(this.role).then(resp => {
              this.submitting = false
                 this.displayAlert('info', this.role.id === null ? 'Perfil Cadastrada Com Sucesso' : 'Perfil actualizada com sucesso.')
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
          if (this.alert.type === 'info') {
            this.$emit('close')
          }
        }
    },
    components: {
        nameInput: require('components/Shared/NameInput.vue').default,
            Dialog: require('components/Shared/Dialog/Dialog.vue').default
    }

}
</script>

<style>
    .fild-radius {
        border-radius: 5px;
    }
</style>
