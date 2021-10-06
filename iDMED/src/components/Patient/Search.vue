<template>
  <div class="q-mt-lg">
    <TitleBar>Procurar ou adicionar Utentes/Pacientes</TitleBar>
    <div class="q-mx-xl">
      <div class="row">
        <q-space/>
        <q-select
          class="col-2 q-mt-md"
          dense outlined
          v-model="selectedDataSources"
          :options="dataSources"
          label="Fonte de dados" />
      </div>
      <div class="row items-center q-my-md">
          <q-icon name="person_outline" size="sm"/>
          <span class="q-pl-sm text-subtitle2">Informação inicial</span>
      </div>
      <div class="row">
          <identifierInput v-model="currPatient.identifiers[0].value"/>
          <nameInput class="q-ml-md" v-model="currPatient.firstNames"/>
          <TextField label="Outros Nomes" v-model="currPatient.middleNames" dense class="col q-ml-md"/>
          <lastNameInput v-model="currPatient.lastNames" class="q-ml-md"/>
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
            <template #body="props">
              <q-tr :props="props">
                <q-td key="order" :props="props">
                </q-td>
                <q-td key="identifier" :props="props">
                  {{props.row.preferedIdentifier().value}}
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
                    <q-btn flat round
                    color="amber-8"
                    icon="edit"
                    @click="editPatient(props.row)">
                    <q-tooltip class="bg-amber-5">Editar</q-tooltip>
                  </q-btn>

                  <q-btn flat round
                    class="q-ml-md"
                    color="green-8"
                    icon="person_search"
                    @click="goToPatientPanel(props.row)">
                    <q-tooltip class="bg-green-5">Visualizar</q-tooltip>
                  </q-btn>
                  </div>
                </q-td>
              </q-tr>
            </template>
        </q-table>
        <div class="q-mt-md"></div>
      </div>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
          <q-btn class="q-mb-xl q-mr-xl" fab color="primary" icon="add" @click="showPatientRegister = true"/>
      </q-page-sticky>
      <q-dialog persistent v-model="showPatientRegister">
          <patientRegister
            :selectedPatient="currPatient"
            :clinic="currClinic"
            @close="showPatientRegister = false" />
      </q-dialog>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { SessionStorage } from 'quasar'
import Patient from '../../store/models/patient/Patient.js'
import PatientServiceIdentifier from '../../store/models/patientServiceIdentifier/PatientServiceIdentifier.js'
import Episode from '../../store/models/episode/Episode.js'
import EpisodeType from '../../store/models/episodeType/EpisodeType.js'
import StartStopReason from '../../store/models/startStopReason/StartStopReason.js'
import ClinicSector from '../../store/models/clinicSector/ClinicSector.js'
import Pack from '../../store/models/packaging/Pack.js'
import PatientVisit from '../../store/models/patientVisit/PatientVisit.js'
import Prescription from '../../store/models/prescription/Prescription.js'
import Drug from '../../store/models/drug/Drug.js'
import PatientVisitDetails from '../../store/models/patientVisitDetails/PatientVisitDetails.js'
import ClinicalService from '../../store/models/ClinicalService/ClinicalService.js'
import ClinicalServiceAttribute from '../../store/models/ClinicalServiceAttribute/ClinicalServiceAttribute.js'
import ClinicalServiceAttributeType from '../../store/models/ClinicalServiceAttributeType/ClinicalServiceAttributeType.js'
import TherapeuticRegimen from '../../store/models/therapeuticRegimen/TherapeuticRegimen.js'
import PrescribedDrug from '../../store/models/prescriptionDrug/PrescribedDrug.js'
import PrescriptionDetail from '../../store/models/prescriptionDetails/PrescriptionDetail.js'
import TherapeuticLine from '../../store/models/therapeuticLine/TherapeuticLine.js'
import DispenseType from '../../store/models/dispenseType/DispenseType.js'
const columns = [
  { name: 'order', required: true, label: 'Ordem', align: 'left', sortable: true },
  { name: 'identifier', align: 'left', label: 'Identificador', sortable: false },
  { name: 'name', align: 'left', label: 'Nome', sortable: false },
  { name: 'age', align: 'center', label: 'Idade', sortable: false },
  { name: 'gender', align: 'left', label: 'Género', sortable: false },
  { name: 'options', align: 'left', label: 'Opções', sortable: false }
]
export default {
    data () {
      return {
        searchField: '',
        selected: ref([]),
        columns,
        showPatientRegister: false,
        currPatient: new Patient({
          identifiers: [
            new PatientServiceIdentifier({})
          ]
        }),
        dataSources: [
          'SiDMED',
          'OpenMRS'
        ],
        selectedDataSources: 'SiDMED',
        patients: [
          new Patient({
            id: 'fa84b596-1c7f-11ec-9621-0242ac130002',
            clinic: {},
            firstNames: 'Jose',
            middleNames: 'Antonio',
            lastNames: 'Silva',
            dateOfBirth: '2001/09/30',
            gender: 'Masculino',
            cellphone: '856326987',
            alternativeCellphone: '826532985',
            address: 'Q.12, Rua 12, Casa 4',
            addressReference: 'Substação',
            identifiers: [
              new PatientServiceIdentifier({
                id: 'da9e9288-1c7f-11ec-9621-0242ac130002',
                startDate: '30/05/2020',
                value: '0120010101/0203/00365',
                prefered: false
              }),
              new PatientServiceIdentifier({
                id: '9c4b5036-1c87-11ec-9621-0242ac130002',
                startDate: '30/05/2020',
                value: '0120010101/0203/55555',
                prefered: true
              })
            ]
          }),
          new Patient({
            id: 'f18979d6-1c7f-11ec-9621-0242ac130002',
            clinic: {},
            firstNames: 'Sandra',
            middleNames: 'Felismina',
            lastNames: 'Santos',
            dateOfBirth: '2003/09/30',
            gender: 'Femenino',
            cellphone: '856326987',
            alternativeCellphone: '826532985',
            address: 'Q.12, Rua 12, Casa 4',
            addressReference: 'Substação',
            identifiers: [
              new PatientServiceIdentifier({
                id: 'e78d3c60-1c7f-11ec-9621-0242ac130002',
                startDate: '30/05/2020',
                value: '0120000101/0222/00332',
                prefered: true
              })
            ]
          }),
          new Patient({
            clinic: {},
            firstNames: 'Jose',
            middleNames: 'Antonio',
            lastNames: 'Silva',
            dateOfBirth: '1985/09/30',
            gender: 'Masculino',
            cellphone: '856326987',
            alternativeCellphone: '826532985',
            address: 'Q.12, Rua 12, Casa 4',
            addressReference: 'Substação',
            identifiers: [
              new PatientServiceIdentifier({
                episodes: [
                  new Episode({
                    id: 1,
                    startDate: '2020/02/25',
                    notes: 'Novo Paciente',
                    stopDate: '',
                    episodeType: new EpisodeType({
                      code: 'NOVO_PACIENTE',
                      description: 'Novo Paciente'
                    }),
                    startStopReason: new StartStopReason({
                      isStartReason: true,
                      reason: 'Inicio do Tratamento'
                    }),
                    clinicSector: new ClinicSector({
                      code: 'SECTOR_NORMAL',
                      description: 'Atendimento Normal'
                    }),
                    patientVisitDetails: [
                      new PatientVisitDetails({
                        pack: new Pack({
                          id: '1f75ea6a-1716-11ec-9621-0242ac130002',
                          packDate: '',
                          pickupDate: '',
                          dateReceived: '',
                          dateLeft: '',
                          weeksSupply: '',
                          packagedDrugs: []
                        }),
                        patientVisit: new PatientVisit({
                          id: '144d856c-1716-11ec-9621-0242ac130002',
                          visitDate: '2020/07/20'
                        }),
                        prescription: new Prescription({
                          id: '2dabc316-1716-11ec-9621-0242ac130002',
                          prescribedDrugs: [
                            {
                              drug: new Drug({
                                id: '08S40-833-b26a-4996-8066-48847431404a',
                                name: '[EFV] Efavirenz 50mg'
                              })
                            },
                            {
                              drug: new Drug({
                                id: '08S18Z-da-b787-4fa1-a2d6-2fda22da6564',
                                name: '[LPV/RTV] Lopinavir/Ritonavir 200mg/50mg'
                              })
                            }
                          ],
                          prescriptionDate: '',
                          duration: '',
                          prescriptionDetail: new PrescriptionDetail({
                            therapeuticLine: new TherapeuticLine({
                              description: '1 Linha'
                            }),
                            therapeuticRegimen: new TherapeuticRegimen({
                              description: 'DTG+3TC+TLD'
                            }),
                            dispenseType: new DispenseType({
                              description: 'Trimestral'
                            })
                          })
                        }),
                        id: 'fa928ce4-1715-11ec-9621-0242ac130002'
                      })
                    ]
                  }),
                  new Episode({
                    id: 1,
                    startDate: '2020/01/01',
                    notes: 'Novo Paciente',
                    stopDate: '2020/02/01',
                    episodeType: new EpisodeType({
                      code: 'NOVO_PACIENTE',
                      description: 'Novo Paciente'
                    }),
                    startStopReason: new StartStopReason({
                      isStartReason: true,
                      reason: 'Inicio do Tratamento'
                    }),
                    clinicSector: new ClinicSector({
                      code: 'SECTOR_NORMAL',
                      description: 'Atendimento Normal'
                    }),
                    patientVisitDetails: [
                    ]
                  })
                ],
                clinicalService: new ClinicalService({
                  code: 'TARV',
                  description: 'TARV',
                  currPatientVisitDetail: {},
                  attributes: [
                    new ClinicalServiceAttribute({
                      id: '',
                      clinicalServiceAttributeType: new ClinicalServiceAttributeType({
                        id: '51ca91d2-19fa-11ec-9621-0242ac130002',
                        code: 'THERAPEUTICAL_REGIMEN',
                        description: 'Regime Terapêutico'
                      })
                    }),
                    new ClinicalServiceAttribute({
                      id: '',
                      clinicalServiceAttributeType: new ClinicalServiceAttributeType({
                        id: '5856b454-19fa-11ec-9621-0242ac130002',
                        code: 'THERAPEUTICAL_LINE',
                        description: 'Linha Terapêutica'
                      })
                    }),
                    new ClinicalServiceAttribute({
                      id: '',
                      clinicalServiceAttributeType: new ClinicalServiceAttributeType({
                        id: '644ac570-19fa-11ec-9621-0242ac130002',
                        code: 'PATIENT_TYPE',
                        description: 'Tipo Paciente'
                      })
                    }),
                    new ClinicalServiceAttribute({
                      id: '',
                      clinicalServiceAttributeType: new ClinicalServiceAttributeType({
                        id: 'c4f434dc-19fb-11ec-9621-0242ac130002',
                        code: 'PRESCRIPTION_CHANGE_MOTIVE',
                        description: 'Motivo da alteração'
                      })
                    })
                  ],
                  therapeuticRegimens: [
                    new TherapeuticRegimen({
                      id: '5044237e-ceba-4dc8-8368-bc54c5c82b84',
                      description: 'TDF+ABC+LPV/r',
                      regimenDrugs: []
                    }),
                    new TherapeuticRegimen({
                      id: '6097bea4-dbf6-4fca-aee8-00a71e49e4ec',
                      description: 'TDF+AZT+3TC+LPV/r',
                      regimenDrugs: []
                    })
                  ]
                }),
                id: 1,
                startDate: '2020/06/20',
                value: '0120010101/0203/00365',
                prefered: true,
                endDate: '',
                reopenDate: ''
              }),
              new PatientServiceIdentifier({
                episodes: [
                  new Episode({
                    id: 2,
                    startDate: '2020/02/20',
                    notes: 'Novo Paciente',
                    stopDate: '',
                    episodeType: new EpisodeType({
                      code: 'NOVO_PACIENTE',
                      description: 'Novo Paciente'
                    }),
                    startStopReason: new StartStopReason({
                      isStartReason: true,
                      reason: 'Inicio do Tratamento'
                    }),
                    clinicSector: new ClinicalService({
                      code: 'SECTOR_NORMAL',
                      description: 'Atendimento Normal'
                    }),
                    patientVisitDetails: [
                      new PatientVisitDetails({
                        pack: new Pack({
                          id: '528671fe-1716-11ec-9621-0242ac130002',
                          packDate: '',
                          pickupDate: '',
                          dateReceived: '',
                          dateLeft: '',
                          weeksSupply: '',
                          packagedDrugs: []
                        }),
                        patientVisit: new PatientVisit({
                          id: '691b871a-1716-11ec-9621-0242ac130002',
                          visitDate: '2020/03/20'
                        }),
                        prescription: new Prescription({
                          id: '60daad4c-1716-11ec-9621-0242ac130002',
                          prescriptionDetail: new PrescriptionDetail({
                            therapeuticRegimen: new TherapeuticRegimen({
                              description: 'DTG+3TC+TLD'
                            }),
                            dispenseType: new DispenseType({
                              description: 'Trimestral'
                            })
                          }),
                          prescribedDrugs: [
                          new PrescribedDrug({
                            drug: new Drug({
                              id: '08S23Z-cd-22ff-4993-9378-335cf43bd5c8',
                              name: '[[ATV/RTV] Atazanavir 300mg/Ritonavir 100mg '
                            })
                          }),
                          new PrescribedDrug({
                            drug: new Drug({
                              id: '08S18Z-da-b787-4fa1-a2d6-2fda22da6564',
                              name: '[LPV/RTV] Lopinavir/Ritonavir 200mg/50mg'
                            })
                          })
                        ]
                        }),
                        id: 'd7cfa5fc-1715-11ec-9621-0242ac130002'
                      })
                    ]
                  })
                ],
                clinicalService: new ClinicalService({
                  code: 'TB',
                  description: 'TB',
                  currPatientVisitDetail: {},
                  attributes: [
                    new ClinicalServiceAttribute({
                      id: '',
                      clinicalServiceAttributeType: new ClinicalServiceAttributeType({
                        id: '51ca91d2-19fa-11ec-9621-0242ac130002',
                        code: 'THERAPEUTICAL_REGIMEN',
                        description: 'Regime Terapêutico'
                      })
                    }),
                    new ClinicalServiceAttribute({
                      id: '',
                      clinicalServiceAttributeType: new ClinicalServiceAttributeType({
                        id: '644ac570-19fa-11ec-9621-0242ac130002',
                        code: 'PATIENT_TYPE',
                        description: 'Tipo Paciente'
                      })
                    }),
                    new ClinicalServiceAttribute({
                      id: '',
                      clinicalServiceAttributeType: new ClinicalServiceAttributeType({
                        id: 'c4f434dc-19fb-11ec-9621-0242ac130002',
                        code: 'PRESCRIPTION_CHANGE_MOTIVE',
                        description: 'Motivo da alteração'
                      })
                    })
                  ],
                  therapeuticRegimens: [
                    new TherapeuticRegimen({
                      id: '7dbbd087-c9df-4465-9188-cc10b3c23e35',
                      description: 'ABC+3TC+RAL',
                      regimenDrugs: []
                    }),
                    new TherapeuticRegimen({
                      id: '78419317-cdda-42e9-92a3-13cb0cbf0020',
                      description: 'ABC+3TC+EFV',
                      regimenDrugs: []
                    })
                  ]
                }),
                id: 2,
                startDate: '2020/05/30',
                value: '0120010101/0203/00365',
                prefered: false,
                endDate: '',
                reopenDate: ''
              })
            ]
          })
        ]
      }
    },
    methods: {
      search () {
      },
      editPatient (patient) {
        this.currPatient = Object.assign({}, patient)
        this.showPatientRegister = true
      },
      goToPatientPanel (selectedPatient) {
        SessionStorage.set('selectedPatient', selectedPatient)
        this.$router.push('/patientpanel')
      }
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
