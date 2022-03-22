<template>
  <q-card style="width: 900px; max-width: 90vw;">
        <form @submit.prevent="submitForm" >
            <q-card-section class="q-pa-none bg-green-2">
              <div class="row items-center text-subtitle1 q-pa-md">
                <q-icon  :name="patient.gender == 'Feminino' ? 'female' : 'male'" size="md" color="primary"/>
                <div class="text-bold text-grey-10 q-ml-sm">{{patient.fullName}}</div>
                <div class="text-grey-10 q-ml-sm"><span class="text-bold text-h6">|</span> {{patient.gender}}</div>
                <div class="text-grey-10 q-ml-sm"><span class="text-bold text-h6">|</span> {{patient.age()}} Anos</div>
              </div>
              <q-separator/>
            </q-card-section>
            <div class="text-center text-h6 q-mt-sm">
              <span v-if="isEditStep">Actualizar</span>
              <span v-if="isCreateStep">Adicionar</span>
              <span v-if="isCloseStep">Fechar</span>
              <span v-if="isReOpenStep">Reabrir</span>
              Serviço de Saúde
            </div>
            <div class="q-mx-lg">
              <div class="q-mt-lg">
                  <div class="row items-center q-mb-sm">
                      <span class="text-subtitle2">Dados do serviço de Saúde</span>
                  </div>
                  <q-separator color="grey-13" size="1px" class="q-mb-sm"/>
              </div>
              <div class="row q-mt-md">
                  <q-select
                    class="col"
                    dense outlined
                    ref="clinicalService"
                    :rules="[ val => !!val || 'Por favor indicar o serviço de saúde']"
                    :disable="isCloseStep || isReOpenStep"
                    v-model="identifier.service"
                    :options="clinicalServices"
                    @blur="reloadIdentifierTypeMask"
                    option-value="id"
                    option-label="code"
                    label="Serviço de Saúde *" />

                  <q-input
                      dense
                      outlined
                      class="col q-ml-md"
                      v-model="identifierstartDate"
                      :disable="isCloseStep || isReOpenStep"
                      ref="startDate"
                      label="Data de Admissão *">
                      <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                              <q-date v-model="identifierstartDate" mask="DD-MM-YYYY" >
                              <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                              </div>
                              </q-date>
                          </q-popup-proxy>
                          </q-icon>
                      </template>
                  </q-input>
                  <q-select
                    class="col q-ml-md"
                    dense
                    outlined
                    ref="state"
                    :rules="[ val => !!val || 'Por favor indicar o estado']"
                    :disable="isCloseStep || isReOpenStep"
                    v-model="identifier.state"
                    :options="estados"
                    label="Estado *" />
              </div>

              <span v-if="!isCloseStep && !isReOpenStep">
                <div class="q-mt-md">
                  <div class="row items-center q-mb-sm">
                      <span class="text-subtitle2">Dados do Identificador</span>
                  </div>
                  <q-separator color="grey-13" size="1px" class="q-mb-sm"/>
                </div>

                <div class="row q-mb-md">
                    <div v-if="isCreateStep && patient.identifiers.length > 0 && identifier.id === null" class="col"  tabindex="0"> Assumir Identificador Anterior?
                        <q-radio keep-color color="primary" v-model="usePreferedId" v-bind:val="true" label="Sim" />
                        <q-radio keep-color color="primary" v-model="usePreferedId" v-bind:val="false" label="Nao"/>
                    </div>
                </div>
                <div class="row" v-if="!usePreferedId">
                    <identifierInput
                      ref="identifier"
                      label="Nr. do Identificador *"
                      :disable="identifier.service === null"
                      :mask="identifierTypeMask"
                      fill-mask
                      :rules="[ val => !!val || 'Por favor indicar o identificador']"
                      v-model="identifier.value"/>
                    <div v-if="identifier" class="col q-ml-md"  tabindex="0"> Preferido?
                      <q-radio keep-color color="primary" v-model="identifier.prefered" v-bind:val="true" label="Sim" />
                      <q-radio keep-color color="primary" v-model="identifier.prefered" v-bind:val="false" label="Nao"/>
                    </div>
                </div>
              </span>
              <span v-if="isCloseStep">
                <div class="q-mt-md">
                  <div class="row items-center q-mb-sm">
                      <span class="text-subtitle2">Dados de Fim do serviço de Saúde</span>
                  </div>
                  <q-separator color="grey-13" size="1px" class="q-mb-sm"/>
                </div>
                <div class="row">
                  <q-input
                      dense
                      outlined
                      class="col"
                      v-model="endDate"
                      ref="endDate"
                      label="Data de Fim *">
                      <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                              <q-date v-model="endDate" mask="DD-MM-YYYY" >
                              <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                              </div>
                              </q-date>
                          </q-popup-proxy>
                          </q-icon>
                      </template>
                    </q-input>
                    <q-select
                      class="col q-ml-md"
                      dense outlined
                      ref="stopReason"
                      :rules="[ val => !!val || 'Por favor indicar a nota de fim']"
                      v-model="closureEpisode.startStopReason"
                      :options="stopReasons"
                      option-value="id"
                      option-label="reason"
                      label="Notas de Fim [Referência, Transferido para, ...] *" />
                    <q-select
                    v-show="false"
                      class="col q-ml-md"
                      dense outlined
                      :options="pharmacies"
                      option-value="id"
                      option-label="name"
                      label="Farmácia de [Referência, Transferncia]" />
                </div>
                <div class="row">
                    <TextInput
                      v-model="closureEpisode.notes"
                      label="Outras notas de fim *"
                      ref="closingNotes"
                      :rules="[ val => !!val || 'Por favor indicar outras notas do fim']"
                      dense
                      class="col" />
                </div>
              </span>

              <span v-if="isReOpenStep">
                <div class="q-mt-md">
                  <div class="row items-center q-mb-sm">
                      <span class="text-subtitle2">Dados de Reabertura do serviço de Saúde</span>
                  </div>
                  <q-separator color="grey-13" size="1px" class="q-mb-sm"/>
                </div>
                <div class="row">
                  <q-input
                      dense
                      outlined
                      class="col"
                      v-model="reOpenDate"
                      ref="reOpenDate"
                      label="Data de Reabertura *">
                      <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                              <q-date v-model="reOpenDate" mask="DD-MM-YYYY" >
                              <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                              </div>
                              </q-date>
                          </q-popup-proxy>
                          </q-icon>
                      </template>
                    </q-input>
                    <q-select
                      class="col q-ml-md"
                      dense outlined
                      ref="reOpenReason"
                      :rules="[ val => !!val || 'Por favor indicar a nota de reabertura']"
                      v-model="closureEpisode.startStopReason"
                      :options="startReasons"
                      option-value="id"
                      option-label="reason"
                      label="Notas de Reabertura *" />
                    <TextInput
                      v-model="closureEpisode.notes"
                      label="Outras notas *"
                      ref="reOpenNotes"
                      :rules="[ val => !!val || 'Por favor indicar outras notas do fim']"
                      dense
                      class="col q-ml-md" />
                </div>
              </span>
            </div>
           <q-card-actions align="right" class="q-mb-md q-mr-sm">
                <q-btn label="Cancelar" color="red" @click="$emit('close')"/>
                <q-btn
                  type="submit"
                  :loading="submitting"
                  label="Submeter"
                  color="primary" >
                  <template v-slot:loading>
                    <q-spinner-facebook />
                  </template>
                </q-btn>
            </q-card-actions>
        </form>
        <q-dialog v-model="alert.visible">
          <Dialog :type="alert.type" @closeDialog="closeDialog" @commitOperation="commitOperation">
            <template v-slot:title> Informação</template>
            <template v-slot:msg> {{alert.msg}} </template>
          </Dialog>
        </q-dialog>
    </q-card>
</template>

<script>
import { SessionStorage } from 'quasar'
import { ref } from 'vue'
import Patient from '../../../store/models/patient/Patient'
import PatientServiceIdentifier from '../../../store/models/patientServiceIdentifier/PatientServiceIdentifier'
import ClinicalService from '../../../store/models/ClinicalService/ClinicalService'
import ClinicSector from '../../../store/models/clinicSector/ClinicSector'
import Clinic from '../../../store/models/clinic/Clinic'
import IdentifierType from '../../../store/models/identifierType/IdentifierType'
import Episode from '../../../store/models/episode/Episode'
import EpisodeType from '../../../store/models/episodeType/EpisodeType'
import StartStopReason from '../../../store/models/startStopReason/StartStopReason'
import moment from 'moment'
export default {
    props: ['identifierToEdit', 'selectedPatient', 'step'],
    data () {
      const submitting = ref(false)
        return {
          submitting,
            alert: ref({
                type: '',
                visible: false,
                msg: ''
              }),
            identifierstartDate: '',
            identifier: new PatientServiceIdentifier(),
            closureEpisode: new Episode(),
            estados: ['Activo', 'Inactivo'],
            endDate: '',
            reOpenDate: '',
            usePreferedId: false,
            identifierTypeMask: ''
        }
    },
    methods: {
      init () {
        this.identifier.patient = Patient.find(this.patient.id)
      },
      reloadIdentifierTypeMask () {
        console.log(this.identifier.service.identifierType)
        if (this.identifier.service !== null) {
          this.identifierTypeMask = this.identifier.service.identifierType.pattern
        }
        console.log(this.identifier.service.identifierType.pattern)
      },
      submitForm () {
        this.submitting = true
        if (this.isCloseStep) {
          this.$refs.stopReason.validate()
          this.$refs.closingNotes.$refs.ref.validate()
              if (!this.$refs.stopReason.hasError &&
              !this.$refs.closingNotes.$refs.ref.hasError) {
              const episode = Episode.query()
                                      .with('startStopReason')
                                      .with('patientServiceIdentifier')
                                      .with('patientVisitDetails.*')
                                      .whereHas('episodeType', (query) => {
                                            query.where('code', 'INICIO')
                                          })
                                      .where('patientServiceIdentifier_id', this.identifier.id)
                                      .orderBy('creationDate', 'desc')
                                      .first()
              if (this.getJSDateFromDDMMYYY(this.endDate) > new Date()) {
                this.displayAlert('error', 'A data de fim indicada é maior que a data da corrente.')
              } else if (episode !== null && this.getJSDateFromDDMMYYY(this.endDate) < new Date(episode.episodeDate)) {
                this.displayAlert('error', 'A data de fim indicada é menor que a data de inicio ao tratamento.')
              } else if (episode !== null && episode.hasVisits() && (this.getJSDateFromDDMMYYY(this.endDate) < new Date(episode.lastVisit().lastPack().pickupDate))) {
                this.displayAlert('error', 'A data de fim indicada é menor que a data da ultima visita efectuada pelo paciente.')
              } else {
                this.doSave()
              }
          }
        } else if (this.isReOpenStep) {
          this.$refs.reOpenReason.validate()
          this.$refs.reOpenNotes.$refs.ref.validate()
              if (!this.$refs.reOpenReason.hasError &&
              !this.$refs.reOpenNotes.$refs.ref.hasError) {
              const episode = Episode.query()
                                      .with('startStopReason')
                                      .whereHas('episodeType', (query) => {
                                            query.where('code', 'FIM')
                                          })
                                      .where('patientServiceIdentifier_id', this.identifier.id)
                                      .orderBy('creationDate', 'desc')
                                      .first()
              if (this.getJSDateFromDDMMYYY(this.reOpenDate) > new Date()) {
                this.displayAlert('error', 'A data de abertura indicada é maior que a data da corrente.')
              } else if (this.getJSDateFromDDMMYYY(this.reOpenDate) < new Date(episode.episodeDate)) {
                this.displayAlert('error', 'A data de abertura indicada é menor que a data do ultimo fecho efectuado.')
              } else {
                this.doSave()
              }
          }
        } else if (this.isCreateStep || this.isEditStep) {
          this.$refs.clinicalService.validate()
          this.$refs.state.validate()
          if (!this.usePreferedId) {
            console.log(this.usePreferedId)
            this.$refs.identifier.$refs.identifier.validate()
          } else {
            this.identifier.prefered = false
          }
          if (!this.$refs.clinicalService.hasError &&
              !this.$refs.state.hasError) {
                console.log(this.usePreferedId)
              if (this.getJSDateFromDDMMYYY(this.identifierstartDate) > new Date()) {
                this.displayAlert('error', 'A data de admissão indicada é maior que a data corrente.')
              } else if (this.getJSDateFromDDMMYYY(this.identifierstartDate) < new Date(this.selectedPatient.dateOfBirth)) {
                this.displayAlert('error', 'A data de admissão indicada é menor que a data de nascimento do paciente/utente.')
              } else if (!this.usePreferedId && this.identifier.value === '') {
                this.displayAlert('error', 'Por favor indicar o identificador.')
              } else {
                if (this.isEditStep) {
                  const episode = Episode.query()
                                        .with('startStopReason')
                                        .where('patientServiceIdentifier_id', this.identifier.id)
                                        .orderBy('creationDate', 'desc')
                                        .first()
                  if (episode !== null && (this.getJSDateFromDDMMYYY(this.identifierstartDate) > new Date(episode.episodeDate))) {
                    this.displayAlert('error', 'A data de admissão indicada é maior que a data do primeiro episódio registado.')
                  } else if (this.hasVisitsMade && (this.identifier.service.id !== this.identifierToEdit.service.id)) {
                    this.displayAlert('error', 'Não pode alterar o serviço de saúde pois ja existem registos de visitas associados.')
                  } else if (this.patient.hasPreferedId() && this.identifier.prefered) {
                    this.displayAlert('confirmation', 'O identificador neste momento em associação passará a ser considerado como preferido, deseja continuar neste modo?')
                  } else {
                    this.doSave()
                  }
                } else if (this.patient.hasPreferedId() && this.identifier.prefered) {
                    this.displayAlert('confirmation', 'O identificador neste momento em associação passará a ser considerado como preferido, deseja continuar neste modo?')
                } else {
                  this.doSave()
                }
              }
            }
        }
        this.submitting = false
      },
      lastStartEpisodeWithPrescription () {
        let episode = null
        const episodes = Episode.query()
                                .with('startStopReason')
                                .with('clinicSector')
                                .with('patientServiceIdentifier')
                                .with('patientVisitDetails.*')
                                .whereHas('episodeType', (query) => {
                                      query.where('code', 'INICIO')
                                    })
                                .where('patientServiceIdentifier_id', this.identifier.id)
                                .orderBy('creationDate', 'desc')
                                .get()
        if (episodes.length <= 0) return null

        Object.keys(episodes).forEach(function (k) {
          const id = episodes[k]
          if (episode === null && id.hasVisits()) {
            episode = id
          }
        })
        return episode
      },
      canEditIdentifier () {
        const identifier = PatientServiceIdentifier.query()
                                                  .with(['clinic.province', 'clinic.district.province'])
                                                  .with('episodes.patientVisitDetails')
                                                  .where('id', this.identifierToEdit.id)
                                                  .first()
        return identifier.canBeEdited()
      },
      async doSave () {
        this.identifier.episodes = []
        if (this.isCloseStep) {
          this.closureEpisode.episodeType = EpisodeType.query().where('code', 'FIM').first()
          this.closureEpisode.episodeDate = this.getJSDateFromDDMMYYY(this.endDate)
          this.identifier.endDate = this.getJSDateFromDDMMYYY(this.endDate)
        }
        if (this.isReOpenStep) {
          this.closureEpisode.episodeType = EpisodeType.query().where('code', 'INICIO').first()
          this.closureEpisode.episodeDate = this.getJSDateFromDDMMYYY(this.reOpenDate)
          this.identifier.reopenDate = this.getJSDateFromDDMMYYY(this.reOpenDate)
          this.identifier.endDate = ''
        }
        if (this.isCloseStep || this.isReOpenStep) {
          this.closureEpisode.creationDate = new Date()
          this.closureEpisode.clinic = this.currClinic
          this.closureEpisode.clinicSector = this.lastEpisode.clinicSector
          this.closureEpisode.clinicSector.clinic = this.currClinic

          this.identifier.episodes.push(this.closureEpisode)
        }
        if (this.isCreateStep) {
          this.identifier.clinic = this.currClinic
          this.identifier.startDate = this.getJSDateFromDDMMYYY(this.identifierstartDate)
          this.identifier.identifierType = this.identifier.service.identifierType
        }
        console.log(this.identifier)
        await PatientServiceIdentifier.apiSave(this.identifier).then(resp => {
          this.identifier.id = resp.response.data.id
          if (this.isReOpenStep || this.isCloseStep) {
            this.fetchUpdatedIdentifier(resp.response.data.id)
          }
          let msg = ''
          if (this.isCloseStep) {
            msg = 'Serviço de saúde fechado com sucesso.'
          } else if (this.isCreateStep) {
            msg = 'Serviço de saúde adicionado com sucesso.'
          } else if (this.isEditStep) {
            this.identifier.id = resp.response.data.id
            msg = 'Serviço de saúde actualizado com sucesso.'
          } else if (this.isReOpenStep) {
            msg = 'Serviço de saúde reaberto com sucesso.'
          }
          this.displayAlert('info', msg)
        }).catch(error => {
          const listErrors = []
          if (error.request.response != null) {
            const arrayErrors = JSON.parse(error.request.response)
            if (arrayErrors.total == null) {
              listErrors.push(arrayErrors.message)
            } else {
              arrayErrors._embedded.errors.forEach(element => {
                listErrors.push(element.message)
              })
            }
          }
          this.displayAlert('error', listErrors)
        })
      },
      async fetchUpdatedIdentifier (id) {
        await PatientServiceIdentifier.apiFetchById(id).then(resp => {
          console.log(resp.response.data)
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
          console.log('closing dialog')
          this.$emit('close')
        }
      },
      commitOperation () {
        this.doSave()
      },
      getJSDateFromDDMMYYY (dateString) {
        const dateParts = dateString.split('-')
        return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0])
      },
      getDDMMYYYFromJSDate (jsDate) {
        return moment(jsDate).format('DD-MM-YYYY')
      }
    },
    created () {
        if (!this.isCreateStep) {
          this.identifier = Object.assign({}, this.identifierToEdit)
          this.identifier.clinic = this.currClinic
          this.identifierstartDate = this.getDDMMYYYFromJSDate(this.identifier.startDate)
          this.identifier.service = ClinicalService.query()
                                                  .with('identifierType')
                                                  .where('id', this.identifier.service.id)
                                                  .first()
        }
    },
    mounted () {
      console.log(this.patient)
      this.init()
    },
    computed: {
      patient: {
        get () {
          return Patient.query()
            .with('identifiers.*')
            .with('province')
            .with('attributes')
            .with('appointments')
            .with('district')
            .with('postoAdministrativo')
            .with('bairro')
            .with('clinic')
            .where('id', SessionStorage.getItem('selectedPatient').id).first()
        }
      },
      hasVisitsMade () {
        return this.lastStartEpisodeWithPrescription() !== null
      },
      canEdit () {
        return this.canEditIdentifier()
      },
      clinicalServices () {
        return ClinicalService.query().with('identifierType').has('code').get()
      },
      clinicSerctors () {
        return ClinicSector.query().with('clinic').where('clinic_id', this.currClinic.id).get()
      },
      currClinic () {
        return Clinic.query().with('province').where('id', SessionStorage.getItem('currClinic').id).first()
      },
      identifierTypes () {
        return IdentifierType.all()
      },
      isCloseStep () {
        return this.step === 'close'
      },
      isEditStep () {
        return this.step === 'edit'
      },
      isCreateStep () {
        return this.step === 'create'
      },
      isReOpenStep () {
        return this.step === 'reOpen'
      },
      pharmacies () {
        return Clinic.query().with('province').where('mainClinic', false).get()
      },
      stopReasons () {
        return StartStopReason.query()
                              .where('isStartReason', false).get()
      },
      startReasons () {
        return StartStopReason.query()
                              .where('isStartReason', true).get()
      },
      lastEpisode: {
        get () {
          return Episode.query()
                      .withAll()
                      .where('patientServiceIdentifier_id', this.patient.PatientServiceIdentifier.id)
                      .orderBy('creationDate', 'desc')
                      .first()
        }
      }
    },
    components: {
      TextInput: require('components/Shared/Input/TextField.vue').default,
      Dialog: require('components/Shared/Dialog/Dialog.vue').default,
      identifierInput: require('components/Patient/Inputs/PatientIdentifierInput.vue').default
    }
}
</script>

<style>

</style>
