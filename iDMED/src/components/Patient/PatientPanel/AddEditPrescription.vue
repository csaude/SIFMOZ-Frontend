<template>
  <q-card style="width: 1250px; max-width: 100vw;">
      <q-card-section class="q-pa-none bg-green-2" >
        <div class="row items-center text-subtitle1 q-pa-md">
          <q-icon  :name="patient.gender == 'Feminino' ? 'female' : 'male'" size="md" color="primary"/>
          <div class="text-bold text-grey-10 q-ml-sm">{{patient.fullName}}</div>
          <div class="text-grey-10 q-ml-sm"><span class="text-bold text-h6">|</span> {{patient.gender}}</div>
          <div class="text-grey-10 q-ml-sm"><span class="text-bold text-h6">|</span> {{patient.age()}} Anos de Idade</div>
        </div>
        <q-separator/>
      </q-card-section>
      <q-card-section>
      <q-scroll-area
          :thumb-style="thumbStyle"
          :content-style="contentStyle"
          :content-active-style="contentActiveStyle"
          style="height: 500px;"
          class="q-pr-md"
        >
        <span>
      <span v-for="clinicalService in clinicalServices" :key="clinicalService.id">
        <ListHeader
          :editVisible="!(selectedClinicalService !== null && clinicalService.id === selectedClinicalService.id)"
          :doneVisible="(selectedClinicalService !== null && clinicalService.id === selectedClinicalService.id)"
          :closeVisible="(selectedClinicalService !== null && clinicalService.id === selectedClinicalService.id)"
          :mainContainer="false"
          @initEdition="initEdition(clinicalService)"
          @done="saveCurPatientVisitDetails"
          @closeSection="cancelEdition"
          class="q-mt-xs"
          :bgColor="(selectedClinicalService !== null && clinicalService.id === selectedClinicalService.id) ? 'bg-amber-9' : 'bg-primary'">Prescrição {{clinicalService.code}}
        </ListHeader>
        <div class="box-border q-pa-sm" v-if="selectedClinicalService !== null && (clinicalService.id === selectedClinicalService.id)">
        <ListHeader
          :editVisible="false"
          :mainContainer="false"
          bgColor="bg-grey-6">Informação da Prescrição
        </ListHeader>
        <div class="box-border">
          <div class="q-ma-md">
            <div class="row">
              <q-input
                dense
                outlined
                class="col q-mb-md"
                v-model="prescriptionDate"
                :disable="isNewPackStep || isEditPackStep"
                ref="prescriptionDate"
                label="Data da Prescrição">
                <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                        <q-date v-model="prescriptionDate" mask="DD-MM-YYYY">
                        <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                        </q-date>
                    </q-popup-proxy>
                    </q-icon>
                </template>
              </q-input>
              <div class="col">
                <div class="row">
                  <q-checkbox
                v-model="spetialPrescription"
                :disable="mustBeSpetial || isNewPackStep || isEditPackStep"
                label="Prescrição especial"
                class="col-4 q-mb-sm" />
              <q-select
                  class="col"
                  dense outlined
                  v-if="spetialPrescription || curPrescriptionDetails.spetialPrescriptionMotive !== null"
                  v-model="curPrescriptionDetails.spetialPrescriptionMotive"
                  :options="spetialPrescriptionMotives"
                  :disable="isNewPackStep || isEditPackStep"
                  ref="spetialMotive"
                  :rules="[ val => !!val || 'Por favor indicar o motivo da prescrição especial']"
                  option-value="id"
                  option-label="description"
                  label="Motivo da prescrição especial" />
                </div>
              </div>
            </div>
            <div class="row">
              <q-select
                  v-if="hasTherapeuticalRegimen"
                  class="col q-mr-sm"
                  :disable="isNewPackStep || isEditPackStep"
                  dense outlined
                  ref="therapeuticRegimen"
                  :rules="[ val => !!val || 'Por favor indicar o regime terapêutico']"
                  v-model="curPrescriptionDetails.therapeuticRegimen"
                  :options="therapeuticRegimens"
                  option-value="id"
                  option-label="description"
                  label="Regime Terapêutico" />
              <q-select
                  v-if="hasTherapeuticalLine"
                  class="col q-mr-sm"
                  dense outlined
                  :disable="isNewPackStep || isEditPackStep"
                  ref="therapeuticLine"
                  :rules="[ val => !!val || 'Por favor indicar a linha terapêutica']"
                  v-model="curPrescriptionDetails.therapeuticLine"
                  :options="therapeuticLines"
                  option-value="id"
                  option-label="description"
                  label="Linha Terapêutica" />
              <q-select
                  class="col q-mr-sm"
                  dense outlined
                  v-model="curPrescription.duration"
                  :options="durations"
                  :disable="isNewPackStep || isEditPackStep"
                  ref="duration"
                  :rules="[ val => !!val || 'Por favor indicar a duração']"
                  option-value="id"
                  option-label="description"
                  label="Duração" />
              <q-select
                  class="col"
                  dense outlined
                  :disable="isNewPackStep || isEditPackStep"
                  ref="doctor"
                  :rules="[ val => !!val || 'Por favor indicar o clínico']"
                  v-model="curPrescription.doctor"
                  :options="doctors"
                  option-value="id"
                  option-label="fullName"
                  label="Clínico" />
            </div>
            <div>
              <div class="row items-center q-mb-xs">
                  <span class="text-subtitle2">Informação Adicional</span>
              </div>
              <q-separator color="grey-13" size="1px" class="q-mb-sm"/>
            </div>
            <div class="row">
              <div class="col">
              <div class="row items-center">
                <q-item-label dense caption>Altera Linha Terapêutica?</q-item-label>
              <q-radio :disable="isNewPackStep || isEditPackStep" v-model="curPrescription.patientType" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="N/A" label="Não" />
              <q-radio :disable="isNewPackStep || isEditPackStep" v-model="curPrescription.patientType" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="Alterar" label="Sim" />
              </div>
              </div>
              <q-select
                  v-if="hasPrescriptionChangeMotive && String(curPrescription.patientType).includes('Alterar')"
                  class="col q-mr-sm"
                  :disable="isNewPackStep || isEditPackStep"
                  ref="reasonForUpdate"
                  dense outlined
                  option-value="code"
                  :options="reasonsForUpdate"
                  v-model="curPrescriptionDetails.reasonForUpdate"
                  option-label="description"
                  label="Motivo Alteração" />
                <q-select
                  class="col q-mr-sm"
                  dense outlined
                  ref="dispenseType"
                  :disable="isNewPackStep || isEditPackStep"
                  :rules="[ val => !!val || 'Por favor indicar o tipo de dispensa']"
                  v-model="curPrescriptionDetails.dispenseType"
                  :options="dispenseTypes"
                  option-value="id"
                  option-label="description"
                  label="Paciente em " />
                <q-select
                  class="col"
                  ref="patientStatus"
                  :rules="[ val => !!val || 'Por favor indicar a situação do paciente (em relação aos modelos)']"
                  v-model="curPrescription.patientStatus"
                  :disable="isNewPackStep || isEditPackStep"
                  :options="patientStatus"
                  dense outlined
                  label="Situacao do paciente (em relação aos modelos)" />
            </div>
            <div class="row reverse q-mb-sm">
              <q-btn
                unelevated
                color="primary"
                :disable="isNewPackStep || isEditPackStep || showServiceDrugsManagement"
                label="Adicionar Medicamentos"
                class="all-pointer-events"
                @click="validateForm()"/>
            </div>
          </div>
          </div>
          <div
            class=""
            v-if="showServiceDrugsManagement">
            <div>
                <ServiceDrugsManagement
                  :selectedClinicalService="selectedClinicalService"
                  :hasTherapeuticalRegimen="hasTherapeuticalRegimen"
                  :lastPack="lastPack"
                  :stepp="step"
                  :prescription="curPatientVisitDetail.prescription"
                  :oldPrescribedDrugs="prescribedDrugs"
                  @updatePrescribedDrugs="updatePrescribedDrugs"
                  :visitDetails="curPatientVisitDetail"
                  :visitClone="visitClone"
                  :isAlreadyEdited="isAlreadyEdited"/>
              </div>
          </div>
        </div>
      </span>
      <div class="row q-mt-xs"  v-if="showDispenseMd">
        <q-banner
          dense
          inline-actions
          class="col text-white q-pa-none bg-orange-4">
            <div class="q-pa-md">
                <div class="q-gutter-sm">
                  <q-radio v-model="mds" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="US_" label="Farmácia Pública" />
                  <q-radio v-model="mds" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="DD_" label="Dipensa Descentralizada" />
                  <q-radio v-model="mds" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="DC_" label="Dispensa Comunitária" />
                </div>
            </div>
            <template v-slot:action class="items-center">
                <q-select
                    style="width: 320px"
                    class="col q-ma-sm"
                    bg-color="white"
                    dense outlined
                    ref="dispenseMode"
                    v-model="dispenseMode"
                    :options="dispenseModes"
                    option-value="id"
                    option-label="description"
                    label="Modo de dispensa" />
            </template>
        </q-banner>
      </div>
      </span>
      </q-scroll-area>
      <div class="row q-mt-xl q-pt-md">
           <span
            class="text-right absolute-bottom q-mb-lg q-mr-md q-mt-xl no-pointer-events">

              <q-btn
                label="Cancelar"
                color="red"
                class="all-pointer-events"
                @click="$emit('close')"/>
              <q-btn
                v-if="!inFormEdition"
                :label="dispenseLabel"
                @click="doValidationToDispense()"
                color="primary"
                class="q-ml-md all-pointer-events" />
            </span>
         </div>
      </q-card-section>
      <q-dialog persistent v-model="alert.visible">
        <Dialog
          :type="alert.type"
          :object="msgObject"
          @doOnYes="doOnYes"
          @doOnNo="doOnNo"
          @cancelYesNo="cancelYesNo"
          @closeDialog="closeDialog"
          @commitOperation="doOnContinue"
          @cancelOperation="doOnCancel">
          <template v-slot:title> Informação</template>
          <template v-slot:msg> {{alert.msg}} </template>
        </Dialog>
      </q-dialog>
    </q-card>
</template>

<script>
import { ref } from 'vue'
import { SessionStorage } from 'quasar'
import Patient from '../../../store/models/patient/Patient'
import PatientVisitDetails from '../../../store/models/patientVisitDetails/PatientVisitDetails'
import PatientVisit from '../../../store/models/patientVisit/PatientVisit'
import Prescription from '../../../store/models/prescription/Prescription'
import PrescriptionDetail from '../../../store/models/prescriptionDetails/PrescriptionDetail'
import ClinicalService from '../../../store/models/ClinicalService/ClinicalService'
import Episode from '../../../store/models/episode/Episode'
import Pack from '../../../store/models/packaging/Pack'
import TherapeuticRegimen from '../../../store/models/therapeuticRegimen/TherapeuticRegimen'
import TherapeuticLine from '../../../store/models/therapeuticLine/TherapeuticLine'
import Doctor from '../../../store/models/doctor/Doctor'
import Clinic from '../../../store/models/clinic/Clinic'
import DispenseType from '../../../store/models/dispenseType/DispenseType'
import Duration from '../../../store/models/Duration/Duration'
import PackagedDrug from '../../../store/models/packagedDrug/PackagedDrug'
import PrescribedDrug from '../../../store/models/prescriptionDrug/PrescribedDrug'
import DispenseMode from 'src/store/models/dispenseMode/DispenseMode'
import moment from 'moment'
import Stock from '../../../store/models/stock/Stock'
import PackagedDrugStock from '../../../store/models/packagedDrug/PackagedDrugStock'
import SpetialPrescriptionMotive from '../../../store/models/prescription/SpetialPrescriptionMotive'
import PatientServiceIdentifier from '../../../store/models/patientServiceIdentifier/PatientServiceIdentifier'
import GroupMember from '../../../store/models/groupMember/GroupMember'
import GroupMemberPrescription from '../../../store/models/group/GroupMemberPrescription'
import Group from '../../../store/models/group/Group'
import mixinplatform from 'src/mixins/mixin-system-platform'
import mixinutils from 'src/mixins/mixin-utils'
import ClinicalServiceAttribute from '../../../store/models/ClinicalServiceAttribute/ClinicalServiceAttribute'
import StartStopReason from '../../../store/models/startStopReason/StartStopReason'
import EpisodeType from '../../../store/models/episodeType/EpisodeType'
import ClinicSector from '../../../store/models/clinicSector/ClinicSector'
import StockEntrance from '../../../store/models/stockentrance/StockEntrance'
export default {
  mixins: [mixinplatform, mixinutils],
  props: ['selectedVisitDetails', 'stepp', 'service', 'member'],
  data () {
    return {
      mds: ref('US_'),
      identifiers: [],
      patientVisit: new PatientVisit(),
      curPatientVisitDetails: [],
      curPatientVisitDetail: null,
      clinicalServices: [],
      selectedClinicalService: null,
      reasonsForUpdate: ['FT', 'Alergia'],
      patientStatus: ['Inicio', 'Manutenção'],
      patientTypes: ['Sim', 'Não'],
      showServiceDrugsManagement: false,
      prescriptionDate: '',
      showDispenseMode: false,
      prescribedDrugs: [],
      dispenseMode: null,
      spetialPrescription: false,
      lastValidPrescription: null,
      originalPickUpDate: null,
      mustBeSpetial: false,
      msgObject: {},
      visitClone: {},
      inFormEdition: false,
      isAlreadyEdited: false,
      contentStyle: {
        backgroundColor: '#ffffff',
        color: '#555'
      },
      contentActiveStyle: {
        backgroundColor: '#eee',
        color: 'black'
      },
      thumbStyle: {
        right: '2px',
        borderRadius: '5px',
        backgroundColor: '#0ba58b',
        width: '5px',
        opacity: 0.75
      }
    }
  },
  methods: {
    async init () {
      this.setStep(this.stepp)
      this.clearPrescriptionSession()
      if (this.mobile) {
        ClinicalServiceAttribute.deleteAll()
        await ClinicalServiceAttribute.localDbGetAll().then(regimens => {
          ClinicalServiceAttribute.insert({ data: regimens })
        })
      }
      console.log(this.isEditPackStep)
      if (this.isNewPackStep || this.isEditPackStep) {
        this.initPatientVisitDetailsForDispense()
      } else {
        this.getPatientActiveClinicalServices()
      }
      if (this.website) {
        this.doDispenseModeGetAll(0)
      } else {
      //  this.loadParamsToVueX()
      }
     // ClinicalService.deleteAll()
    },
    initPatientVisitDetailsForDispense () {
      this.inFormEdition = true
      const pack = new Pack({
        clinic: this.currClinic
      })

      this.curPatientVisitDetail = PatientVisitDetails.query().with('clinic.*')
                                                              .with('episode.patientServiceIdentifier.service')
                                                              .with('patientVisit')
                                                              .with('prescription.*')
                                                              .where('id', this.selectedVisitDetails.id)
                                                              .first()
      this.curPatientVisitDetail.prescription.prescriptionDetails = PrescriptionDetail.query()
                                                                                      .withAll()
                                                                                      .where('id', this.curPatientVisitDetail.prescription.prescriptionDetails[0].id)
                                                                                      .get()
      this.prescriptionDate = this.getDDMMYYYFromJSDate(this.curPatientVisitDetail.prescription.prescriptionDate)

      this.selectedClinicalService = ClinicalService.query()
                                                    .with('attributes.*')
                                                    .with('therapeuticRegimens')
                                                    .with('identifierType')
                                                    .where('id', this.curPatientVisitDetail.episode.patientServiceIdentifier.service.id)
                                                    .first()
      this.curPatientVisitDetail.prescription.prescribedDrugs = PrescribedDrug.query()
                                                                                  .with('drug.form')
                                                                                  .where('prescription_id', this.curPatientVisitDetail.prescription.id)
                                                                                  .get()

      const prescribedDrugs = this.curPatientVisitDetail.prescription.prescribedDrugs

      let packagedDrugs = null

      if (this.curPatientVisitDetail.prescription.prescriptionDetails[0].spetialPrescriptionMotive !== null) {
        this.spetialPrescription = true
      }
      if (!this.isFirstPack) {
        this.curPatientVisitDetail.pack = this.lastPackFull
        packagedDrugs = this.curPatientVisitDetail.pack.packagedDrugs
      }
      if (this.isEditPackStep || this.isFirstPack) {
        this.prescribedDrugs = prescribedDrugs
      } else {
        prescribedDrugs.forEach((prescribedDrug) => {
          packagedDrugs.forEach((packagedDrug) => {
            if (this.isNewPackStep && ((prescribedDrug.drug.id === packagedDrug.drug.id) && packagedDrug.toContinue)) {
                this.prescribedDrugs.push(prescribedDrug)
              }
          })
        })

          this.curPatientVisitDetail.pack = null
          if (this.isFirstPack) {
            pack.pickupDate = this.curPatientVisitDetail.prescription.prescriptionDate
          } else if (this.isAlreadyEdited) {
            pack.pickupDate = this.curPatientVisitDetail.prescription.pickupDate
          } else {
            pack.pickupDate = this.lastPack.nextPickUpDate
          }

          this.curPatientVisitDetail.pack = pack
          this.curPatientVisitDetail.id = null
          this.curPatientVisitDetail.$id = null
      }
      if (this.isFirstPack) {
        this.curPatientVisitDetail.pack = pack
        this.curPatientVisitDetail.pack.patientVisitDetails = []
        this.curPatientVisitDetail.pack.packagedDrugs = []
        this.curPatientVisitDetail.pack.clinic = this.currClinic
      }

      if (this.isEditPackStep) {
        this.curPatientVisitDetail.pack.patientVisitDetails = []
        this.curPatientVisitDetail.pack.packagedDrugs = []
        this.curPatientVisitDetail.pack.clinic = this.currClinic
      }

      if (this.selectedVisitDetails !== null) {
        this.curPatientVisitDetail.createPackLater = this.selectedVisitDetails.createPackLater
      }
      SessionStorage.set(this.curPatientVisitDetail.episode.patientServiceIdentifier.service.code, this.curPatientVisitDetail)
      this.clinicalServices.push(this.curPatientVisitDetail.episode.patientServiceIdentifier.service)
      // this.selectedClinicalService = this.curPatientVisitDetail.episode.patientServiceIdentifier.service
      this.setCurVisitDetails()
      // this.showServiceDrugsManagement = true
      this.initPatientVisit()
    },
    clearPrescriptionSession () {
      const services = ClinicalService.all()
      services.forEach((service) => {
        SessionStorage.remove(service.code)
      })
    },
    initPatientVisit () {
      if (this.isNewPackStep || !this.isEditPackStep) {
        this.patientVisit.visitDate = new Date()
      } else {
        this.patientVisit = PatientVisit.query()
                                        .with('clinic.*')
                                        .where('id', this.curPatientVisitDetail.patientVisit.id)
                                        .first()
      }
      if (this.isFirstPack && this.curPatientVisitDetail.patientVisit !== null) {
        this.patientVisit = PatientVisit.query()
                                        .with('clinic.*')
                                        .where('id', this.curPatientVisitDetail.patientVisit.id)
                                        .first()
      }
      this.patientVisit.clinic = this.currClinic
      this.patientVisit.patient = this.simplePatient
    },
    getPatientActiveClinicalServices () {
      if (!this.isNewPackStep && !this.isEditPackStep) {
        const identifiers = this.patient.identifiers.filter((identifier) => {
          if (this.service !== null && this.service !== undefined) return identifier.service.code === this.service.code
          return (identifier.endDate === '' || identifier.endDate === null)
        })
        identifiers.forEach((identifier) => {
          const episode = Episode.query()
                                .withAll()
                                .where('patientServiceIdentifier_id', identifier.id)
                                .orderBy('episodeDate', 'desc')
                                .first()
          if (episode !== null && (!episode.closed() || episode.isDCReferenceEpisode())) {
            this.clinicalServices.push(ClinicalService.query().with('attributes.*').where('id', identifier.service.id).first())
            this.initPatientVisitDetails(episode)
          }
        })
      }
    },
    initPatientVisitDetails (episode) {
      const pack = new Pack({
        clinic: this.currClinic,
        syncStatus: this.patient.his_id.length > 10 ? 'R' : 'N'
      })

      let prescription = null
      if (this.service === null || this.service === undefined) {
        prescription = new Prescription({
          prescriptionDate: new Date(),
          clinic: this.currClinic
        })

        const prescriptionDetail = new PrescriptionDetail()
        prescription.prescriptionDetails.push(prescriptionDetail)
      } else {
          prescription = this.selectedVisitDetails.prescription
          prescription.id = null
          prescription.$id = null
          prescription.clinic = this.currClinic
          prescription.prescriptionDetails[0].id = null
          prescription.prescriptionDetails[0].$id = null
          prescription.prescribedDrugs.forEach((pd) => {
            pd.id = null
            pd.$id = null
          })
      }

      const curPatientVisitDetail = new PatientVisitDetails({
        patientVisit: this.patientVisit,
        clinic: this.currClinic,
        episode: Episode.query().with(['episodeType', 'startStopReason', 'clinicSector', 'patientServiceIdentifier.service']).where('id', episode.id).first()
      })

      curPatientVisitDetail.pack = pack
      curPatientVisitDetail.prescription = prescription
      curPatientVisitDetail.createPackLater = this.selectedVisitDetails.createPackLater

      episode.patientVisitDetails.push(curPatientVisitDetail)
      SessionStorage.set(curPatientVisitDetail.episode.patientServiceIdentifier.service.code, curPatientVisitDetail)

      this.curPatientVisitDetails.push(curPatientVisitDetail)
    },
    initEdition (clinicalService) {
      this.inFormEdition = true
      this.selectedClinicalService = clinicalService
      this.setCurVisitDetails()
    },
    cancelEdition () {
      this.selectedClinicalService = null
      this.inFormEdition = false
    },
    isSelectedService (clinicalService) {
        if (this.selectedClinicalService === null) return false
      return this.selectedClinicalService.id === clinicalService.id
    },
    updateLeftDuration () {
      this.curPrescription.leftDuration = this.curPrescription.duration.weeks
    },
    alterPatientStatus () {
      if (String(this.curPrescriptionDetails.dispenseType.description).includes('Mensal')) {
        this.curPrescription.patientStatus = 'N/A'
      }
    },
    saveCurPatientVisitDetails () {
      if (this.curPatientVisitDetail.episode.startStopReason === null) this.curPatientVisitDetail.episode.startStopReason = StartStopReason.find(this.curPatientVisitDetail.episode.startStopReason_id)
      if (this.curPatientVisitDetail.episode.episodeType === null) this.curPatientVisitDetail.episode.episodeType = EpisodeType.find(this.curPatientVisitDetail.episode.episodeType_id)
      if (this.curPatientVisitDetail.episode.clinicSector === null) this.curPatientVisitDetail.episode.clinicSector = ClinicSector.find(this.curPatientVisitDetail.episode.clinicSector_id)
      SessionStorage.set(this.curPatientVisitDetail.episode.patientServiceIdentifier.service.code, this.curPatientVisitDetail)
      this.selectedClinicalService = null
      this.inFormEdition = false
      this.checkPrescribedDrugs()
      if (this.isEditPackStep) this.isAlreadyEdited = true
    },
    setCurVisitDetails () {
      this.spetialPrescription = false
      this.mustBeSpetial = false
      this.showServiceDrugsManagement = false
      this.curPatientVisitDetail = new PatientVisitDetails(SessionStorage.getItem(this.selectedClinicalService.code))
      this.visitClone = new PatientVisitDetails(JSON.parse(JSON.stringify(this.curPatientVisitDetail)))
      this.spetialPrescription = this.curPatientVisitDetail.prescription.special
      this.mustBeSpetial = this.curPatientVisitDetail.prescription.special
      if (this.curPatientVisitDetail.prescription.prescribedDrugs.length > 0) {
        this.prescribedDrugs = this.curPatientVisitDetail.prescription.prescribedDrugs
        this.showServiceDrugsManagement = true
      }
      if (!this.visitClone.prescription.special) {
      if (!(this.isNewPackStep || this.isEditPackStep)) {
        const identifier = PatientServiceIdentifier.query()
                                                   .with(['episodes.patientVisitDetails.pack', 'episodes.patientVisitDetails.prescription.duration', 'episodes.patientVisitDetails.prescription.prescriptionDetails.*'])
                                                   .with('service')
                                                   .where('id', this.curPatientVisitDetail.episode.patientServiceIdentifier.id)
                                                   .first()
        if (identifier.lastVisitPrescription() !== null) {
          const prescription = identifier.lastVisitPrescription().prescription
          if (prescription !== null) {
            prescription.patientVisitDetails = PatientVisitDetails.query()
                                                                   .with('pack')
                                                                   .where('prescription_id', prescription.id)
                                                                   .get()
          }
          if (prescription.leftDuration > 0) {
            this.lastVisitPrescription = prescription
            this.displayAlert('confirmation', 'O paciente possui uma prescrição válida para o serviço de ' + identifier.service.description + ', deseja anular a mesma e continuar com a criação da nova prescrição especial?')
          }
        }
      }
      }
    },
    doOnContinue (object) {
      this.spetialPrescription = true
      this.mustBeSpetial = true
      this.curPatientVisitDetail.prescription.special = true
    },
    doOnYes (object) {
      const patientVDetails = object.patientVDetails
      patientVDetails.pack.nextPickUpDate = object.nextPickUpDate
    //  patientVDetails.pack.pickupDate = object.pickupDate
      patientVDetails.pack.packagedDrugs.forEach((pd) => {
        if (pd.toContinue) {
          pd.nextPickUpDate = object.nextPickUpDate
        }
      })

      this.patientVisit.patientVisitDetails.forEach((pvd) => {
        if (pvd.id === patientVDetails.id) {
          pvd = patientVDetails
        }
      })

      if (this.mobile) {
        this.doMobileSave()
      } else {
        this.doWebSave()
      }
    },
    doOnNo (object) {
      if (this.mobile) {
        this.doMobileSave()
      } else {
        this.doWebSave()
      }
    },
    doOnCancel () {
      this.selectedClinicalService = new ClinicalService()
    },
    cancelYesNo () {
      this.alert.visible = false
    },

    checkClinicalServiceAttr (attr) {
      if (this.selectedClinicalService === '' || this.selectedClinicalService === null || this.selectedClinicalService === undefined) return false
      const has = this.selectedClinicalService.attributes.some((attribute) => {
        return attribute.clinicalServiceAttributeType.code === attr
      })
      return has
    },
    updatePrescribedDrugs (prescribedDrugs, pickupDate, nextPDate, duration) {
      if (!this.curPatientVisitDetail.createPackLater && this.curPatientVisitDetail.pack !== null) {
        this.curPatientVisitDetail.prescription.prescribedDrugs = JSON.parse(JSON.stringify(prescribedDrugs))
        if (pickupDate !== null && pickupDate !== undefined) this.curPatientVisitDetail.pack.packDate = this.getJSDateFromDDMMYYY(pickupDate)
        if (pickupDate !== undefined) this.curPatientVisitDetail.pack.pickupDate = this.getJSDateFromDDMMYYY(pickupDate)
        if (nextPDate !== undefined) this.curPatientVisitDetail.pack.nextPickUpDate = this.getJSDateFromDDMMYYY(nextPDate)
        if (duration !== undefined) this.curPatientVisitDetail.pack.weeksSupply = duration.weeks
      }
    },

    validateForm () {
      // this.$refs.clinicalService.validate()
      if (this.hasTherapeuticalRegimen) this.$refs.therapeuticRegimen.validate()
      if (this.hasTherapeuticalLine) this.$refs.therapeuticLine.validate()
      if (this.spetialPrescription) this.$refs.spetialMotive.validate()
      this.$refs.duration.validate()
      this.$refs.doctor.validate()
      this.$refs.patientStatus.validate()
      // if (this.hasPatientType) this.$refs.patientType.validate()
      this.$refs.dispenseType.validate()

      if (!this.$refs.patientStatus.hasError &&
          // !this.$refs.clinicalService.hasError &&
          // (this.hasTherapeuticalRegimen && !this.$refs.therapeuticRegimen.hasError) &&
          // (this.hasTherapeuticalLine && !this.$refs.therapeuticLine.hasError) &&
          !this.$refs.duration.hasError &&
          !this.$refs.doctor.hasError &&
          // (this.hasPatientType && !this.$refs.patientType.hasError) &&
          !this.$refs.dispenseType.hasError) {
            if (this.getJSDateFromDDMMYYY(this.prescriptionDate) < new Date(this.curPatientVisitDetail.episode.episodeDate)) {
              this.displayAlert('error', 'A data da prescrição não deve ser anterior a data de inicio do tratamento no sector corrente')
            } else if (this.spetialPrescription && this.$refs.hasError) {
              this.displayAlert('error', 'Prescrição especial')
            } else if (new Date(this.pickupDate) > new Date()) {
              this.displayAlert('error', 'A data da prescrição indicada é maior que a data da corrente')
            } else {
              this.curPatientVisitDetail.prescription.prescriptionDate = this.getJSDateFromDDMMYYY(this.prescriptionDate)
              this.showServiceDrugsManagement = true
            }
      }
    },
    doValidationToDispense () {
      this.curPatientVisitDetails = []
      this.clinicalServices.forEach((service) => {
        if (SessionStorage.getItem(service.code).prescription.prescribedDrugs.length > 0) {
          this.curPatientVisitDetails.push(SessionStorage.getItem(service.code))
        }
      })
      let hasSomePrescribed = true
      if (this.curPatientVisitDetails.length <= 0) hasSomePrescribed = false
      let hasError = false
      let error = ''
      if (hasSomePrescribed) {
      Object.keys(this.curPatientVisitDetails).forEach(function (k) {
        const visitDetails = this.curPatientVisitDetails[k]
        this.selectedClinicalService = visitDetails.episode.patientServiceIdentifier.service
        if (visitDetails.createPackLater) {
          hasSomePrescribed = true
        }
        const tempPvd = new PatientVisitDetails(JSON.parse(JSON.stringify(visitDetails)))
          if (this.isNewPackStep) {
            tempPvd.prescription.leftDuration = Number(tempPvd.prescription.leftDuration)
          } else {
            tempPvd.prescription.leftDuration = Number((Number(tempPvd.prescription.duration.weeks)) / 4)
          }
          visitDetails.prescription.leftDuration = tempPvd.prescription.leftDuration
        if (!visitDetails.createPackLater && visitDetails.prescription.prescribedDrugs.length > 0) {
          hasSomePrescribed = true
          if (Number(visitDetails.pack.weeksSupply) <= 0) {
            hasError = true
            const errorMsg = 'Por favor indicar o período para o qual pretende efectuar a dispensa dos medicamento de'
            error = error === '' ? errorMsg + ' ' + this.selectedClinicalService.description : error + ', ' + errorMsg + ' ' + this.selectedClinicalService.description
          } else if ((Number((visitDetails.pack.weeksSupply / 4)) > Number(tempPvd.prescription.leftDuration))) {
            hasError = true
            const errorMsg = 'O Período para o qual pretende efectuar a dispensa é maior que o período remanescente na prescrição de'
            error = error === '' ? errorMsg + ' ' + this.selectedClinicalService.description : error + ', ' + errorMsg + ' ' + this.selectedClinicalService.description
          } else if ((Number((visitDetails.pack.weeksSupply / 4)) > Number(tempPvd.prescription.leftDuration))) {
            hasError = true
            const errorMsg = 'O Período para o qual pretende efectuar a dispensa é maior que o período de validade da prescrição de'
            error = error === '' ? errorMsg + ' ' + this.selectedClinicalService.description : error + ', ' + errorMsg + ' ' + this.selectedClinicalService.description
          } else if (new Date(visitDetails.pack.pickupDate) > new Date()) {
            hasError = true
            error = 'A data de levantamento indicada é maior que a data corrente'
          } else if (this.dispenseMode === null || this.dispenseMode === undefined || this.dispenseMode === '') {
            hasError = true
            error = 'Por favor indicar o modo da dispensa.'
          } else if (visitDetails.prescription.prescribedDrugs.length > 0) {
            if (!this.isNewPackStep || !this.isEditPackStep || !this.isFirstPack) {
              visitDetails.patientVisit.visitDate = new Date(visitDetails.prescription.prescriptionDate)
              visitDetails.patientVisit = null
            }
            error = this.generatePacks(visitDetails)
            if (error !== undefined && error !== null && error.length > 0) {
              hasError = true
            }
          } else {
            if (visitDetails.prescription.prescribedDrugs.length > 0) {
              if (!this.isNewPackStep || !this.isEditPackStep) {
                visitDetails.patientVisit.visitDate = new Date(visitDetails.prescription.prescriptionDate)
                visitDetails.patientVisit = null
              }
            }
          }
        }
      }.bind(this))
      } else {
        this.displayAlert('error', 'Por favor indicar os medicamentos a dispensar.')
      }
      if (hasSomePrescribed) {
        if (!hasError) {
          this.proccedToDispense()
        } else {
          this.displayAlert('error', error)
        }
      }
    },
    initPackageStock (stock, drug, quantitySupplied) {
      const packagedDrugStock = new PackagedDrugStock()
      packagedDrugStock.drug = drug
      packagedDrugStock.stock = stock
      packagedDrugStock.quantitySupplied = quantitySupplied
      packagedDrugStock.creationDate = new Date()
      return packagedDrugStock
    },
    generatePacks (visitDetails) {
      Object.keys(visitDetails.prescription.prescribedDrugs).forEach(function (k) {
        const packagedDrugStocks = []
        const stocksToMoviment = []
        const prescribedDrug = visitDetails.prescription.prescribedDrugs[k]
        let qtyPrescribed = prescribedDrug.qtyPrescribed
        const packDrug = new PackagedDrug()
        const stocks = Stock.query()
                            .with(['clinic.*'])
                            .with(['entrance.clinic.province', 'entrance.clinic.district.province', 'entrance.clinic.facilityType'])
                            .with(['center.clinic.province', 'center.clinic.district.province', 'center.clinic.facilityType'])
                            .with(['drug.form', 'drug.clinicalService.identifierType'])
                            .where('drug_id', prescribedDrug.drug.id)
                            .orderBy('expireDate', 'asc')
                            .get()
        const validStock = stocks.filter((item) => {
          return new Date(item.expireDate) > new Date() && item.stockMoviment > 0
        })
        if (validStock !== undefined && validStock !== null) {
          let avalivableStock = 0
          validStock.forEach((vs) => {
            avalivableStock += vs.stockMoviment
          })
          if (avalivableStock >= qtyPrescribed) {
            let i = 0
            while (qtyPrescribed > 0) {
              if (validStock[i].stockMoviment >= qtyPrescribed) {
                validStock[i].stockMoviment = Number(validStock[i].stockMoviment - qtyPrescribed)
                stocksToMoviment.push(validStock[i])
                qtyPrescribed = 0
                // const pkstock = this.initPackageStock(validStock[i], prescribedDrug.drug, prescribedDrug.qtyPrescribed)
                const packagedDrugStock = new PackagedDrugStock()
                packagedDrugStock.drug = prescribedDrug.drug
                packagedDrugStock.stock = validStock[i]
                packagedDrugStock.quantitySupplied = prescribedDrug.qtyPrescribed
                packagedDrugStock.creationDate = new Date()
                packagedDrugStocks.push(packagedDrugStock)
              } else {
                const availableBalance = validStock[i].stockMoviment
                qtyPrescribed = Number(qtyPrescribed - validStock[i].stockMoviment)
                validStock[i].stockMoviment = 0
                stocksToMoviment.push(validStock[i])
                const packagedDrugStock = new PackagedDrugStock()
                packagedDrugStock.drug = prescribedDrug.drug
                packagedDrugStock.stock = validStock[i]
                packagedDrugStock.quantitySupplied = availableBalance
                packagedDrugStock.creationDate = new Date()
                i = i + 1
              }
            }
            packDrug.packagedDrugStocks = packagedDrugStocks
            packDrug.quantitySupplied = prescribedDrug.qtyPrescribed
            packDrug.drug = prescribedDrug.drug
            packDrug.toContinue = prescribedDrug.toContinue
            visitDetails.pack.packagedDrugs.push(packDrug)
          } else {
            return 'Não existe stock suficiente do medicamento ' + prescribedDrug.drug.name
          }
        } else {
          return 'Não existe stock suficiente do medicamento ' + prescribedDrug.drug.name
        }
      })
    },
    proccedToDispense () {
      const encode64Credentials = localStorage.getItem('encodeBase64')

      if (this.isNewPackStep || this.isEditPackStep || this.isFirstPack) {
        this.curPatientVisitDetails[0].patientVisit = null
        this.curPatientVisitDetails[0].prescription.patientVisitDetails = null
        this.curPatientVisitDetails[0].prescription.prescriptionDetails[0].prescription = null
      }
      this.patientVisit.patientVisitDetails = []
      if (this.member !== null && this.member !== undefined) {
        this.curPatientVisitDetails[0].prescription.prescriptionDate = this.getJSDateFromDDMMYYY(this.prescriptionDate)
        this.curPatientVisitDetails[0].prescription.leftDuration = Number((this.curPatientVisitDetails[0].prescription.duration.weeks / 4))
          const memberPrescription = new GroupMemberPrescription({
            prescription: this.curPatientVisitDetails[0].prescription,
            member: GroupMember.query()
                              .with('patient')
                              .where('id', SessionStorage.getItem('selectedMember').id)
                              .first(),
            used: false
          })
          memberPrescription.member.clinic = Clinic.query()
                                                  .with('province')
                                                  .with('district.province')
                                                  .with('facilityType')
                                                  .where('id', SessionStorage.getItem('currClinic').id)
                                                  .first()
          memberPrescription.member.group = Group.query()
                                                  .with('service.identifierType')
                                                  .with('groupType')
                                                  .with(['clinic.province', 'clinic.district.province', 'clinic.facilityType'])
                                                  .where('id', SessionStorage.getItem('selectedGroup').id)
                                                  .first()
          memberPrescription.member.patient = Patient.query()
                                                      .with('province')
                                                      .with('district.province')
                                                      .with(['clinic.province', 'clinic.district.province', 'clinic.facilityType'])
                                                      .where('id', this.member.patient.id)
                                                      .first()
          memberPrescription.prescription.doctor = Doctor.query().with(['clinic.province', 'clinic.district.province', 'clinic.facilityType']).where('id', memberPrescription.prescription.doctor.id).first()
          memberPrescription.prescription.prescriptionDetails[0].therapeuticRegimen = TherapeuticRegimen.query()
                                                                                                        .with('clinicalService.identifierType')
                                                                                                        .has('code')
                                                                                                        .where('active', true)
                                                                                                        .where('id', memberPrescription.prescription.prescriptionDetails[0].therapeuticRegimen.id)
                                                                                                        .first()
          if (this.mobile) {
            memberPrescription.prescription.doctor_id = memberPrescription.prescription.doctor.id
            memberPrescription.prescription.clinic_id = memberPrescription.prescription.clinic.id
            memberPrescription.prescription.duration_id = memberPrescription.prescription.duration.id

            memberPrescription.prescription.prescriptionDetails[0].prescription_id = memberPrescription.prescription.id
            memberPrescription.prescription.prescriptionDetails[0].therapeutic_line_id = memberPrescription.prescription.prescriptionDetails[0].therapeuticLine.id
            memberPrescription.prescription.prescriptionDetails[0].therapeutic_regimen_id = memberPrescription.prescription.prescriptionDetails[0].therapeuticRegimen.id
            memberPrescription.prescription.prescriptionDetails[0].dispense_type_id = memberPrescription.prescription.prescriptionDetails[0].dispenseType.id
            if (memberPrescription.prescription.prescriptionDetails[0].spetialPrescriptionMotive !== null) {
              memberPrescription.prescription.prescriptionDetails[0].spetialPrescriptionMotive_id = memberPrescription.prescription.prescriptionDetails[0].spetialPrescriptionMotive.id
            }

            memberPrescription.prescription.prescribedDrugs.forEach((pDrug) => {
              pDrug.prescription_id = memberPrescription.prescription.id
              pDrug.drug_id = pDrug.drug.id
            })

            Prescription.localDbAdd(memberPrescription.prescription)
            memberPrescription.prescription.prescribedDrugs = []
            GroupMemberPrescription.localDbAdd(memberPrescription)
            this.displayAlert('info', 'Prescrição gravada com sucesso.')
          } else {
            Prescription.apiSave(memberPrescription.prescription).then(resp => {
              memberPrescription.prescription.id = resp.response.data.id
              memberPrescription.prescription.$id = resp.response.data.id
              memberPrescription.prescription.prescribedDrugs = []
              memberPrescription.prescription.prescriptionDetails[0].id = resp.response.data.prescriptionDetails[0].id
              GroupMemberPrescription.apiSave(memberPrescription).then(resp1 => {
                GroupMemberPrescription.apiFetchByMemberId(this.member.id).then(respd => {
                  if (respd.response.status === 200) {
                    Prescription.apiFetchById(respd.response.data.prescription.id)
                  }
                })
                this.displayAlert('info', 'Prescrição gravada com sucesso.')
                this.$emit('getGroupMembers')
              })
            })
        }
      } else {
          Object.keys(this.curPatientVisitDetails).forEach(function (k) {
          const visitDetails = Object.assign({}, this.curPatientVisitDetails[k])
          if (visitDetails.prescription.prescribedDrugs.length > 0) {
            if (!visitDetails.createPackLater) {
              visitDetails.pack.dispenseMode = this.dispenseMode
              visitDetails.pack.providerUuid = encode64Credentials
              visitDetails.pack.syncStatus = this.patient.his_id.length > 10 ? 'R' : 'N'
            } else {
              visitDetails.pack = null
            }
            if (this.isFirstPack && visitDetails.prescription.id !== null) {
              visitDetails.clinic = this.currClinic
            }
            this.patientVisit.visitDate = visitDetails.pack.pickupDate
            this.patientVisit.patientVisitDetails.push(visitDetails)
          }
        }.bind(this))
        this.patientVisit.patient = this.simplePatient
        this.patientVisit.clinic = this.currClinic
        const packDateError = this.setRelationIdentifiers()

        if (this.mobile) {
          if (!packDateError) this.doMobileSave()
        } else {
          /* this.patientVisit.patientVisitDetails.forEach((pvd) => {
            const tempPvd = new PatientVisitDetails(JSON.parse(JSON.stringify(pvd)))
            if (this.isNewPackStep) {
              tempPvd.prescription.leftDuration = Number((((Number(tempPvd.prescription.leftDuration * 4)) - Number(tempPvd.pack.weeksSupply)) / 4))
            } else {
              tempPvd.prescription.leftDuration = Number((Number(tempPvd.prescription.duration.weeks) - Number(tempPvd.pack.weeksSupply)) / 4)
            }
            console.log(tempPvd)
            pvd = tempPvd
            if (this.lastPackFull !== null) {
            const pickUpDiferrence = moment(this.lastPackFull.nextPickUpDate).diff(moment(pvd.pack.pickupDate), 'days')
              if (pickUpDiferrence > 0) {
                packDateError = true
                this.msgObject.patientVDetails = pvd
                this.msgObject.patientVisit = this.patientVisit
                this.msgObject.nextPickUpDate = moment(pvd.pack.nextPickUpDate, 'DD-MM-YYYY').add('d', pickUpDiferrence)
                this.displayAlert('YesNo', 'O paciente ainda possui medicamentos em casa provenientes da ultima dispensa, O sistema pode ajustar a data do proximo levantamento desta dispensa tendo em conta os medicamentos citados?')
              }
            }
          }) */
          if (!packDateError) this.doWebSave()
        }
      }
    },
    setRelationIdentifiers () {
      let packDateError = false
      this.patientVisit.clinic_id = this.patientVisit.clinic.id
          this.patientVisit.patient_id = this.patientVisit.patient.id
          if (this.mobile) {
            if (this.patientVisit.syncStatus === 'S' && this.isEditPackStep) {
              this.patientVisit.syncStatus = 'U'
            } else {
              this.patientVisit.syncStatus = 'R'
            }
          }
          this.patientVisit.patientVisitDetails.forEach((tempPvd) => {
            const pvd = new PatientVisitDetails(JSON.parse(JSON.stringify(tempPvd)))
            if (pvd.episode.startStopReason === null) pvd.episode.startStopReason = StartStopReason.find(pvd.episode.startStopReason_id)
            if (pvd.episode.episodeType === null) pvd.episode.episodeType = EpisodeType.find(pvd.episode.episodeType_id)
            if (pvd.episode.clinicSector === null) pvd.episode.clinicSector = ClinicSector.find(pvd.episode.clinicSector_id)
            pvd.episode_id = pvd.episode.id
            pvd.clinic_id = pvd.clinic.id
            pvd.patient_visit_id = this.patientVisit.id
            pvd.prescription_id = pvd.prescription.id
            pvd.pack_id = pvd.pack.id

            if (pvd.prescription.syncStatus === '' || (pvd.prescription.syncStatus === 'R' && this.isEditPackStep)) {
              pvd.prescription.syncStatus = 'R'
            } else if (pvd.prescription.syncStatus === 'S' && this.isEditPackStep) {
              pvd.prescription.syncStatus = 'U'
            }

            pvd.prescription.doctor_id = pvd.prescription.doctor.id
            pvd.prescription.clinic_id = pvd.prescription.clinic.id
            pvd.prescription.duration_id = pvd.prescription.duration.id

            pvd.prescription.prescriptionDetails[0].prescription_id = pvd.prescription.id
            pvd.prescription.prescriptionDetails[0].therapeutic_line_id = pvd.prescription.prescriptionDetails[0].therapeuticLine.id
            if (pvd.prescription.prescriptionDetails[0].therapeuticRegimen !== null) {
                pvd.prescription.prescriptionDetails[0].therapeutic_regimen_id = pvd.prescription.prescriptionDetails[0].therapeuticRegimen.id
            }
            pvd.prescription.prescriptionDetails[0].dispense_type_id = pvd.prescription.prescriptionDetails[0].dispenseType.id
            if (pvd.prescription.prescriptionDetails[0].spetialPrescriptionMotive !== null) {
              pvd.prescription.prescriptionDetails[0].spetialPrescriptionMotive_id = pvd.prescription.prescriptionDetails[0].spetialPrescriptionMotive.id
            }

             pvd.prescription.prescribedDrugs.forEach((pDrug) => {
              pDrug.prescription_id = pvd.prescription.id
              pDrug.drug_id = pDrug.drug.id
            })

            pvd.pack.dispenseMode_id = pvd.pack.dispenseMode.id
            pvd.pack.clinic_id = pvd.pack.clinic.id

            pvd.pack.packagedDrugs.forEach((pDrug) => {
              pDrug.pack_id = pvd.pack.id
              pDrug.drug_id = pDrug.drug.id
              pDrug.packagedDrugStocks.forEach((pDrugStock) => {
                pDrugStock.pack_id = pvd.pack.id
                pDrugStock.drug_id = pDrugStock.drug.id
                pDrugStock.stock_id = pDrugStock.stock.id
                pDrugStock.packagedDrug_id = pDrug.id
              })
            })
            if (this.isNewPackStep) {
              pvd.prescription.leftDuration = Number((((Number(pvd.prescription.leftDuration * 4)) - Number(tempPvd.pack.weeksSupply)) / 4))
            } else {
              pvd.prescription.leftDuration = Number((Number(pvd.prescription.duration.weeks) - Number(tempPvd.pack.weeksSupply)) / 4)
            }
            if (this.lastPackFull !== null && !this.isEditPackStep) {
              const pickUpDiferrence = moment(this.lastPackFull.nextPickUpDate).diff(moment(pvd.pack.pickupDate), 'days')
              if (pickUpDiferrence > 0) {
                packDateError = true
                this.msgObject.patientVDetails = pvd
                this.msgObject.patientVisit = this.patientVisit
                this.msgObject.nextPickUpDate = moment(pvd.pack.nextPickUpDate, 'YYYY-MM-DD').add('d', pickUpDiferrence).toDate()
                this.displayAlert('YesNo', 'O paciente ainda possui medicamentos em casa provenientes da ultima dispensa, O sistema pode ajustar a data do proximo levantamento desta dispensa tendo em conta os medicamentos citados?')
              }
            }
            // tempPvd = pvd
            const index = this.patientVisit.patientVisitDetails.findIndex(o => o.pack.id === tempPvd.pack.id)
            this.patientVisit.patientVisitDetails.splice(index, 1, pvd)
          })
          return packDateError
    },
    doMobileSave () {
      if (this.isEditPackStep) {
        PatientVisit.localDbGetById(this.patientVisit.id).then(patientVisit => {
          this.addOrRemoveStockPackagedDrugs(patientVisit, false)
          PatientVisit.localDbUpdate(JSON.parse(JSON.stringify(this.patientVisit))).then(response => {
            this.loadVitisToVueX(JSON.parse(JSON.stringify(this.patientVisit)))
            this.addOrRemoveStockPackagedDrugs(this.patientVisit, true)
            this.displayAlert('info', 'Dispensa actualizada com sucesso.')
          })
          .catch(error => {
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
        })
      } else {
        PatientVisit.localDbAdd(JSON.parse(JSON.stringify(this.patientVisit))).then(response => {
          this.loadVitisToVueX(JSON.parse(JSON.stringify(this.patientVisit)))
          this.addOrRemoveStockPackagedDrugs(this.patientVisit, true)
            this.displayAlert('info', !this.hasVisitsToPackNow ? 'Prescrição gravada com sucesso.' : 'Dispensa efectuada com sucesso.')
          })
          .catch(error => {
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
      }
    },
    doWebSave () {
      if (!this.isEditPackStep) {
        PatientVisit.apiSave(JSON.parse(JSON.stringify(this.patientVisit))).then(resp => {
          const pv = JSON.parse(JSON.stringify(this.patientVisit))
          PatientVisit.insert({ data: pv })
          pv.patientVisitDetails.forEach((pvd) => {
            PatientVisitDetails.insertOrUpdate({ data: pvd })
            Prescription.insertOrUpdate({ data: pvd.prescription })
            Pack.insertOrUpdate({ data: pvd.pack })
          })
          this.displayAlert('info', !this.hasVisitsToPackNow ? 'Prescrição gravada com sucesso.' : 'Dispensa efectuada com sucesso.')
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
      } else {
        console.log(JSON.parse(JSON.stringify(this.patientVisit)))
        PatientVisit.apiUpdate(JSON.parse(JSON.stringify(this.patientVisit))).then(resp => {
          const pv = JSON.parse(JSON.stringify(this.patientVisit))
          PatientVisit.update({ where: pv.id, data: pv })
          pv.patientVisitDetails.forEach((pvd) => {
            PatientVisitDetails.insertOrUpdate({ data: pvd })
            Prescription.insertOrUpdate({ data: pvd.prescription })
            Pack.delete(pvd.pack.id)
            PackagedDrug.deleteAll()
            Pack.insertOrUpdate({ data: pvd.pack })
          })
          this.displayAlert('info', !this.hasVisitsToPackNow ? 'Prescrição gravada com sucesso.' : 'Dispensa efectuada com sucesso.')
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
      }
    },
    async loadVitisToVueX (pv) {
      PatientVisit.localDbGetById(pv.id).then(visit => {
       PatientVisit.insert({ data: visit })
       visit.patientVisitDetails.forEach((pvd) => {
          PatientVisitDetails.localDbGetById(pvd.id).then(visitDetails => {
            if (visitDetails !== null && visitDetails !== undefined) {
              PatientVisitDetails.insert({ data: visitDetails })
            }
      })
      Prescription.localDbGetById(pvd.prescription_id).then(prescription => {
        if (prescription !== null && prescription !== undefined) {
          Prescription.insert({ data: prescription })
        }
        })
        Pack.localDbGetById(pvd.pack_id).then(pack => {
          if (pack !== null && pack !== undefined) {
            Pack.delete(pvd.pack.id)
            PackagedDrug.deleteAll()
            Pack.insertOrUpdate({ data: pvd.pack })
          Pack.insert({ data: pack })
          }
        })
       })
     })
    },
    fecthVisit (id) {
      PatientVisit.apiFetchById(id).then(resp => {
        this.fecthVisitDetails(resp.response.data.patientVisitDetails[0].id)
        this.fecthPrescription(resp.response.data.patientVisitDetails[0].prescription.id)
        if (resp.response.data.patientVisitDetails[0].pack !== null) this.fecthPack(resp.response.data.patientVisitDetails[0].pack.id)
      })
    },
    fecthVisitDetails (id) {
      PatientVisitDetails.apiFetchById(id).then(resp => {
      })
    },
    fecthPrescription (id) {
      Prescription.apiFetchById(id).then(resp => {
        PrescriptionDetail.apiFetchById(resp.response.data.prescriptionDetails[0].id)
      })
    },
    fecthPack (id) {
      Pack.apiFetchById(id).then(resp => {
      })
    },
    doDispenseModeGetAll (offset) {
         DispenseMode.api().get('/dispenseMode?offset=' + offset + '&max=100').then(resp => {
            offset = offset + 100
            if (resp.response.data.length > 0) {
              setTimeout(this.doDispenseModeGetAll(offset), 2)
            }
            })
    },
    getJSDateFromDDMMYYY (dateString) {
      if (dateString === null || dateString === undefined) return null
      if (typeof dateString === 'string' || dateString instanceof String) {
      const dateParts = dateString.split('-')
      return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0])
      } else {
        return dateString
      }
    },
    getDDMMYYYFromJSDate (jsDate) {
      return moment(jsDate).format('DD-MM-YYYY')
    },
    checkPrescribedDrugs () {
      const somePrescribed = this.clinicalServices.some((service) => {
        return SessionStorage.getItem(service.code).prescription.prescribedDrugs.length > 0
      })
      return somePrescribed
    },
    addOrRemoveStockPackagedDrugs (patientVisit, addDispense) {
      patientVisit.patientVisitDetails.forEach(pvd => {
            pvd.pack.packagedDrugs.forEach(pd => {
              pd.packagedDrugStocks.forEach(pds => {
                  Stock.localDbGetById(pds.stock.id).then(stock => {
                    if (addDispense) {
                      stock.stockMoviment -= pds.quantitySupplied
                    } else {
                      stock.stockMoviment += pds.quantitySupplied
                    }
                    stock.syncStatus = 'U'
                    Stock.localDbUpdate(stock)
                    StockEntrance.localDbGetById(stock.entrance.id).then(entrance => {
                     entrance.syncStatus = 'U'
                     StockEntrance.localDbUpdate(entrance)
                    })
                  })
              })
            })
          })
    }
  },
  computed: {
    hasPrescribdDrugs () {
      return this.checkPrescribedDrugs()
    },
    showDispenseMd () {
      return !this.inFormEdition && (this.member === null || this.member === undefined)
    },
    dispenseModes: {
        get () {
          return DispenseMode.query().where((dispenseMode) => {
            return dispenseMode.code.includes(this.mds)
          }).get()
        }
    },
    spetialPrescriptionMotives: {
      get () {
        return SpetialPrescriptionMotive.all()
      }
    },
    isFirstPack: {
      get () {
        return this.lastPackFull === null
      }
    },
    dispenseLabel: {
      get () {
        if (this.hasVisitsToPackNow) {
          return 'Dispensar'
        } else {
          return 'Gravar'
        }
      }
    },
    hasVisitsToPackLater: {
      get () {
        const pvds = []
        this.clinicalServices.forEach((cls) => {
          pvds.push(new PatientVisitDetails(SessionStorage.getItem(cls.code)))
        })
        const packLater = pvds.some((pvd) => {
          return pvd.createPackLater
        })
        return packLater
      }
    },
    hasVisitsToPackNow: {
      get () {
        const pvds = []
        this.clinicalServices.forEach((cls) => {
          pvds.push(new PatientVisitDetails(SessionStorage.getItem(cls.code)))
        })
        const packLater = pvds.some((pvd) => {
          return pvd.createPackLater === false
        })
        return packLater
      }
    },
    isNewPackStep: {
      get () {
        return this.step === 'addNewPack'
      }
    },
    isEditPackStep: {
      get () {
        return this.step === 'editPack'
      }
    },
    isNewPrescriptionStep: {
      get () {
        return this.curPatientVisitDetail.prescription.id === null
      }
    },
    lastPackFull: {
      get () {
        return Pack.query()
                  .with('packagedDrugs.*')
                  .with('patientVisitDetails')
                  .where('id', this.selectedVisitDetails.pack_id)
                  .orderBy('pickupDate', 'desc')
                  .first()
      }
    },
    lastPack: {
      get () {
        return Pack.query()
                  .withAll()
                  .where('id', this.curPatientVisitDetail.pack_id)
                  .orderBy('pickupDate', 'desc').first()
      }
    },
    curPrescription: {
      get () {
        return this.curPatientVisitDetail.prescription
      }
    },
    curPack: {
      get () {
        return this.curPatientVisitDetail.pack
      }
    },
    curPrescriptionDetails: {
      get () {
        if (this.curPrescription === null || this.curPrescription === undefined) return null
        return this.curPrescription.prescriptionDetails[0]
      }
    },
    hasTherapeuticalRegimen: {
      get () {
        return this.checkClinicalServiceAttr('THERAPEUTICAL_REGIMEN')
      }
    },
    hasTherapeuticalLine: {
      get () {
        return this.checkClinicalServiceAttr('THERAPEUTICAL_LINE')
      }
    },
    hasPatientType: {
      get () {
        return this.checkClinicalServiceAttr('PATIENT_TYPE')
      }
    },
    hasPrescriptionChangeMotive: {
      get () {
        return this.checkClinicalServiceAttr('PRESCRIPTION_CHANGE_MOTIVE')
      }
    },
    patient: {
      get () {
        return Patient.query().with('identifiers.*')
                              .with('province')
                              .with('attributes')
                              .with('appointments')
                              .with('district')
                              .with('postoAdministrativo')
                              .with('bairro')
                              .with('clinic.*')
                              .where('id', this.selectedPatient.id)
                              .first()
      }
    },
    simplePatient: {
      get () {
        return Patient.query().where('id', this.selectedPatient.id).first()
      }
    },
    therapeuticRegimens: {
      get () {
        if (this.selectedClinicalService === null) return []
        return TherapeuticRegimen.query()
                                .with('clinicalService.identifierType')
                                .has('code')
                                .where('active', true)
                                .where('clinical_service_id', this.selectedClinicalService.id)
                                .orderBy('description')
                                .get()
      }
    },
    therapeuticLines: {
      get () {
        return TherapeuticLine.all()
      }
    },
    doctors: {
      get () {
        return Doctor.query().with(['clinic.province', 'clinic.district.province', 'clinic.facilityType']).where('clinic_id', this.currClinic.id)
                    .get()
      }
    },
    dispenseTypes: {
      get () {
        return DispenseType.all()
      }
    },
    durations: {
      get () {
        return Duration.query().orderBy('weeks', 'asc').get()
      }
    }
  },
  created () {
    this.init()
  },
  components: {
    ServiceDrugsManagement: require('components/Patient/PatientPanel/ServiceDrugsManagement.vue').default,
    ListHeader: require('components/Shared/ListHeader.vue').default
  }
}
</script>

<style lang="scss">
  .prescription-box {
    border: 1px solid $grey-4;
  }
  .box-border {
    border: 1px solid $grey-4
  }
</style>
