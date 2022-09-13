<template>
<div>
  <ListHeader
    :addVisible="showAddButton"
    :mainContainer="true"
    bgColor="bg-primary"
    @expandLess="expandLess"
    @showAdd="selectedVisitDetails='', step='', showAddPrescription = true">Prescrição
  </ListHeader>
  <div v-show="infoVisible">
    <EmptyList v-if="patientHasNoPrescriptio" >Nenhuma Prescrição Adicionada</EmptyList>
  <div v-if="flagGo" >
    <span
      v-for="identifier in patient.identifiers" :key="identifier.id" >
      <PrescriptionInfoContainer
        :identifier="identifier"
        @addNewPack="addNewPack"
        @editPack="editPack"/>
    </span>
  </div>

  <q-dialog persistent v-model="showAddPrescription" full-width>
      <AddEditPrescription
        :patient="selectedPatient"
        :selectedVisitDetails="selectedVisitDetails"
        :step="step"
        @close="showAddPrescription = false" />
  </q-dialog>
  </div>
</div>
</template>

<script>
import { SessionStorage, QSpinnerBall, useQuasar } from 'quasar'
import Patient from '../../../store/models/patient/Patient'
import Episode from '../../../store/models/episode/Episode'
import PatientVisitDetails from '../../../store/models/patientVisitDetails/PatientVisitDetails'
import Pack from '../../../store/models/packaging/Pack'
import Prescription from '../../../store/models/prescription/Prescription'
export default {
  props: ['selectedPatient'],
  data () {
    return {
      showAddPrescription: false,
      infoVisible: true,
      selectedVisitDetails: '',
      step: '',
      flagGoReady: false,
      $q: useQuasar()
    }
  },
  methods: {
    showloading () {
       this.$q.loading.show({
          spinner: QSpinnerBall,
          spinnerColor: 'gray',
          spinnerSize: 140,
          message: 'Carregando, aguarde por favor...',
          messageColor: 'white'
        })
    },
    hideLoading () {
      this.$q.loading.hide()
    },
    init () {
      if (this.identifiers.length <= 0) {
            this.flagGoReady = true
      } else {
        this.identifiers.forEach(identifier => {
          Episode.apiGetAllByIdentifierId(identifier.id).then(resp => {
            if (resp.response.data.length > 0) {
              console.log(resp.response.data)
              this.identifiers.episodes = resp.response.data
              this.identifiers.episodes.forEach(episode => {
                PatientVisitDetails.apiGetLastByEpisodeId(episode.id).then(resp => {
                  console.log(resp.response.data)
                  if (resp.response.data) {
                    episode.patientVisitDetails[0] = resp.response.data
                    this.loadVisitDetailsInfo(episode.patientVisitDetails, 0)
                  } else this.flagGoReady = true
                })
              })
            } else {
              this.flagGoReady = true
            }
          })
        })
      }
    },
    loadVisitDetailsInfo (visitDetails, i) {
      if (visitDetails[i] !== undefined && visitDetails[i] !== null) {
        Prescription.apiFetchById(visitDetails[i].prescription.id).then(resp => {
          console.log(resp.response.data)
          visitDetails[i].prescription = resp.response.data
          if (visitDetails[i].pack !== null) {
            Pack.apiFetchById(visitDetails[i].pack.id).then(resp => {
              console.log(resp.response.data)
              visitDetails[i].pack = resp.response.data
              this.flagGoReady = true
            })
          } else {
            this.flagGoReady = true
          }
        })
      } else {
        this.flagGoReady = true
      }
    },
    checkPrescription () {
      const hasPresc = this.patient.identifiers.some((identifier) => {
        if (identifier.episodes.length > 0) {
          identifier.episodes.some((episode) => {
            return episode.patientVisitDetails.length > 0
          })
        } else {
          return false
        }
        return false
      })
      return hasPresc
    },
    expandLess (value) {
      this.infoVisible = !value
    },
    addNewPack (patientVisitDetails) {
      this.selectedVisitDetails = patientVisitDetails
      this.step = 'addNewPack'
      this.showAddPrescription = true
    },
    editPack (patientVisitDetails) {
      this.selectedVisitDetails = patientVisitDetails
      this.step = 'editPack'
      this.showAddPrescription = true
    }
  },
  created () {
    this.showloading()
    this.init()
  },
  mounted () {
  },
  watch: {
    flagGoReady: function (newVal, oldVal) {
      if (newVal) {
        console.log(newVal)
        this.hideLoading()
      }
    }
  },
  computed: {
    flagGo: {
      get () {
        return this.flagGoReady
      },
      set (value) {
        this.flagGoReady = value
      }
    },
    patientHasNoPrescriptio () {
      if (this.patient.identifiers.length <= 0) return true
      return !this.patientHasEpisodes && !this.flagGo
    },
    showAddButton () {
      return this.patientHasEpisodes
    },
    hasPrescription () {
      return this.checkPrescription()
    },
    identifiers () {
      return this.patient.identifiers
    },
    patientHasEpisodes () {
      return this.patient.hasEpisodes()
    },
    patient: {
      get () {
        const selectedP = new Patient(SessionStorage.getItem('selectedPatient'))
      return Patient.query().with('identifiers.*')
                            .with('province')
                            .with('attributes')
                            .with('appointments')
                            .with('district')
                            .with('postoAdministrativo')
                            .with('bairro')
                            .with('clinic')
                            .where('id', selectedP.id).first()
      }
    }
  },
  components: {
      AddEditPrescription: require('components/Patient/PatientPanel/AddEditPrescription.vue').default,
      ListHeader: require('components/Shared/ListHeader.vue').default,
      EmptyList: require('components/Shared/ListEmpty.vue').default,
      PrescriptionInfoContainer: require('components/Patient/Prescription/PrescriptionInfoContainer.vue').default
  }
}
</script>

<style>

</style>
