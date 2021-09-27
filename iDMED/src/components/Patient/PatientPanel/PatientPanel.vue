<template>
  <div>
    <TitleBar>Detalhe do Utente/Paciente</TitleBar>
    <div class="row q-mt-md">
      <div class="col-3 q-pa-md q-pl-lg q-ml-lg q-mr-lg panel">
        <PatientInfo :selectedPatient="patient"/>
      </div>
      <div class="col q-mr-lg">
        <ClinicServiceInfo :selectedPatient="patient" :identifiers="patient.identifiers" class="q-mb-lg"/>
        <PrescriptionInfo :selectedPatient="patient" class="q-mb-lg"/>
        <PharmaceuticalAtentionInfo />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['selectedPatient'],
  setup () {
    return {
      patient: {
        clinic: {},
        firstNames: 'Jose',
        middleNames: 'Antonio',
        fullName: 'Jose Antonio Silva',
        lastName: 'Silva',
        dateOfBirth: '2021/09/30',
        gender: 'Masculino',
        cellphone: '856326987',
        alternativeCellphone: '826532985',
        address: 'Q.12, Rua 12, Casa 4',
        addressReference: 'Substação',
        identifiers: [
          {
            episodes: [
              {
                id: 1,
                startDate: '20/02/2020',
                notes: 'Novo Paciente',
                stopDate: '',
                episodeType: {
                  code: 'NOVO_PACIENTE',
                  description: 'Novo Paciente'
                },
                startStopReason: {
                  isStartReason: true,
                  reason: 'Inicio do Tratamento'
                },
                clinicSector: {
                  code: 'SECTOR_NORMAL',
                  description: 'Atendimento Normal'
                },
                patientVisitDetails: [
                  {
                    pack: {
                      id: '1f75ea6a-1716-11ec-9621-0242ac130002',
                      packDate: '',
                      pickupDate: '',
                      dateReceived: '',
                      dateLeft: '',
                      weeksSupply: '',
                      packagedDrugs: []
                    },
                    patientVisit: {
                      id: '144d856c-1716-11ec-9621-0242ac130002',
                      visitDate: '20/05/2020'
                    },
                    prescription: {
                      id: '2dabc316-1716-11ec-9621-0242ac130002',
                      prescribedDrugs: [
                        {
                          drug: {
                            id: '08S40-833-b26a-4996-8066-48847431404a',
                            name: '[EFV] Efavirenz 50mg'
                          }
                        },
                        {
                          drug: {
                            id: '08S18Z-da-b787-4fa1-a2d6-2fda22da6564',
                            name: '[LPV/RTV] Lopinavir/Ritonavir 200mg/50mg'
                          }
                        }
                      ],
                      prescriptionDate: '',
                      duration: ''
                    },
                    id: 'fa928ce4-1715-11ec-9621-0242ac130002'
                  }
                ],
                patientProgramIdentifier: {
                  id: 1,
                  startDate: '30/05/2020',
                  value: '0120010101/0203/00365',
                  prefered: true,
                  endDate: '',
                  reopenDate: '',
                  clinicalService: {
                    code: 'TARV',
                    description: 'TARV'
                  }
                }
              }
            ],
            clinicalService: {
              code: 'TARV',
              description: 'TARV',
              currPatientVisitDetail: {},
              attributes: [
                {
                  id: '',
                  clinicalServiceAttributeType: {
                    id: '51ca91d2-19fa-11ec-9621-0242ac130002',
                    code: 'THERAPEUTICAL_REGIMEN',
                    description: 'Regime Terapêutico'
                  }
                },
                {
                  id: '',
                  clinicalServiceAttributeType: {
                    id: '5856b454-19fa-11ec-9621-0242ac130002',
                    code: 'THERAPEUTICAL_LINE',
                    description: 'Linha Terapêutica'
                  }
                },
                {
                  id: '',
                  clinicalServiceAttributeType: {
                    id: '644ac570-19fa-11ec-9621-0242ac130002',
                    code: 'PATIENT_TYPE',
                    description: 'Tipo Paciente'
                  }
                },
                {
                  id: '',
                  clinicalServiceAttributeType: {
                    id: 'c4f434dc-19fb-11ec-9621-0242ac130002',
                    code: 'PRESCRIPTION_CHANGE_MOTIVE',
                    description: 'Motivo da alteração'
                  }
                }
              ],
              therapeuticRegimens: [
                {
                  id: '5044237e-ceba-4dc8-8368-bc54c5c82b84',
                  description: 'TDF+ABC+LPV/r',
                  regimenDrugs: []
                },
                {
                  id: '6097bea4-dbf6-4fca-aee8-00a71e49e4ec',
                  description: 'TDF+AZT+3TC+LPV/r',
                  regimenDrugs: []
                }
              ]
            },
            id: 1,
            startDate: '30/05/2020',
            value: '0120010101/0203/00365',
            prefered: true,
            endDate: '',
            reopenDate: ''
          },
          {
            episodes: [
              {
                id: 2,
                startDate: '20/02/2020',
                notes: 'Novo Paciente',
                stopDate: '',
                episodeType: {
                  code: 'NOVO_PACIENTE',
                  description: 'Novo Paciente'
                },
                startStopReason: {
                  isStartReason: true,
                  reason: 'Inicio do Tratamento'
                },
                clinicSector: {
                  code: 'SECTOR_NORMAL',
                  description: 'Atendimento Normal'
                },
                patientVisitDetails: [
                  {
                    pack: {
                      id: '528671fe-1716-11ec-9621-0242ac130002',
                      packDate: '',
                      pickupDate: '',
                      dateReceived: '',
                      dateLeft: '',
                      weeksSupply: '',
                      packagedDrugs: []
                    },
                    patientVisit: {
                      id: '691b871a-1716-11ec-9621-0242ac130002',
                      visitDate: ''
                    },
                    prescription: {
                      id: '60daad4c-1716-11ec-9621-0242ac130002',
                      prescribedDrugs: [
                      {
                        drug: {
                          id: '08S23Z-cd-22ff-4993-9378-335cf43bd5c8',
                          name: '[[ATV/RTV] Atazanavir 300mg/Ritonavir 100mg '
                        }
                      },
                      {
                        drug: {
                          id: '08S18Z-da-b787-4fa1-a2d6-2fda22da6564',
                          name: '[LPV/RTV] Lopinavir/Ritonavir 200mg/50mg'
                        }
                      }
                    ]
                    },
                    id: 'd7cfa5fc-1715-11ec-9621-0242ac130002'
                  }
                ],
                patientProgramIdentifier: {
                  id: 2,
                  startDate: '30/05/2020',
                  value: '0120010101/0203/00365',
                  prefered: false,
                  endDate: '',
                  reopenDate: '',
                  clinicalService: {
                    code: 'TB',
                    description: 'TB'
                  }
                }
              }
            ],
            clinicalService: {
              code: 'TB',
              description: 'TB',
              currPatientVisitDetail: {},
              attributes: [
                {
                  id: '',
                  clinicalServiceAttributeType: {
                    id: '51ca91d2-19fa-11ec-9621-0242ac130002',
                    code: 'THERAPEUTICAL_REGIMEN',
                    description: 'Regime Terapêutico'
                  }
                },
                {
                  id: '',
                  clinicalServiceAttributeType: {
                    id: '644ac570-19fa-11ec-9621-0242ac130002',
                    code: 'PATIENT_TYPE',
                    description: 'Tipo Paciente'
                  }
                },
                {
                  id: '',
                  clinicalServiceAttributeType: {
                    id: 'c4f434dc-19fb-11ec-9621-0242ac130002',
                    code: 'PRESCRIPTION_CHANGE_MOTIVE',
                    description: 'Motivo da alteração'
                  }
                }
              ],
              therapeuticRegimens: [
                {
                  id: '7dbbd087-c9df-4465-9188-cc10b3c23e35',
                  description: 'ABC+3TC+RAL',
                  regimenDrugs: []
                },
                {
                  id: '78419317-cdda-42e9-92a3-13cb0cbf0020',
                  description: 'ABC+3TC+EFV',
                  regimenDrugs: []
                }
              ]
            },
            id: 2,
            startDate: '30/05/2020',
            value: '0120010101/0203/00365',
            prefered: false,
            endDate: '',
            reopenDate: ''
          }
        ]
      }
    }
  },
  computed: {
  },
  components: {
      TitleBar: require('components/Shared/TitleBar.vue').default,
      PatientInfo: require('components/Patient/PatientPanel/PatientInfo.vue').default,
      ClinicServiceInfo: require('components/Patient/PatientPanel/ClinicServicesInfo.vue').default,
      PrescriptionInfo: require('components/Patient/PatientPanel/PrescriptionInfo.vue').default,
      PharmaceuticalAtentionInfo: require('components/Patient/PatientPanel/PharmaceuticalAtentionInfo.vue').default
  },
  created () {
      // this.patient = Object.assign({}, this.selectedPatient)
  }
}
</script>

<style lang="scss">
  .panel {
    border: 1px solid $grey-13;
    border-radius: 10px
  }
</style>
