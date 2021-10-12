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
              <span v-if="identifier.id > 0">Actualizar</span>
              <span v-else>Adicionar</span>
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
                    v-model="identifier.clinicalService"
                    :options="clinicalServices"
                    option-value="id"
                    option-label="code"
                    label="Serviço de Saúde" />

                  <q-input
                      dense
                      outlined
                      class="col q-ml-md"
                      v-model="identifier.startDate"
                      mask="date"
                      ref="birthDate"
                      :rules="['date']"
                      label="Data de Admissão">
                      <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                              <q-date v-model="identifier.startDate" >
                              <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                              </div>
                              </q-date>
                          </q-popup-proxy>
                          </q-icon>
                      </template>
                  </q-input>
                  <q-select class="col q-ml-md" dense outlined v-model="identifier.estado" :options="estados" label="Estado" />
              </div>
              <div class="row q-mt-md">
                  <q-select
                    class="col"
                    dense outlined
                    v-model="episode.clinicSector"
                    :options="clinicSerctors"
                    option-value="id"
                    option-label="description"
                    label="Sector Clinico" />
                  <q-input
                      dense
                      outlined
                      class="col q-ml-md"
                      v-model="episode.startDate"
                      mask="date"
                      ref="birthDate"
                      :rules="['date']"
                      label="Data de Inicio">
                      <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                              <q-date v-model="episode.startDate" >
                              <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                              </div>
                              </q-date>
                          </q-popup-proxy>
                          </q-icon>
                      </template>
                  </q-input>
                  <div v-if="identifier" class="col q-ml-md"  tabindex="0"> Preferido
                      <q-radio keep-color color="primary" v-model="identifier.prefered" val="true" label="Sim" />
                      <q-radio keep-color color="primary" v-model="identifier.prefered" val="false" label="Nao"/>
                  </div>
                  <div v-else class="col q-ml-md"/>
              </div>

              <span v-if="identifierToEdit == null">
                <div class="q-mt-md">
                  <div class="row items-center q-mb-sm">
                      <span class="text-subtitle2">Dados do Identificador</span>
                  </div>
                  <q-separator color="grey-13" size="1px" class="q-mb-sm"/>
                </div>
                <div class="row">
                    <identifierInput v-model="identifier.value"/>
                    <q-select
                      class="col q-ml-md"
                      dense outlined
                      v-model="identifier.identifierType"
                      :options="identifierTypes"
                      option-value="id"
                      option-label="description"
                      label="Tipo de Identificador" />
                    <div v-if="patient.identifiers.length > 0" class="col q-ml-md"  tabindex="0"> Assumir Identificador Anterior
                        <q-radio keep-color color="primary"  val="true" label="Sim" />
                        <q-radio keep-color color="primary"  val="false" label="Nao"/>
                    </div>
                </div>
              </span>
              <span v-if="identifierToEdit != null">
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
                        v-model="identifier.endDate"
                        mask="date"
                        ref="birthDate"
                        :rules="['date']"
                        label="Data de Fim">
                        <template v-slot:append>
                            <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                <q-date v-model="identifier.endDate" >
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
                      v-model="episode.clinicSector"
                      :options="episodeEndNotes"
                      option-value="code"
                      option-label="description"
                      label="Notas de Fim" />

                      <q-select
                      class="col q-ml-md"
                      dense outlined
                      v-model="episode.clinicSector"
                      :options="options"
                      option-value="code"
                      option-label="description"
                      label="Farmácia de Referência/Transferência" />
                </div>
                <div class="row">
                      <TextInput v-model="patient.address" label="Outras notas de fim" dense class="col" />
                      <div class="col"></div>
                </div>
              </span>
            </div>
           <q-card-actions align="right" class="q-mb-md q-mr-sm">
                <q-btn label="Cancelar" color="red" @click="$emit('close')"/>
                <q-btn type="submit" label="Submeter" color="primary" />
            </q-card-actions>
        </form>
        <pre>{{episode}}</pre>
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
import Episode from '../../../store/models/episode/Episode'
import IdentifierType from '../../../store/models/identifierType/IdentifierType'
export default {
    props: ['identifierToEdit', 'selectedPatient'],
    data () {
        return {
            alert: ref({
                type: '',
                visible: false,
                msg: ''
              }),
            identifier: new PatientServiceIdentifier(),
            episode: new Episode(),
            estados: ['Activo', 'Curado'],
            episodeEndNotes: ['Curado']
        }
    },
    methods: {
      init () {
        ClinicalService.apiGetAll()
        ClinicSector.apiGetAll()
        IdentifierType.apiGetAll()
        this.identifier.patient = this.patient
      },
      submitForm () {
        this.episode.startDate = new Date(this.episode.startDate)
        this.identifier.episodes.push(this.episode)
        console.log(this.identifier)
        PatientServiceIdentifier.apiSave(this.identifier).then(resp => {
          this.identifier = resp.response.data
          this.displayAlert('info', 'Serviço adicionado com sucesso.')
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
          if (this.alert.type === 'info') {
            this.$emit('close')
          }
        }
    },
    created () {
        if (this.identifierToEdit !== null) {
          this.identifier = Object.assign({}, this.identifierToEdit)
          this.episode = Object.assign({}, this.identifier.episodes[this.identifierToEdit.episodes.length - 1])
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
        return ClinicalService.all()
      },
      clinicSerctors () {
        return ClinicSector.query().where('clinic_id', this.currClinic.id).get()
      },
      currClinic () {
        return new Clinic(SessionStorage.getItem('currClinic'))
      },
      identifierTypes () {
        return IdentifierType.all()
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
