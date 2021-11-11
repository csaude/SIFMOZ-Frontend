<template>
    <div>
     <div class="row q-py-lg q-mt-md text-weight-bold text-subtitle1">
        Servico Clinico
        </div>
        <div class="">
        <q-table
          style="height: 700px"
     :rows="clinicServices"
      :columns="columns"
      :filter="filter"
       v-model:pagination="pagination"
      :rows-per-page-options="[0]"
      virtual-scroll>
        <template v-slot:top-right>
            <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
            <template v-slot:append>
                <q-icon name="search" />
            </template>
                </q-input>
        </template>
        <template v-slot:body="props">
            <q-tr :props="props">
            <q-td key="code" :props="props">
                {{ props.row.code }}
            </q-td>
            <q-td key="description" :props="props">
                {{ props.row.description }}
            </q-td>
              <q-td key="active" :props="props">
                {{ props.row.active ? 'Sim':'Nao' }}
            </q-td>
                  <q-td key="options" :props="props">
                  <div class="col">
                    <q-btn flat round
                    color="amber-8"
                    icon="edit"
                   v-if="props.row.active === true"
                   @click="editClinicService(props.row)">
                    <q-tooltip class="bg-amber-5">Editar</q-tooltip>
                  </q-btn>

                  <q-btn flat round
                    class="q-ml-md"
                    color="green-8"
                    icon="search"
                    @click="visualizeClinicalService(props.row)">
                    <q-tooltip class="bg-green-5">Visualizar</q-tooltip>
                  </q-btn>
                   <q-btn flat round
                      class="q-ml-md"
                      color="red"
                      icon="delete"
                      v-if="props.row.active === true"
                      @click.stop="promptToConfirm(props.row)"
                     >
                     <q-tooltip class="bg-green-5">Remover</q-tooltip>
                     </q-btn>
                  </div>
                  </q-td>
            </q-tr>
        </template>
    </q-table>
        </div>
         <div class="absolute-bottomg">
              <q-page-sticky position="bottom-right" :offset="[18, 18]">
                <q-btn size="xl" fab icon="add" @click="addClinicService" color="primary" />
             </q-page-sticky>
        </div>
          <q-dialog persistent v-model="showClinicServiceRegistrationScreen" full-width>
          <addClinicalService
          :selectedClinicalService="clinicalService"
          :editMode=editMode
           :onlyView="viewMode"
            @close="showClinicServiceRegistrationScreen = false" />
      </q-dialog>
         <q-dialog v-model="alert.visible">
             <Dialog :type="alert.type" @closeDialog="closeDialog">
            <template v-slot:title> Informação</template>
            <template v-slot:msg> {{alert.msg}} </template>
          </Dialog>
             </q-dialog>
    </div>
</template>
<script>
import { useQuasar } from 'quasar'
import { ref } from 'vue'
import ClinicalService from '../../../store/models/ClinicalService/ClinicalService'

const columns = [
  { name: 'code', required: true, label: 'Codigo', align: 'left', field: row => row.code, format: val => `${val}`, sortable: true },
  { name: 'description', required: true, label: 'Nome', align: 'left', field: row => row.description, format: val => `${val}`, sortable: true },
   { name: 'active', required: true, label: 'Activo', align: 'left', field: row => row.active, format: val => `${val}`, sortable: true },
  { name: 'options', align: 'left', label: 'Opções', sortable: false }
]
export default {
  data () {
    const $q = useQuasar()

    return {
        columns,
        $q,
         showClinicServiceRegistrationScreen: false,
         editMode: false,
         viewMode: false,
           alert: ref({
              type: '',
              visible: false,
              msg: ''
            })
    }
  },
 computed: {
      clinicServices () {
          return ClinicalService.query().with('attributes.clinicalServiceAttributeType').with('identifierType').with('therapeuticRegimens').has('code').get()
      }
  },
  methods: {
  async  getClinicServices () {
          await ClinicalService.api().get('/clinicalService')
       },
       editClinicService (clinicalService) {
        this.clinicalService = Object.assign({}, clinicalService)
         this.showClinicServiceRegistrationScreen = true
         this.editMode = true
          this.viewMode = false
      },
        addClinicService () {
          this.clinicalService = new ClinicalService()
         this.showClinicServiceRegistrationScreen = true
           this.editMode = false
           this.viewMode = false
      },
        visualizeClinicalService (clinicalService) {
           this.clinicalService = Object.assign({}, clinicalService)
         this.viewMode = true
            this.showClinicServiceRegistrationScreen = true
             this.editMode = false
      },
        promptToConfirm (clinicalService) {
            this.$q.dialog({ title: 'Confirm', message: 'Deseja inactivar o Servico Clinico?', cancel: true, persistent: true }).onOk(() => {
               clinicalService.active = false
             ClinicalService.apiSave(clinicalService).then(resp => {
                  this.displayAlert('info', 'Servico Clinico inactivado com sucesso')
            }).catch(error => {
                   this.displayAlert('error', error)
            })
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
    this.getClinicServices()
  },
  components: {
     addClinicalService: require('components/Settings/ClinicalService/AddClinicalService.vue').default,
      Dialog: require('components/Shared/Dialog/Dialog.vue').default
  }
}
</script>
