<template>
  <q-card style="width: 900px; max-width: 90vw;">
        <form @submit.prevent="submitForm" >
            <q-card-section >
              <div class="row items-center text-subtitle1">
                <q-icon  :name="patient.gender == 'Femenino' ? 'female' : 'male'" size="md" color="primary"/>
                <div class="text-bold text-grey-10 q-ml-sm">{{patient.fullName}}</div>
                <div class="text-grey-10 q-ml-sm"><span class="text-bold text-h6">|</span> {{patient.gender}}</div>
                <div class="text-grey-10 q-ml-sm"><span class="text-bold text-h6">|</span> {{patient.age()}} Anos</div>
              </div>
              <q-separator/>
            </q-card-section>
            <div class="text-center text-h6">
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
                    :disabled="true"
                    v-model="identifier.service"
                    :options="clinicalServices"
                    option-value="id"
                    option-label="code"
                    label="Serviço de Saúde" />

                  <q-input
                      dense
                      outlined
                      class="col q-ml-md"
                      v-model="identifierstartDate"
                      :disabled="1"
                      mask="date"
                      ref="birthDate"
                      :rules="['date']"
                      label="Data de Admissão">
                      <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                              <q-date v-model="identifierstartDate" >
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
                    v-model="identifier.state"
                    :options="estados"
                    label="Estado" />
              </div>

              <span v-if="!isCloseStep && !isReOpenStep">
                <div class="q-mt-md">
                  <div class="row items-center q-mb-sm">
                      <span class="text-subtitle2">Dados do Identificador</span>
                  </div>
                  <q-separator color="grey-13" size="1px" class="q-mb-sm"/>
                </div>
                <div class="row">
                    <identifierInput v-model="identifier.value"/>
                    <div v-if="identifier" class="col q-ml-md"  tabindex="0"> Preferido
                      <q-radio keep-color color="primary" v-model="identifier.prefered" val="true" label="Sim" />
                      <q-radio keep-color color="primary" v-model="identifier.prefered" val="false" label="Nao"/>
                    </div>
                    <div v-if="isCreateStep && patient.identifiers.length > 0" class="col q-ml-md"  tabindex="0"> Assumir Identificador Anterior
                        <q-radio keep-color color="primary"  val="true" label="Sim" />
                        <q-radio keep-color color="primary"  val="false" label="Nao"/>
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
                      mask="date"
                      ref="birthDate"
                      :rules="['date']"
                      label="Data de Fim">
                      <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                              <q-date v-model="endDate" >
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
                      v-model="closureEpisode.startStopReason"
                      :options="stopReasons"
                      option-value="id"
                      option-label="reason"
                      label="Notas de Fim [Referência, Transferido para, ...]" />
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
                      label="Outras notas de fim"
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
                      mask="date"
                      ref="birthDate"
                      :rules="['date']"
                      label="Data de Reabertura">
                      <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                              <q-date v-model="reOpenDate" >
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
                      v-model="closureEpisode.startStopReason"
                      :options="startReasons"
                      option-value="id"
                      option-label="reason"
                      label="Notas de Reabertura" />
                    <TextInput
                      v-model="closureEpisode.notes"
                      label="Outras notas"
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
export default {
    props: ['identifierToEdit', 'selectedPatient', 'step'],
    data () {
        return {
            alert: ref({
                type: '',
                visible: false,
                msg: ''
              }),
            identifierstartDate: '',
            identifier: new PatientServiceIdentifier(),
            closureEpisode: new Episode(),
            estados: ['Activo', 'Curado'],
            endDate: '',
            reOpenDate: ''
        }
    },
    methods: {
      init () {
        this.identifier.patient = Patient.find(this.patient.id)
      },
      submitForm () {
        this.doSave()
      },
      doSave () {
        this.identifier.episodes = []
        if (this.isCloseStep) {
          this.closureEpisode.episodeType = EpisodeType.query().where('code', 'FIM').first()
          this.closureEpisode.episodeDate = new Date(this.endDate)
          this.identifier.endDate = new Date(this.endDate)
        }
        if (this.isReOpenStep) {
          this.closureEpisode.episodeType = EpisodeType.query().where('code', 'INICIO').first()
          this.closureEpisode.episodeDate = new Date(this.reOpenDate)
          this.identifier.reopenDate = new Date(this.reOpenDate)
          this.identifier.endDate = ''
        }
        if (this.isCloseStep || this.isReOpenStep) {
          this.closureEpisode.creationDate = new Date()
          this.closureEpisode.clinic = this.currClinic
          this.closureEpisode.clinicSector = this.lastEpisode.clinicSector
          this.closureEpisode.clinicSector.clinic = this.currClinic

          // this.closureEpisode.patientServiceIdentifier = PatientServiceIdentifier.find(this.identifier.id)

          this.identifier.episodes.push(this.closureEpisode)
        }
        if (this.isCreateStep) {
          this.identifier.clinic = this.currClinic
          this.identifier.startDate = new Date(this.identifierstartDate)
          this.identifier.identifierType = this.identifier.service.identifierType
        }
        console.log(this.identifier)
        PatientServiceIdentifier.apiSave(this.identifier).then(resp => {
          if (!this.isCreateStep) PatientServiceIdentifier.update({ data: resp.response.data })
          let msg = ''
          if (this.isCloseStep) {
            msg = 'Serviço de saúde fechado com sucesso.'
          } else if (this.isCreateStep) {
            msg = 'Serviço de saúde adicionado com sucesso.'
          } else if (this.isEditStep) {
            msg = 'Serviço de saúde actualizado com sucesso.'
          } else if (this.isReOpenStep) {
            msg = 'Serviço de saúde reaberto com sucesso.'
          }
          this.displayAlert('info', msg)
        }).catch(error => {
          this.displayAlert('error', error)
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
        }
    },
    created () {
        if (!this.isCreateStep) {
          this.identifier = Object.assign({}, this.identifierToEdit)
          this.identifierstartDate = this.identifier.startDate
          this.identifier.service = ClinicalService.query()
                                                  .with('identifierType')
                                                  .where('id', this.identifier.service.id)
                                                  .first()
        }
    },
    mounted () {
      this.init()
    },
    computed: {
      patient () {
        return new Patient(SessionStorage.getItem('selectedPatient'))
      },
      clinicalServices () {
        return ClinicalService.query().with('identifierType').get()
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
      lastEpisode () {
        return Episode.query()
                      .withAll()
                      .where('patientServiceIdentifier_id', this.identifier.id)
                      .orderBy('creationDate', 'desc')
                      .first()
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
