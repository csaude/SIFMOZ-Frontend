<template>
  <div class="q-mt-lg">
    <TitleBar>Procurar ou adicionar Grupo</TitleBar>
    <div class="q-mx-xl">
      <div class="row items-center q-my-md">
          <q-icon name="person_outline" size="sm"/>
          <span class="q-pl-sm text-subtitle2">Informação inicial</span>
      </div>
      <div class="row">
        <TextField
            @update:model-value="search()"
            label="Numero do grupo"
            v-model="curGroup.code"
            style="witdth: 350px"
            dense
            :rules="[]"/>
          <TextField
            @update:model-value="search()"
            label="Nome"
            v-model="curGroup.name"
            dense
            :rules="[]"
            style="witdth: 450px"
            class="q-ml-md"/>
      </div>
      <div class="q-mt-lg q-mb-md">
          <div class="row items-center q-mb-md">
              <q-icon name="search" size="sm"/>
              <span class="q-pl-sm text-subtitle2">Resultado da Pesquisa</span>
          </div>
          <q-separator color="grey-13" size="1px"/>
      </div>
      <div>
        <q-scroll-area style="height: 460px">
          <q-table
              class="col"
              dense
              :rows="searchResults"
              :columns="columns"
              row-key="id"
              >
              <template v-slot:no-data="{ icon, filter }">
                <div class="full-width row flex-center text-primary q-gutter-sm text-body2">
                  <span>
                    Sem resultados para visualizar
                  </span>
                  <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
                </div>
              </template>
              <template #body="props">
                <q-tr :props="props">
                  <!--q-td key="order" :props="props">
                  </q-td-->
                  <q-td key="code" :props="props">
                    {{props.row.code}}
                  </q-td>
                  <q-td key="name" :props="props">
                    {{props.row.name}}
                  </q-td>
                  <q-td key="groupType" :props="props">
                    {{props.row.groupType.description}}
                  </q-td>
                  <q-td key="service" :props="props">
                    {{props.row.service.code}}
                  </q-td>
                  <q-td key="options" :props="props">
                    <div class="col">
                      <q-btn flat round
                      color="primary"
                      icon="groups"
                      @click="openGroup(props.row)">
                      <q-tooltip class="bg-primary">Visualizar</q-tooltip>
                    </q-btn>

                    </div>
                  </q-td>
                </q-tr>
              </template>
          </q-table>
        </q-scroll-area>
      </div>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
          <q-btn class="q-mb-xl q-mr-xl" fab color="primary" icon="add" @click="showGroupRegister = true"/>
      </q-page-sticky>
    </div>
    <q-dialog persistent v-model="showGroupRegister">
          <groupRegister
            :step="step"
            @close="showGroupRegister = false" />
      </q-dialog>
  </div>
</template>

<script>
import { ref } from 'vue'
import Group from '../../store/models/group/Group'
import Clinic from '../../store/models/clinic/Clinic'
import { SessionStorage } from 'quasar'
import Patient from '../../store/models/patient/Patient'
import GroupType from '../../store/models/groupType/GroupType'
import ClinicalService from '../../store/models/ClinicalService/ClinicalService'
import Episode from '../../store/models/episode/Episode'
import PatientVisitDetails from '../../store/models/patientVisitDetails/PatientVisitDetails'
import Prescription from '../../store/models/prescription/Prescription'
import Pack from '../../store/models/packaging/Pack'
const columns = [
  { name: 'code', align: 'left', label: 'Número do grupo', sortable: false },
  { name: 'name', align: 'left', label: 'Nome', sortable: false },
  { name: 'groupType', align: 'center', label: 'Tipo', sortable: false },
  { name: 'service', align: 'left', label: 'Serviço de Saúde', sortable: false },
  { name: 'options', align: 'left', label: 'Opções', sortable: false }
]
export default {
  data () {
    return {
      selected: ref([]),
      columns,
      showGroupRegister: false,
      curGroup: new Group(),
      step: 'create',
      searchResults: ref([])
    }
  },
  methods: {
    init () {
      GroupType.apiGetAll()
      ClinicalService.apiGetAll()
      // this.getAllPatientsOfClinic()
      this.getAllGroupsOfClinic()
    },
    search () {
      const groups = Group.query()
                          .with('groupType')
                          .with('service')
                          .get()
      this.searchResults = groups.filter((group) => {
        return this.stringContains(group.code, this.curGroup.code) || this.stringContains(group.name, this.curGroup.name)
      })
    },
    openGroup (group) {
      SessionStorage.set('selectedGroup', group)
      // pull all selected group info
      this.$router.push('/group/panel')
    },
    getAllGroupsOfClinic () {
      const offset = 0
      const max = 100
      this.doGroupsGet(this.clinic.id, offset, max)
    },
    getAllPatientsOfClinic () {
      const offset = 0
      const max = 100
      this.doPatientGet(this.clinic.id, offset, max)
    },
    loadPatientInfo () {
      const patientList = Patient.query().with('identifiers.episodes').get()
      patientList.forEach((patient) => {
        patient.identifiers.forEach((identifier) => {
          Episode.apiGetAllByIdentifierId(identifier.id, 0, 200)
          identifier.episodes.forEach((episode) => {
            PatientVisitDetails.apiGetAllByEpisodeId(episode.id, 0, 300).then(resp => {
              resp.response.data.forEach((pvd) => {
                Prescription.apiFetchById(pvd.prescription.id)
                Pack.apiFetchById(pvd.pack.id)
              })
            })
          })
        })
      })
    },
    doPatientGet (clinicId, offset, max) {
      Patient.apiGetAllByClinicId(clinicId, offset, max).then(resp => {
          if (resp.response.data.length > 0) {
            offset = offset + max
            setTimeout(this.doPatientGet(clinicId, offset, max), 2)
          } else {
            this.loadPatientInfo()
          }
        }).catch(error => {
            console.log(error)
        })
    },
    doGroupsGet (clinicId, offset, max) {
      Group.apiGetAllByClinicId(clinicId, offset, max).then(resp => {
            if (resp.response.data.length > 0) {
              offset = offset + max
              setTimeout(this.doGroupsGet(clinicId, offset, max), 2)
            }
        }).catch(error => {
            console.log(error)
        })
    },
    stringContains (stringToCheck, stringText) {
      if (stringText === '') return false
      return stringToCheck.toLowerCase().includes(stringText.toLowerCase())
    }
  },
  mounted () {
    this.init()
  },
  components: {
    TitleBar: require('components/Shared/TitleBar.vue').default,
    TextField: require('components/Shared/Input/TextField.vue').default,
    groupRegister: require('components/Groups/AddEditGroup.vue').default
  },
  computed: {
    clinic () {
      return new Clinic(SessionStorage.getItem('currClinic'))
    }
  }
}
</script>

<style>

</style>
