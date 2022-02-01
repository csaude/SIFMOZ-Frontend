<template>
  <q-card style="width: 900px; max-width: 90vw;">
        <form @submit.prevent="submitForm" >
            <q-card-section >
              <div class="row items-center text-subtitle1">
                <q-icon  :name="patient.gender == 'Feminino' ? 'female' : 'male'" size="md" color="primary"/>
                <div class="text-bold text-grey-10 q-ml-sm">{{patient.fullName}}</div>
                <div class="text-grey-10 q-ml-sm"><span class="text-bold text-h6">|</span> {{patient.gender}}</div>
                <div class="text-grey-10 q-ml-sm"><span class="text-bold text-h6">|</span> {{patient.age()}} Anos</div>
              </div>
              <q-separator/>
            </q-card-section>
            <div class="text-center text-h6">
              <span v-if="episodeToEdit.id !== null">Actualizar</span>
              <span v-else>Adicionar</span>
              Episódio
            </div>
            <div class="q-mx-lg">
              <div class="q-mt-lg">
                  <div class="row items-center q-mb-sm">
                      <span class="text-subtitle2">Dados de início no serviço de Saúde</span>
                  </div>
                  <q-separator color="grey-13" size="1px" class="q-mb-sm"/>
              </div>
              <div class="row q-mt-md">
                  <q-select
                    class="col"
                    disable
                    dense outlined
                    v-model="identifier.service"
                    :options="options"
                    option-value="id"
                    option-label="description"
                    label="Serviço de Saúde" />

                  <q-input
                      dense
                      outlined
                      disable
                      class="col q-ml-md"
                      v-model="identifierstartDate"
                      ref="birthDate"
                      label="Data de Admissão">
                      <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                              <q-date v-model="identifier.startDate" mask="DD-MM-YYYY">
                              <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                              </div>
                              </q-date>
                          </q-popup-proxy>
                          </q-icon>
                      </template>
                  </q-input>

                  <q-select class="col q-ml-md"
                    dense outlined
                    v-model="episode.startStopReason"
                    :options="startReasons"
                    ref="startReason"
                    :rules="[ val => !!val || 'Por favor indicar a nota de início']"
                    option-value="id"
                    option-label="reason"
                    label="Notas de início *" />
              </div>
              <div class="row q-mt-md">
                  <q-select
                    class="col"
                    dense outlined
                    ref="clinicSerctor"
                    :rules="[ val => !!val || 'Por favor indicar o sector onde vai ocorrer o atendimento']"
                    v-model="episode.clinicSector"
                    :options="clinicSerctors"
                    option-value="id"
                    option-label="description"
                    label="Sector Clinico *" />
                  <q-input
                      dense
                      outlined
                      class="col q-ml-md"
                      v-model="startDate"
                      ref="startDate"
                      label="Data de Inicio *">
                      <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                              <q-date v-model="startDate" mask="DD-MM-YYYY">
                              <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                              </div>
                              </q-date>
                          </q-popup-proxy>
                          </q-icon>
                      </template>
                  </q-input>
                  <div class="col q-ml-md"/>
              </div>
              <span v-if="episode.id !== null">
                <div class="q-mt-md">
                  <div class="row items-center q-mb-sm">
                      <span class="text-subtitle2">Dados de Fim do Episódio</span>
                  </div>
                  <q-separator color="grey-13" size="1px" class="q-mb-sm"/>
                </div>
                <div class="row">
                  <q-input
                        dense
                        outlined
                        class="col"
                        v-model="stopDate"
                        ref="stopDate"
                        label="Data de Fim *">
                        <template v-slot:append>
                            <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                <q-date v-model="stopDate" mask="DD-MM-YYYY">
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
                      label="Notas de Fim" />

                      <TextInput
                        v-model="closureEpisode.notes"
                        label="Outras notas de fim"
                        ref="endNotes"
                        :rules="[ val => !!val || 'Por favor indicar a nota de fim']"
                        dense
                        class="col q-ml-md" />
                </div>
              </span>
            </div>
           <q-card-actions align="right" class="q-mb-md q-mr-sm">
                <q-btn label="Cancelar" color="red" @click="$emit('close')"/>
                <q-btn type="submit" label="Submeter" color="primary" />
            </q-card-actions>
        </form>
        <q-dialog v-model="alert.visible">
          <Dialog :type="alert.type" @closeDialog="closeDialog">
            <template v-slot:title> Informação</template>
            <template v-slot:msg> {{alert.msg}} </template>
          </Dialog>
        </q-dialog>
    </q-card>
</template>

<script>
import { ref } from 'vue'
import { date, SessionStorage } from 'quasar'
import Clinic from '../../../store/models/clinic/Clinic'
import ClinicSector from '../../../store/models/clinicSector/ClinicSector'
import Episode from '../../../store/models/episode/Episode'
import Patient from '../../../store/models/patient/Patient'
import PatientServiceIdentifier from '../../../store/models/patientServiceIdentifier/PatientServiceIdentifier'
import EpisodeType from '../../../store/models/episodeType/EpisodeType'
import StartStopReason from '../../../store/models/startStopReason/StartStopReason'
import moment from 'moment'
export default {
    props: ['episodeToEdit', 'curIdentifier', 'stepp'],
    data () {
        return {
          alert: ref({
              type: '',
              visible: false,
              msg: ''
            }),
            identifier: new PatientServiceIdentifier(),
            episode: new Episode(),
            closureEpisode: new Episode(),
            estados: ['Activo', 'Curado'],
            startDate: '',
            stopDate: '',
            step: ''
        }
    },
    methods: {
      submitForm () {
        if (this.isCreateStep || this.isEditStep) {
          this.$refs.startReason.validate()
          this.$refs.clinicSerctor.validate()
          if (!this.$refs.startReason.hasError &&
              !this.$refs.clinicSerctor.hasError) {
                if (this.getJSDateFromDDMMYYY(this.startDate) > new Date()) {
                  this.displayAlert('error', 'A data de inicio indicada é maior que a data da corrente.')
                } else if (this.getJSDateFromDDMMYYY(this.startDate) < date.adjustDate(this.curIdentifier.startDate, { hours: 0, minutes: 0, seconds: 0 })) {
                  console.log(this.getJSDateFromDDMMYYY(this.startDate))
                  console.log(date.adjustDate(this.curIdentifier.startDate, { hours: 0, minutes: 0, seconds: 0 }))
                  this.displayAlert('error', 'A data de inicio indicada é menor que a data de admissão ao serviço clínico.')
                } else {
                  if (this.isEditStep) {
                    const episode = Episode.query()
                                      .with('startStopReason')
                                      .with('patientServiceIdentifier')
                                      .with('patientVisitDetails.*')
                                      .where('id', this.episodeToEdit.id)
                                      .first()
                    if (episode.hasVisits() && (this.getJSDateFromDDMMYYY(this.startDate) < new Date(episode.lastVisit().lastPack().pickupDate))) {
                      this.displayAlert('error', 'A data de inicio indicada é menor que a data da ultima visita efectuada pelo paciente.')
                    } else {
                      this.doSave()
                    }
                  } else {
                    this.doSave()
                  }
                }
          }
        }
      },
      doSave () {
        if (this.episode.id === null) {
          this.episode.episodeType = EpisodeType.query().where('code', 'INICIO').first()
          this.episode.notes = 'Inicio ao tratamento'
          this.episode.clinic = this.currClinic
          this.episode.episodeDate = this.getJSDateFromDDMMYYY(this.startDate)
          this.episode.creationDate = new Date()
        } else {
          if (this.stopDate !== '' && this.closureEpisode.notes !== '' && this.closureEpisode.StartStopReason !== null) {
            this.step = 'close'
             if (this.isCloseStep) {
              this.$refs.stopReason.validate()
              this.$refs.endNotes.validate()
              if (!this.$refs.stopReason.hasError &&
                  !this.$refs.endNotes.hasError) {
                    this.closureEpisode.episodeType = EpisodeType.query().where('code', 'FIM').first()
                    this.closureEpisode.clinic = this.currClinic
                    this.closureEpisode.episodeDate = this.getJSDateFromDDMMYYY(this.stopDate)
                    this.closureEpisode.creationDate = new Date()
                    this.closureEpisode.patientServiceIdentifier = this.identifier

                    if (this.getJSDateFromDDMMYYY(this.stopDate) > new Date()) {
                      this.displayAlert('error', 'A data de fim indicada é maior que a data da corrente.')
                    } else if (this.getJSDateFromDDMMYYY(this.stopDate) < new Date(this.episode.episodeDate)) {
                      this.displayAlert('error', 'A data de inicio indicada é menor que a data de inicio ao tratamento.')
                    } else {
                      const episode = Episode.query()
                                              .with('startStopReason')
                                              .with('patientServiceIdentifier')
                                              .with('patientVisitDetails.*')
                                              .where('id', this.episodeToEdit.id)
                                              .first()
                      if (episode.hasVisits() && (this.getJSDateFromDDMMYYY(this.stopDate) < new Date(episode.lastVisit().lastPack().pickupDate))) {
                        this.displayAlert('error', 'A data de fim indicada é menor que a data da ultima visita efectuada pelo paciente.')
                      } else {
                        Episode.apiSave(this.closureEpisode).then(resp => {
                          // Episode.insert({ data: resp.response.data })
                          this.displayAlert('info', 'Episódio actualizado com sucesso.')
                        }).catch(error => {
                          this.displayAlert('error', error)
                        })
                      }
                    }
              }
            }
          }
        }

        if (!this.isCloseStep) {
          Episode.apiSave(this.episode).then(resp => {
            // Episode.insert({ data: resp.response.data })
            this.displayAlert('info', this.episode.id === null ? 'Episódio adicionado com sucesso.' : 'Episódio actualizado com sucesso.')
          }).catch(error => {
            this.displayAlert('error', error)
          })
        }
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
      getJSDateFromDDMMYYY (dateString) {
        const dateParts = dateString.split('-')
        return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0])
      },
      getDDMMYYYFromJSDate (jsDate) {
        return moment(jsDate).format('DD-MM-YYYY')
      }
    },
    created () {
        this.identifier = Object.assign({}, this.curIdentifier)
        this.episode = Object.assign({}, this.episodeToEdit)
        this.episode.patientServiceIdentifier = this.identifier
        if (this.episode.id !== null) this.startDate = this.episode.episodeDate
        this.step = this.stepp
    },
    mounted () {
    },
    components: {
      Dialog: require('components/Shared/Dialog/Dialog.vue').default,
      TextInput: require('components/Shared/Input/TextField.vue').default
    },
    computed: {
      identifierstartDate: {
        get () {
          return this.getDDMMYYYFromJSDate(this.identifier.startDate)
        },
        set (value) {}
      },
      clinicSerctors () {
        return ClinicSector.query()
                          .with('clinic')
                          .where('clinic_id', this.currClinic.id)
                          .get()
      },
      currClinic () {
        return Clinic.query()
                    .with('province')
                    .where('id', SessionStorage.getItem('currClinic').id)
                    .first()
      },
      patient () {
        return new Patient(SessionStorage.getItem('selectedPatient'))
      },
      startReasons () {
        return StartStopReason.query()
                              .where('isStartReason', true).get()
      },
      stopReasons () {
        return StartStopReason.query()
                              .where('isStartReason', false).get()
      },
      isEditStep () {
        return this.step === 'edit'
      },
      isCreateStep () {
        return this.step === 'create'
      },
      isCloseStep () {
        return this.step === 'close'
      }
    }
}
</script>

<style>

</style>
