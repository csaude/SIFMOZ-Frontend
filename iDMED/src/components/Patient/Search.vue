<template>
  <div class="q-mt-lg">
    <TitleBar>Procurar ou adicionar Utentes/Pacientes</TitleBar>
    <div class="q-mx-xl">
      <div class="row">
        <q-space/>
        <q-select
          class="col-2 q-mt-md"
          dense outlined
          option-label="abbreviation"
          v-model="selectedDataSources"
          :options="dataSources"
          @update:model-value="loadHISDataSource()"
          label="Fonte de dados" />
      </div>
      <div class="row items-center q-my-md">
          <q-icon name="person_outline" size="sm"/>
          <span class="q-pl-sm text-subtitle2">Informação inicial</span>
      </div>
      <div class="row">
          <identifierInput
            @blur="search()"
            :rules="[]"
            v-model="currPatient.identifiers[0].value"/>
          <nameInput
            @update:model-value="search()"
            class="q-ml-md"
            label="Nome"
            :rules="[]"
            :readonly="this.selectedDataSources.id.length > 4"
            v-model="currPatient.firstNames"/>
          <TextField
            @update:model-value="search()"
            label="Outros Nomes"
            v-model="currPatient.middleNames"
            dense
            :rules="[]"
            :readonly="this.selectedDataSources.id.length > 4"
            class="col q-ml-md"/>
          <lastNameInput
            label="Apelido"
            :rules="[]"
            :readonly="this.selectedDataSources.id.length > 4"
            @update:model-value="search()"
            v-model="currPatient.lastNames"
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
          <q-table
            class="col"
            dense
            :rows="patients"
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
                <q-td key="identifier" :props="props">
                  {{props.row.preferedIdentifierValue()}}
                </q-td>
                <q-td key="name" :props="props">
                  {{props.row.fullName}}
                </q-td>
                <q-td key="age" :props="props">
                  {{props.row.age()}}
                </q-td>
                <q-td key="gender" :props="props">
                  {{props.row.gender}}
                </q-td>
                <q-td key="options" :props="props">
                  <div class="col">
                    <q-btn flat round v-if="!(this.selectedDataSources.id.length > 4)"
                    color="amber-8"
                    icon="edit"
                    @click="editPatient(props.row)">
                    <q-tooltip class="bg-amber-5">Editar</q-tooltip>
                  </q-btn>

                  <q-btn flat round v-if="!(this.selectedDataSources.id.length > 4)"
                    class="q-ml-md"
                    color="green-8"
                    icon="person_search"
                    @click="goToPatientPanel(props.row)">
                    <q-tooltip class="bg-green-5">Visualizar</q-tooltip>
                  </q-btn>

                  <q-btn flat round v-if="this.selectedDataSources.id.length > 4"
                    class="q-ml-md"
                    color="green-8"
                    icon="file_download"
                    @click="saveOpenMRSPatient(props.row)">
                    <q-tooltip class="bg-green-5">Carregar</q-tooltip>
                  </q-btn>
                  </div>
                </q-td>
              </q-tr>
            </template>
        </q-table>
        <div class="q-mt-md"></div>
      </div>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
          <q-btn class="q-mb-xl q-mr-xl" fab color="primary" icon="add" @click="showPatientRegister = true, newPatient = true"/>
      </q-page-sticky>
      <q-dialog persistent v-model="showPatientRegister">
          <patientRegister
            :newPatient="newPatient"
            :selectedPatient="currPatient"
            :clinic="currClinic"
            @close="showPatientRegister = false" />
      </q-dialog>
  </div>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'
import { SessionStorage, useQuasar, QSpinnerBall } from 'quasar'
import Duration from 'src/store/models/Duration/Duration'
import Province from 'src/store/models/province/Province'
import District from 'src/store/models/district/District'
import ClinicalServiceAttributeType from 'src/store/models/ClinicalServiceAttributeType/ClinicalServiceAttributeType'
import ClinicalService from 'src/store/models/ClinicalService/ClinicalService'
import ClinicSector from 'src/store/models/clinicSector/ClinicSector'
import IdentifierType from 'src/store/models/identifierType/IdentifierType'
import EpisodeType from 'src/store/models/episodeType/EpisodeType'
import FacilityType from 'src/store/models/facilityType/FacilityType'
import StartStopReason from 'src/store/models/startStopReason/StartStopReason'
import ClinicalServiceAttribute from 'src/store/models/ClinicalServiceAttribute/ClinicalServiceAttribute'
import Drug from 'src/store/models/drug/Drug'
import TherapeuticRegimen from 'src/store/models/therapeuticRegimen/TherapeuticRegimen'
import TherapeuticLine from 'src/store/models/therapeuticLine/TherapeuticLine'
import Form from 'src/store/models/form/Form'
import Doctor from 'src/store/models/doctor/Doctor'
import DispenseType from 'src/store/models/dispenseType/DispenseType'
import RAMScreening from 'src/store/models/screening/RAMScreening'
import AdherenceScreening from 'src/store/models/screening/AdherenceScreening'
import PregnancyScreening from 'src/store/models/screening/PregnancyScreening'
import TBScreening from 'src/store/models/screening/TBScreening'
import VitalSignsScreening from 'src/store/models/screening/VitalSignsScreening'
import InteroperabilityType from 'src/store/models/interoperabilityType/InteroperabilityType'
import InteroperabilityAttribute from 'src/store/models/interoperabilityAttribute/InteroperabilityAttribute'
import HealthInformationSystem from 'src/store/models/healthInformationSystem/HealthInformationSystem'
import Pack from 'src/store/models/packaging/Pack'
import Prescription from 'src/store/models/prescription/Prescription'
import Episode from 'src/store/models/episode/Episode'
import PatientVisitDetails from 'src/store/models/patientVisitDetails/PatientVisitDetails'
import PatientVisit from 'src/store/models/patientVisit/PatientVisit'
import PatientServiceIdentifier from 'src/store/models/patientServiceIdentifier/PatientServiceIdentifier'
import PackagedDrug from 'src/store/models/packagedDrug/PackagedDrug'
import PrescribedDrug from 'src/store/models/prescriptionDrug/PrescribedDrug'
import PrescriptionDetail from 'src/store/models/prescriptionDetails/PrescriptionDetail'
import Clinic from 'src/store/models/clinic/Clinic'
import Patient from 'src/store/models/patient/Patient'
const columns = [
 // { name: 'order', required: true, label: 'Ordem', align: 'left', sortable: true },
  { name: 'identifier', align: 'left', label: 'Identificador', sortable: false },
  { name: 'name', align: 'left', label: 'Nome', sortable: false },
  { name: 'age', align: 'center', label: 'Idade', sortable: false },
  { name: 'gender', align: 'left', label: 'Género', sortable: false },
  { name: 'options', align: 'left', label: 'Opções', sortable: false }
]
export default {
    data () {
       const $q = useQuasar()
      return {
        searchField: '',
        selected: ref([]),
        columns,
        $q,
        showPatientRegister: false,
        currPatient: new Patient({
          identifiers: [
            new PatientServiceIdentifier({})
          ]
        }),
        selectedDataSources: {
          id: 0,
          abbreviation: 'SiDMED'
        },
        patients: [],
        newPatient: false,
        username: localStorage.getItem('hisUser'), // 'admin',
        password: localStorage.getItem('hisPass') // 'ESaudeMz321'
      }
    },
    methods: {
      init () {},
      search () {
        (this.selectedDataSources.id.length > 4) ? this.openMRSSerach(this.selectedDataSources) : this.localSearch()
      },
      editPatient (patient) {
        this.currPatient = Object.assign({}, patient)
        this.showPatientRegister = true
        this.newPatient = false
      },
      saveOpenMRSPatient (patient) {
        this.currPatient = Object.assign({}, patient)
        this.showPatientRegister = true
        this.newPatient = true
      },
      goToPatientPanel (selectedPatient) {
        SessionStorage.set('selectedPatient', selectedPatient)
        this.$router.push('/patientpanel')
      },
      filterPatient (patient) {
        return this.hasIdentifierLike(patient, this.currPatient) || this.stringContains(patient.firstNames, this.currPatient.firstNames) || this.stringContains(patient.middleNames, this.currPatient.middleNames) || this.stringContains(patient.lastNames, this.currPatient.lastNames)
      },
      hasIdentifierLike (patientToCheck, inputPatient) {
        if (patientToCheck.identifiers.length <= 0) return false

        let check = false
        Object.keys(patientToCheck.identifiers).forEach(function (k) {
          const id = patientToCheck.identifiers[k]
          if (this.stringContains(id.value, this.currPatient.identifiers[0].value)) {
            check = true
          }
        }.bind(this))
        return check
      },
      stringContains (stringToCheck, stringText) {
        if (stringText === '') return false
        return stringToCheck.toLowerCase().includes(stringText.toLowerCase())
      },
      loadAppParameters () {
        Duration.apiGetAll()
        Province.apiGetAll()
        District.apiGetAll()
        ClinicalServiceAttributeType.apiGetAll()
        ClinicalService.apiGetAll()
        ClinicSector.apiGetAll()
        IdentifierType.apiGetAll()
        EpisodeType.apiGetAll()
        FacilityType.apiGetAll()
        StartStopReason.apiGetAll()
        ClinicalServiceAttribute.apiGetAll()
        Drug.apiGetAll(0, 100)
        TherapeuticRegimen.apiGetAll()
        TherapeuticLine.apiGetAll()
        Form.apiGetAll()
        Doctor.apiFetchByClinicId(this.clinic.id)
        DispenseType.apiGetAll()
        Clinic.apiGetAll()
        RAMScreening.apiGetAll()
        AdherenceScreening.apiGetAll()
        PregnancyScreening.apiGetAll()
        TBScreening.apiGetAll()
        VitalSignsScreening.apiGetAll()
        InteroperabilityType.apiGetAll(0, 100)
        InteroperabilityAttribute.apiGetAll()
        HealthInformationSystem.apiGetAll()
      },
       getAllPacksOfClinic () {
        const offset = 0
        const max = 100
        this.doPackGet(this.clinic.id, offset, max)
      },
      getAllPrescriptionOfClinic () {
        const offset = 0
        const max = 100
        this.doPrescriptionkGet(this.clinic.id, offset, max)
      },
      getAllPatientVisitsOfClinic () {
        const offset = 0
        const max = 100
        this.doPatientVisitGet(this.clinic.id, offset, max)
      },
      getAlPatientVisitDetailsOfClinic () {
        const offset = 0
        const max = 100
        this.doPatientVisitDetailsGet(this.clinic.id, offset, max)
      },
      getAllPatientsOfClinic () {
        const offset = 0
        const max = 100
        this.doPatientGet(this.clinic.id, offset, max)
      },
      getAllIdentifiersOfClinic () {
        const offset = 0
        const max = 100
        this.doIdentifiersGet(this.clinic.id, offset, max)
      },
      getAllEpisodesOfClinic () {
        const offset = 0
        const max = 100
        this.doEpisodeGet(this.clinic.id, offset, max)
      },
      doPackGet (clinicId, offset, max) {
        Pack.apiGetAllByClinicId(clinicId, offset, max).then(resp => {
              // if (resp.response.data.length > 0) {
              //   offset = offset + max
              //   setTimeout(this.doPackGet(clinicId, offset, max), 2)
              // }
          }).catch(error => {
              console.log(error)
          })
      },
      doPrescriptionkGet (clinicId, offset, max) {
        Prescription.apiGetAllByClinicId(clinicId, offset, max).then(resp => {
              if (resp.response.data.length > 0) {
                offset = offset + max
                setTimeout(this.doPrescriptionkGet(clinicId, offset, max), 2)
              }
          }).catch(error => {
              console.log(error)
          })
      },
      doEpisodeGet (clinicId, offset, max) {
        Episode.apiGetAllByClinicId(clinicId, offset, max).then(resp => {
              if (resp.response.data.length > 0) {
                offset = offset + max
                setTimeout(this.doEpisodeGet(clinicId, offset, max), 2)
              }
          }).catch(error => {
              console.log(error)
          })
      },
      doPatientVisitDetailsGet (clinicId, offset, max) {
        PatientVisitDetails.apiGetAllByClinicId(clinicId, offset, max).then(resp => {
              if (resp.response.data.length > 0) {
                offset = offset + max
                setTimeout(this.doPatientVisitDetailsGet(clinicId, offset, max), 2)
              }
          }).catch(error => {
              console.log(error)
          })
      },
      doPatientGet (clinicId, offset, max) {
        Patient.apiGetAllByClinicId(clinicId, offset, max).then(resp => {
              if (resp.response.data.length > 0) {
                offset = offset + max
                setTimeout(this.doPatientGet(clinicId, offset, max), 2)
              }
          }).catch(error => {
              console.log(error)
          })
      },
      doPatientVisitGet (clinicId, offset, max) {
        PatientVisit.apiGetAllByClinicId(clinicId, offset, max).then(resp => {
              if (resp.response.data.length > 0) {
                offset = offset + max
                setTimeout(this.doPatientVisitGet(clinicId, offset, max), 2)
              }
          }).catch(error => {
              console.log(error)
          })
      },
      doIdentifiersGet (clinicId, offset, max) {
        PatientServiceIdentifier.apiGetAllByClinicId(clinicId, offset, max).then(resp => {
              if (resp.response.data.length > 0) {
                offset = offset + max
                setTimeout(this.doIdentifiersGet(clinicId, offset, max), 2)
              }
          }).catch(error => {
              console.log(error)
          })
      },
      getAllDataSources (offset) {
       if (offset >= 0) {
          HealthInformationSystem.api().get('/healthInformationSystem?offset=' + offset + '&max=100').then(resp => {
          offset = offset + 100
          if (resp.response.data.length > 0) {
            setTimeout(this.getAllDataSources(offset), 2)
            }
          }).catch(error => {
            console.log(error)
        })
       }
      },
      saveDefaultHIS () {
        HealthInformationSystem.create({
            data: { id: -1, abbreviation: 'SiDMED', description: 'SiDMED', active: true }
      })
      },
      loadHISDataSource () {
        this.patients = []
          this.$q.loading.show({
                message: 'Carregando ...',
                spinnerColor: 'grey-4',
                spinner: QSpinnerBall
        })
        if (this.selectedDataSources.id.length > 4) {
          this.checkOpenMRS(this.selectedDataSources)
        } else {
          this.$q.notify({
            color: 'positive',
            position: 'center',
            message: 'Pesquisa de Pacientes no SiDMED em funcionamento!!',
            icon: 'verified_user'
          })
           setTimeout(() => {
              this.$q.loading.hide()
            }, 400)
        }
      },
      localSearch () {
        this.patients = Patient.query()
                              .with(['identifiers.identifierType', 'identifiers.service.identifierType', 'identifiers.clinic.province'])
                              .with('province')
                              .with('attributes')
                              .with('appointments')
                              .with('district.*')
                              .with('postoAdministrativo')
                              .with('bairro')
                              .with(['clinic.province', 'clinic.district.province'])
                              .where((patient) => {
                                          return this.filterPatient(patient)
                                        })
                              .get()
      },
      openMRSSerach (his) {
        const openMRSInstance = axios.create({
          baseURL: 'http://localhost:8884'
        })
        console.log(his)
        const nid = this.currPatient.identifiers[0].value.replaceAll('/', '-')

        if (nid.length <= 0) {
            this.$q.notify({
            color: 'negative',
            position: 'center',
            message: 'Não contem nenhum parâmetro de pesquisa. Por favor, indtroduza um Nº de Identificador',
            icon: 'report_problem'
          })
        } else {
          openMRSInstance.get('/patient/openmrsSearch/' + his.id + '/' + nid + '/' + this.username + '/' + this.password)
                        .then((response) => {
                          this.patients = []
                          if (response.data.results.length > 0) {
                            response.data.results.forEach(pacienteOpenMRS => {
                            const localpatient = new Patient({
                                identifiers: []
                              })
                              this.patients.push(this.buildLocalPatientFromOpenMRS(localpatient, pacienteOpenMRS))
                            }
                            )
                          } else {
                                 this.$q.notify({
                                color: 'negative',
                                position: 'center',
                                message: 'Nenhum resultado encontrado para o identificador ' + nid + '',
                                icon: 'report_problem'
                              })
                          }
                        })
        }
      },
      checkOpenMRS (his) {
        console.log('HIS')
        const openMRSInstance = axios.create({
           baseURL: 'http://localhost:8884'
        })
        openMRSInstance.get('/patient/openmrsSession/' + his.id + '/' + this.username + '/' + this.password)
                       .then((response) => {
                         console.log(response)
                         if (response.data.authenticated === false || response.data.authenticated === undefined || response.data.authenticated === null) {
                            this.$q.notify({
                            color: 'negative',
                            position: 'center',
                            message: 'O Utilizador ' + this.username + ' não se encontra no OpenMRS ou serviço rest no OpenMRS não se encontra em funcionamento.',
                            icon: 'report_problem'
                          })
                         } else {
                           this.$q.notify({
                            color: 'positive',
                            position: 'center',
                            message: 'Pesquisa de Pacientes no OpenMRS em funcionamento!!',
                            icon: 'verified_user'
                          })
                         }
                       })
                      .catch((error) => {
                        if (String(error).includes('Network Error')) {
                            this.$q.notify({
                            color: 'negative',
                            position: 'center',
                            message: 'O Servidor OpenMRS encontra-se desligado ou existe um problema de conexão!',
                            icon: 'report_problem'
                          })
                        } else {
                          this.$q.notify({
                          color: 'negative',
                          position: 'center',
                          message: 'Falha inexperada, por favor contacte o adminitrador.',
                          icon: 'report_problem'
                        })
                        }
                      })
        setTimeout(() => {
            this.$q.loading.hide()
        }, 400)
      },
      buildPatientIdentifierFromOpenMRS (identifier) {
        const psi = new PatientServiceIdentifier()
              psi.startDate = new Date()
              psi.value = identifier
              psi.state = 'Activo'
              psi.prefered = true
              psi.service = ClinicalService.query().with('identifierType').where('code', 'TARV').first()
              psi.identifierType = ClinicalService.query().with('identifierType').where('code', 'TARV').first().identifierType
              psi.clinic = Clinic.query().with('province').where('id', SessionStorage.getItem('currClinic').id).first()
              return psi
      },
      buildLocalPatientFromOpenMRS (localpatient, pacienteOpenMRS) {
        const cellphoneObject = pacienteOpenMRS.person.attributes.find(attribute => attribute.attributeType.uuid === 'e2e3fd64-1d5f-11e0-b929-000c29ad1d07')
              localpatient.hisUuid = pacienteOpenMRS.uuid
              localpatient.his = (this.selectedDataSources.id.length > 4) ? this.selectedDataSources : null
              localpatient.hisLocation = pacienteOpenMRS.identifiers[0].location.uuid
              localpatient.hisLocationName = pacienteOpenMRS.identifiers[0].location.display
              localpatient.firstNames = pacienteOpenMRS.person.names[0].givenName
              localpatient.middleNames = pacienteOpenMRS.person.names[0].middleName
              localpatient.lastNames = pacienteOpenMRS.person.names[0].familyName
              localpatient.gender = pacienteOpenMRS.person.gender === 'M' ? 'Masculino' : 'Feminino'
              localpatient.dateOfBirth = pacienteOpenMRS.person.birthdate
              localpatient.identifiers.push(this.buildPatientIdentifierFromOpenMRS(pacienteOpenMRS.identifiers[0].identifier))
              localpatient.cellphone = (cellphoneObject !== null && cellphoneObject !== undefined) ? cellphoneObject.value : ''
              localpatient.address = pacienteOpenMRS.person.addresses[0].address5
              // localpatient.addressReference = pacienteOpenMRS.person.names[0]
              localpatient.province = Province.query().where('description', pacienteOpenMRS.person.addresses[0].countyDistrict).first()
              // localpatient.district = localpatient.district.province
              // localpatient.postoAdministrativo_id = pacienteOpenMRS.person.names[0]
              // localpatient.bairro_id = pacienteOpenMRS.person.names[0]
              // localpatient.clinic_id = pacienteOpenMRS.person.names[0]
              return localpatient
      }
    },
    computed: {
      clinic () {
        return new Clinic(SessionStorage.getItem('currClinic'))
      },
      dataSources () {
        return HealthInformationSystem.query()
                                      .with('interoperabilityAttributes.*')
                                      .where('active', true).all()
      }
    },
    created () {
      this.init()
    },
    mounted () {
      this.saveDefaultHIS()
      this.getAllDataSources(0)
      this.loadAppParameters()
      this.getAllPatientsOfClinic()
      this.getAllIdentifiersOfClinic()
      this.getAllPrescriptionOfClinic()
      this.getAllEpisodesOfClinic()
      this.getAllPatientVisitsOfClinic()
      this.getAllPacksOfClinic()
      this.getAlPatientVisitDetailsOfClinic()
      PackagedDrug.apiGetAll()
      PrescribedDrug.apiGetAll()
      PrescriptionDetail.apiGetAll()
    },
    components: {
        TitleBar: require('components/Shared/TitleBar.vue').default,
        patientRegister: require('components/Patient/Register/PatientRegister.vue').default,
        nameInput: require('components/Patient/Inputs/PatientNameInput.vue').default,
        identifierInput: require('components/Patient/Inputs/PatientIdentifierInput.vue').default,
        TextField: require('components/Shared/Input/TextField.vue').default,
        lastNameInput: require('components/Patient/Inputs/PatientLastNameInput.vue').default
    }
}
</script>

<style>

</style>
