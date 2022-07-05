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
              <span v-if="episodeToEdit.id !== null && isEditStep">Actualizar</span>
              <span v-else>Adicionar</span>
              Episódio
            </div>
            <div class="q-mx-lg">
              <div class="q-mt-lg">
                  <div class="row items-center q-mb-sm">
                      <span class="text-subtitle2">Dados de início do Episódio</span>
                  </div>
                  <q-separator color="grey-13" size="1px" class="q-mb-sm"/>
              </div>
              <div class="row q-mt-md">
                  <q-select
                    class="col"
                    disable
                    dense outlined
                    v-model="identifier.service"
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
                    :disable="episode.id !== null && isCreateStep"
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
                    :disable="episode.id !== null && isCreateStep"
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
                      :disable="episode.id !== null && isCreateStep"
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
                      <span class="text-subtitle2">Dados do Novo Episódio</span>
                  </div>
                  <q-separator color="grey-13" size="1px" class="q-mb-sm"/>
                </div>
                <div class="row">
                  <q-input
                        dense
                        outlined
                        class="col"
                        v-model="stopDate"
                        :disable="episode.id !== null && isEditStep"
                        ref="stopDate"
                        label="Data *">
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
                      :disable="episode.id !== null && isEditStep"
                      dense outlined
                      ref="stopReason"
                      :rules="[ val => !!val || 'Por favor indicar a nota de fim']"
                      v-model="closureEpisode.startStopReason"
                      :options="stopReasons"
                      option-value="id"
                      option-label="reason"
                      label="Notas do Episódio *" />
                </div>

                <div class="row" v-if="isReferenceEpisode || isTransferenceEpisode">
                  <q-select
                      class="col" dense outlined
                      v-model="selectedProvince"
                      use-input
                      :disable="(episode.id !== null && isEditStep) || isReferenceEpisode"
                      ref="province"
                      input-debounce="0"
                      :options="provinces"
                      option-value="id"
                      option-label="description"
                      label="Província"/>
                  <q-select
                      class="col q-ml-md" dense outlined
                      v-model="selectedDistrict"
                      use-input
                      :disable="episode.id !== null && isEditStep"
                      ref="district"
                      input-debounce="0"
                      :options="districts"
                      option-value="id"
                      option-label="description"
                      label="Distrito"/>
                  <q-select
                      class="col q-ml-md"
                      dense outlined
                      :disable="episode.id !== null && isEditStep"
                      ref="referralClinic"
                      :rules="[ val => !!val || 'Por favor indicar o destino do paciente.']"
                      v-model="closureEpisode.referralClinic"
                      :options="referralClinics"
                      option-value="id"
                      option-label="clinicName"
                      :label="patientDestinationfieldLabel" />
                </div>
                <div class="row" v-if="isDCReferenceEpisode">
                  <q-select
                      class="col" dense outlined
                      v-model="selectedClinicSectorType"
                      use-input
                      :disable="episode.id !== null && isEditStep"
                      ref="clinicSectorType"
                      input-debounce="0"
                      :options="clinicSectorTypes"
                      option-value="id"
                      option-label="description"
                      label="Tipo de Sector de Dispensa"/>
                  <q-select
                      class="col q-ml-md"
                      dense outlined
                      :disable="episode.id !== null && isEditStep"
                      ref="referealClinicSector"
                      :rules="[ val => !!val || 'Por favor indicar o sector de dispensa.']"
                      v-model="selectedClinicSector"
                      :options="referealClinicSectors"
                      option-value="id"
                      option-label="description"
                      label="Sector de Dispensa" />
                </div>
                <div class="row">
                    <TextInput
                      v-model="closureEpisode.notes"
                      label="Outras notas do episódio"
                      :disable="episode.id !== null && isEditStep"
                      ref="endNotes"
                      :rules="[ val => !!val || 'Por favor indicar a nota de fim']"
                      dense
                      class="col" />
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
import { SessionStorage } from 'quasar'
import Clinic from '../../../store/models/clinic/Clinic'
import ClinicSector from '../../../store/models/clinicSector/ClinicSector'
import Episode from '../../../store/models/episode/Episode'
import Patient from '../../../store/models/patient/Patient'
import PatientServiceIdentifier from '../../../store/models/patientServiceIdentifier/PatientServiceIdentifier'
import EpisodeType from '../../../store/models/episodeType/EpisodeType'
import StartStopReason from '../../../store/models/startStopReason/StartStopReason'
import moment from 'moment'
import PatientVisitDetails from '../../../store/models/patientVisitDetails/PatientVisitDetails'
import Province from '../../../store/models/province/Province'
import District from '../../../store/models/district/District'
import PatientTransReference from '../../../store/models/tansreference/PatientTransReference'
import PatientTransReferenceType from '../../../store/models/tansreference/PatientTransReferenceType'
import ClinicSectorType from '../../../store/models/clinicSectorType/ClinicSectorType'
import FacilityType from '../../../store/models/facilityType/FacilityType'
import IdentifierType from '../../../store/models/identifierType/IdentifierType'
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
            step: '',
            selectedProvince: null,
            selectedDistrict: null,
            selectedClinicSectorType: null,
            selectedClinicSector: null
        }
    },
    methods: {
      init () {
        this.identifier = new PatientServiceIdentifier(this.curIdentifier)
        this.episode = Object.assign({}, this.episodeToEdit)
        if (this.identifier.lastEpisode() !== null && this.identifier.lastEpisode().isStartEpisode() && (this.episode !== null || this.episode !== undefined)) {
          this.episode = new Episode(this.identifier.lastEpisode())
          this.step = 'close'
        }
        this.episode.patientServiceIdentifier = this.identifier
        if (this.episode.id !== null) {
          this.startDate = this.getDDMMYYYFromJSDate(this.episode.episodeDate)
          this.episode.patientServiceIdentifier.episodes = []
          this.episode.clinicSector.clinic = Clinic.query()
                                                  .with('province')
                                                  .with('district.province')
                                                  .with('facilityType')
                                                  .where('id', this.episode.clinicSector.clinic_id)
                                                  .first()
        }
        this.step = this.stepp
      },
      submitForm () {
        if (this.isCreateStep || this.isEditStep) {
          this.$refs.startReason.validate()
          this.$refs.clinicSerctor.validate()
          if (!this.$refs.startReason.hasError &&
              !this.$refs.clinicSerctor.hasError) {
                if (this.getJSDateFromDDMMYYY(this.startDate) > new Date(new Date().setHours(0, 0, 0, 0))) {
                  this.displayAlert('error', 'A data de inicio indicada é maior que a data da corrente.')
                } else if (this.getJSDateFromDDMMYYY(this.startDate) < new Date(new Date(this.curIdentifier.startDate).setHours(0, 0, 0, 0))) {
                  this.displayAlert('error', 'A data de inicio indicada é menor que a data de admissão ao serviço clínico.')
                } else {
                  if (this.isEditStep) {
                    const episode = Episode.query()
                                      .with('startStopReason')
                                      .with('patientServiceIdentifier')
                                      .with('patientVisitDetails.*')
                                      .where('id', this.episodeToEdit.id)
                                      .first()
                    if (episode.hasVisits() && (this.getJSDateFromDDMMYYY(this.startDate) < new Date(new Date(episode.lastVisit().lastPack().pickupDate).setHours(0, 0, 0, 0)))) {
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
          this.episode.creationDate = new Date(new Date().setHours(0, 0, 0, 0))
        } else {
          if (this.stopDate !== '' && this.closureEpisode.notes !== '' && this.closureEpisode.StartStopReason !== null) {
            this.step = 'close'
             if (this.isCloseStep) {
              this.$refs.stopReason.validate()
              this.$refs.endNotes.$refs.ref.validate()
              if (!this.$refs.stopReason.hasError &&
                  !this.$refs.endNotes.$refs.ref.hasError) {
                    this.closureEpisode.episodeType = EpisodeType.query().where('code', 'FIM').first()
                    this.closureEpisode.clinic = this.currClinic
                    this.closureEpisode.episodeDate = this.getJSDateFromDDMMYYY(this.stopDate)
                    this.closureEpisode.creationDate = new Date(new Date().setHours(0, 0, 0, 0))
                    this.closureEpisode.patientServiceIdentifier = this.identifier

                    if (this.getJSDateFromDDMMYYY(this.stopDate) > new Date(new Date().setHours(0, 0, 0, 0))) {
                      this.displayAlert('error', 'A data de fim indicada é maior que a data da corrente.')
                    } else if (this.getJSDateFromDDMMYYY(this.stopDate) < new Date(this.episode.episodeDate)) {
                      this.displayAlert('error', 'A data de inicio indicada é menor que a data de inicio ao tratamento.')
                    } else {
                      console.log(this.episodeToEdit)
                      const episode = Episode.query()
                                              .with('startStopReason')
                                              .with('patientServiceIdentifier')
                                              .with('patientVisitDetails.*')
                                              .where('id', this.episode.id)
                                              .first()
                      if (this.isReferenceEpisode && episode.hasVisits()) {
                          episode.lastVisit().prescription.patientVisitDetails = PatientVisitDetails.query()
                                                                                                    .with('pack')
                                                                                                    .where('prescription_id', episode.lastVisit().prescription.id)
                                                                                                    .get()
                      }
                      if (episode.hasVisits() && (this.getJSDateFromDDMMYYY(this.stopDate) < new Date(episode.lastVisit().lastPack().pickupDate))) {
                        this.displayAlert('error', 'A data de fim indicada é menor que a data da ultima visita efectuada pelo paciente.')
                      } else if ((this.isReferenceEpisode || this.isTransferenceEpisode || this.isDCReferenceEpisode) && !episode.hasVisits()) {
                        this.displayAlert('error', 'O paciente deve ter registo de pelo menos uma prescrição e dispensa para poder ser referido ou transferido.')
                      } else if ((this.isReferenceEpisode || this.isTransferenceEpisode) && this.closureEpisode.referralClinic === null) {
                        this.displayAlert('error', 'Por favor indicar o destino do paciente.')
                      } else {
                        if (this.selectedClinicSector === null) {
                          this.closureEpisode.clinicSector = ClinicSector.query()
                                                                          .with('clinic')
                                                                          .with('clinicSectorType')
                                                                          .where('id', this.episode.clinicSector.id)
                                                                          .first()
                        } else {
                          this.closureEpisode.clinicSector = ClinicSector.query()
                                                                          .with('clinic')
                                                                          .with('clinicSectorType')
                                                                          .where('id', this.selectedClinicSector.id)
                                                                          .first()
                        }
                        console.log(this.closureEpisode)
                        Episode.apiSave(this.closureEpisode).then(resp => {
                            this.closureEpisode.patientServiceIdentifier.patient = this.patient
                            this.closureEpisode.patientServiceIdentifier.patient.clinic.facilityType = FacilityType.find(this.closureEpisode.patientServiceIdentifier.patient.clinic.facilityTypeId)
                            this.closureEpisode.patientServiceIdentifier.clinic.facilityType = FacilityType.find(this.closureEpisode.patientServiceIdentifier.clinic.facilityTypeId)
                            this.closureEpisode.patientServiceIdentifier.service.identifierType = IdentifierType.find(this.closureEpisode.patientServiceIdentifier.service.identifier_type_id)

                          if (this.isTransferenceEpisode || this.isReferenceEpisode) {
                            const transReference = new PatientTransReference({
                              syncStatus: 'P',
                              operationDate: this.closureEpisode.episodeDate,
                              creationDate: new Date(),
                              operationType: PatientTransReferenceType.query().where('code', this.isTransferenceEpisode ? 'TRANSFERENCIA' : 'REFERENCIA_FP').first(),
                              origin: this.currClinic,
                              destination: this.closureEpisode.referralClinic.uuid,
                              identifier: this.closureEpisode.patientServiceIdentifier,
                              patient: this.patient
                            })
                            console.log(transReference)
                            setTimeout(this.doTransReference(transReference), 2)
                          } else if (this.isDCReferenceEpisode) {
                            const transReference = new PatientTransReference({
                              syncStatus: 'P',
                              operationDate: this.closureEpisode.episodeDate,
                              creationDate: new Date(),
                              operationType: PatientTransReferenceType.query().where('code', 'REFERENCIA_DC').first(),
                              origin: this.currClinic,
                              destination: this.selectedClinicSector.uuid,
                              identifier: this.closureEpisode.patientServiceIdentifier,
                              patient: this.patient
                            })
                            console.log(transReference)
                            setTimeout(this.doTransReference(transReference), 2)
                          }
                          this.displayAlert('info', 'Operação efectuada com sucesso.')
                        }).catch(error => {
                          console.log(error)
                          })
                      }
                    }
              }
            }
          }
        }

        if (!this.isCloseStep) {
          this.episode.episodeDate = this.getJSDateFromDDMMYYY(this.startDate)
          // this.episode.clinic.facilityType = FacilityType.find(this.episode.clinic.facilityTypeId)
          this.episode.clinicSector.clinicSectorType = ClinicSectorType.find(this.episode.clinicSector.clinic_sector_type_id)
          this.episode.patientServiceIdentifier.clinic.district = District.query().with('province').where('id', this.episode.patientServiceIdentifier.clinic.district_id).first()
          this.episode.patientServiceIdentifier.clinic.facilityType = FacilityType.find(this.episode.patientServiceIdentifier.clinic.facilityTypeId)
          this.episode.patientServiceIdentifier.episodes = []
          console.log(this.episode)
          const lastEpisodeCopy = JSON.parse(JSON.stringify(this.lastEpisode))
          Episode.apiSave(this.episode).then(resp => {
            if (new Episode(this.episode).isBackReferenceEpisode()) {
              const transReference = new PatientTransReference({
                syncStatus: 'P',
                operationDate: this.episode.episodeDate,
                creationDate: new Date(),
                operationType: PatientTransReferenceType.query().where('code', 'VOLTOU_DA_REFERENCIA').first(),
                origin: this.currClinic,
                destination: new Episode(lastEpisodeCopy).isDCReferenceEpisode() ? this.lastEpisode.clinicSector.uuid : this.lastEpisode.referralClinic.uuid,
                identifier: this.episode.patientServiceIdentifier,
                patient: this.patient
              })
              transReference.patient.clinic.facilityType = FacilityType.find(transReference.patient.clinic.facilityTypeId)

              console.log(transReference)
              setTimeout(this.doTransReference(transReference), 2)
            }
            this.displayAlert('info', this.episode.id === null ? 'Episódio adicionado com sucesso.' : 'Episódio actualizado com sucesso.')
          }).catch(error => {
            console.log(error)
            })
        }
      },
      doTransReference (transReference) {
        PatientTransReference.apiSave(transReference).then(resp => {
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
          this.$emit('close')
        }
      },
      getJSDateFromDDMMYYY (dateString) {
        const dateParts = dateString.split('-')
        return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0])
      },
      getDDMMYYYFromJSDate (jsDate) {
        return moment(jsDate).format('DD-MM-YYYY')
      },
      loadProvince () {
        this.selectedProvince = Province.query().with('districts.*').where('id', this.currClinic.province.id).first()
      }
    },
    created () {
        this.init()
    },
    mounted () {
    },
    components: {
      Dialog: require('components/Shared/Dialog/Dialog.vue').default,
      TextInput: require('components/Shared/Input/TextField.vue').default
    },
    computed: {
      patientDestinationfieldLabel () {
        if (this.isTransferenceEpisode) {
          return 'US de Transferência'
        } else if (this.isReferenceEpisode) {
          return 'Farmácia de Referência'
        } else {
          return 'Sem Titulo'
        }
      },
      provinces: {
        get () {
           if (this.isReferenceEpisode) {
             this.loadProvince()
            return Province.query().with('districts.*').has('code').where('id', this.currClinic.province.id).get()
          } else {
            return Province.query().with('districts.*').has('code').get()
          }
        }
      },
      clinicSectorTypes () {
        return ClinicSectorType.query().with('clinicSectorList').get()
      },
      referealClinicSectors () {
        if (this.selectedClinicSectorType === null) return []
        return this.selectedClinicSectorType.clinicSectorList
      },
      districts: {
        get () {
          if (this.selectedProvince !== null && this.selectedProvince !== undefined) {
            if (this.isReferenceEpisode) this.loadProvince()
            return District.query().with('province').where('province_id', this.selectedProvince.id).has('code').get()
          } else {
            return null
          }
        }
      },
      isReferenceEpisode () {
        if (this.closureEpisode === null || this.closureEpisode === undefined) return false
        if (this.closureEpisode.startStopReason === null || this.closureEpisode.startStopReason === undefined) return false
        return this.closureEpisode.startStopReason.code === 'REFERIDO_PARA'
      },
      isDCReferenceEpisode () {
        if (this.closureEpisode === null || this.closureEpisode === undefined) return false
        if (this.closureEpisode.startStopReason === null || this.closureEpisode.startStopReason === undefined) return false
        return this.closureEpisode.startStopReason.code === 'REFERIDO_DC'
      },
      isTransferenceEpisode () {
        if (this.closureEpisode === null || this.closureEpisode === undefined) return false
        if (this.closureEpisode.startStopReason === null || this.closureEpisode.startStopReason === undefined) return false
        return this.closureEpisode.startStopReason.code === 'TRANSFERIDO_PARA'
      },
      identifierstartDate: {
        get () {
          return this.getDDMMYYYFromJSDate(this.identifier.startDate)
        },
        set (value) {}
      },
      clinicSerctors () {
        const sectors = ClinicSector.query()
                                    .with('clinic')
                                    .with('clinicSectorType')
                                    .where((sector) => {
                                      return sector.clinic_id === this.currClinic.id && sector.active === true
                                    }).get()
        const sectorList = sectors.filter((sector) => {
          return sector.clinicSectorType.code === 'PARAGEM_UNICA'
        })

        return sectorList
      },
      referralClinics () {
        let clinicList = []
        if (this.selectedDistrict !== null) {
         if (this.isReferenceEpisode) {
            clinicList = Clinic.query()
                            .with('province')
                            .with('district.province')
                            .with('facilityType')
                            .where((clinic) => {
                              return clinic.mainClinic === false && clinic.active === true
                            }).get()
            const filteredList = clinicList.filter((clinic) => {
              return clinic.facilityType.code !== 'US' && clinic.province.id === this.selectedProvince.id && clinic.district.id === this.selectedDistrict.id
            })

            return filteredList
          } else {
              clinicList = Clinic.query()
                            .with('province')
                            .with('district.province')
                            .with('facilityType')
                            .where((clinic) => {
                              return clinic.mainClinic === false && clinic.active === true
                            }).get()
            const filteredList = clinicList.filter((clinic) => {
              return clinic.facilityType.code === 'US' && clinic.province.id === this.selectedProvince.id && clinic.district.id === this.selectedDistrict.id
            })

            return filteredList
          }
        }
        return []
      },
      currClinic () {
        return Clinic.query()
                    .with('province')
                    .with('district.province')
                    .with('facilityType')
                    .where('id', SessionStorage.getItem('currClinic').id)
                    .first()
      },
      patient () {
        return new Patient(SessionStorage.getItem('selectedPatient'))
      },
      lastEpisode: {
        get () {
          return Episode.query()
                      .withAll()
                      .where('patientServiceIdentifier_id', this.identifier.id)
                      .orderBy('episodeDate', 'desc')
                      .first()
        }
      },
      startReasons () {
        const allReasons = StartStopReason.query()
                              .where('isStartReason', true)
                              .orderBy('reason', 'asc')
                              .get()
        let resonList = []
        if (this.lastEpisode !== null && this.lastEpisode.isReferenceOrTransferenceEpisode()) {
          resonList = allReasons.filter((reason) => {
            return reason.code === 'VOLTOU_REFERENCIA'
          })
          return resonList
        } else {
          return allReasons
        }
      },
      stopReasons () {
        const allReasons = StartStopReason.query()
                              .where('isStartReason', false).get()
        let resonList = []
        if (this.lastEpisode !== null && this.lastEpisode.isReferenceOrTransferenceEpisode()) {
          resonList = allReasons.filter((reason) => {
            return reason.code !== 'REFERIDO_DC' && reason.code !== 'TRANSFERIDO_PARA' && reason.code !== 'REFERIDO_PARA'
          })
          return resonList
        } else {
          return allReasons
        }
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
