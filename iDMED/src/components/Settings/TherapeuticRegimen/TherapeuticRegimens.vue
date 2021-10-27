<template>
    <div>
    <div class="row q-py-lg q-mt-md text-weight-bold text-subtitle1">
         Regime Terapeutico
        </div>
        <div class="">
                 <!-- <nationalClinicsTable  :rows="getNationalClinicos" :columns="columns"  :showNationalClinicRegistrationScreen="showNationalClinicRegistrationScreen" /> -->
        <q-table
     :rows="therapeuticRegimens"
      :columns="columns"
      :filter="filter"
      v-model:pagination="pagination"
      :rows-per-page-options="[0]"
      virtual-scroll>
        <template v-slot:top-right>
            <q-input outlined dense debounce="300" v-model="filter" placeholder="Procurar">
            <template v-slot:append>
                <q-icon name="search" />
            </template>
                </q-input>
        </template>
        <template v-slot:body="props">
            <q-tr :props="props">
            <q-td key="regimenScheme" :props="props">
                {{ props.row.regimenScheme }}
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
                   @click="editTherapeuticRegimen(props.row)">
                    <q-tooltip class="bg-amber-5">Editar</q-tooltip>
                  </q-btn>

                  <q-btn flat round
                    class="q-ml-md"
                    color="green-8"
                    icon="search"
                    @click="visualizeTherapeuticRegimen(props.row)">
                    <q-tooltip class="bg-green-5">Visualizar</q-tooltip>
                      </q-btn>
                     <q-btn flat round
                      class="q-ml-md"
                      color="red"
                      icon="delete"
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
                <q-btn size="xl" fab icon="add" @click="addTherapeuticRegimen" color="primary" />
             </q-page-sticky>
        </div>
          <q-dialog persistent v-model="showTherapeuticRegimenRegistrationScreen">
          <AddTherapeuticRegimen
          :selectedTherapeuticRegimen="therapeuticRegimen"
          :onlyView="viewMode"
            @close="showTherapeuticRegimenRegistrationScreen = false" />
      </q-dialog>
    </div>
</template>
<script>
import { useQuasar } from 'quasar'
import TherapeuticRegimen from '../../../store/models/therapeuticRegimen/TherapeuticRegimen'
// import TherapeuticRegimensDrug from '../../../store/models/therapeuticRegimen/TherapeuticRegimensDrug'

const columns = [
  { name: 'regimenScheme', required: true, label: 'Esquema do Regime', align: 'left', field: row => row.regimenScheme, format: val => `${val}`, sortable: true },
  { name: 'description', required: true, label: 'Descricao', align: 'left', field: row => row.description, format: val => `${val}`, sortable: true },
   { name: 'active', required: true, label: 'Activo', align: 'left', field: row => row.active, format: val => `${val}`, sortable: true },
  { name: 'options', align: 'left', label: 'Opções', sortable: false }
]
export default {
  data () {
    const $q = useQuasar()

    return {
        columns,
        $q,
         showTherapeuticRegimenRegistrationScreen: false,
         viewMode: false
    }
  },
 computed: {
      therapeuticRegimens () {
             return TherapeuticRegimen.query().with('drugs.form').get()
      }
  },
  methods: {
  async  getTherapeuticRegimens () {
          await TherapeuticRegimen.api().get('/therapeuticRegimen')
       },
       editTherapeuticRegimen (therapeuticRegimen) {
         this.viewMode = false
        this.therapeuticRegimen = Object.assign({}, therapeuticRegimen)
         this.showTherapeuticRegimenRegistrationScreen = true
      },
        addTherapeuticRegimen () {
      //    this.therapeuticRegimens.drugs.forEach((drug) => {
 // console.log(drug.pivot)
 // })
          this.viewMode = false
          this.therapeuticRegimen = new TherapeuticRegimen()
         this.showTherapeuticRegimenRegistrationScreen = true
      },
       visualizeTherapeuticRegimen (therapeuticRegimen) {
          this.therapeuticRegimen = Object.assign({}, therapeuticRegimen)
         this.viewMode = true
           this.showTherapeuticRegimenRegistrationScreen = true
      },
         promptToConfirm (therapeuticRegimen) {
            this.$q.dialog({ title: 'Confirm', message: 'Deseja Inactivar o Regime?', cancel: true, persistent: true }).onOk(() => {
              therapeuticRegimen.active = false
            TherapeuticRegimen.api().patch('/therapeuticRegimen/' + therapeuticRegimen.id, therapeuticRegimen).then(resp => {
                this.$emit('therapeuticRegimen', resp.response.data)
            }).catch(error => {
              console.log(therapeuticRegimen.id)
                console.log(error)
            })
        })
      }
  },
  mounted () {
   // const offset = 0
    this.getTherapeuticRegimens()
   // this.getAllForms(offset)
  },
  components: {
    AddTherapeuticRegimen: require('components/Settings/TherapeuticRegimen/AddTherapeuticRegimen.vue').default
  //   nationalClinicsTable: require('components/Settings/NationalClinic/NationalClinicsTable.vue').default
  }
}
</script>
