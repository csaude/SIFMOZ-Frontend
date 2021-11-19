<template>
  <q-card>
      <q-card-section class="q-pa-none" >
        <div class="row items-center text-subtitle1 q-pa-md">
          <q-icon  :name="patient.gender == 'Femenino' ? 'female' : 'male'" size="md" color="primary"/>
          <div class="text-bold text-grey-10 q-ml-sm">{{patient.fullName}}</div>
          <div class="text-grey-10 q-ml-sm"><span class="text-bold text-h6">|</span> {{patient.gender}}</div>
          <div class="text-grey-10 q-ml-sm"><span class="text-bold text-h6">|</span> {{patient.age()}} Anos de Idade</div>
        </div>
        <q-separator/>
      </q-card-section>

      <q-card-section>
        <div class="text-center text-subtitle1">Prescrição</div>
        <div class="row q-mt-md">
          <div class="col-3 panel">
            <ListHeader
              :addVisible="false"
              :mainContainer="true"
              bgColor="bg-primary"
              @showAdd="showAddEpisode = true">Adicionar Prescrição
            </ListHeader>
            <div class="q-ma-md">
              <q-select
                  class="col"
                  dense outlined
                  :disable="isNewPackStep || isEditPackStep"
                  options-dense
                  :options="clinicalServices"
                  ref="clinicalService"
                  :rules="[ val => !!val || 'Por favor indicar o serviço clínico']"
                  v-model="selectedClinicalService"
                  @blur="setCurVisitDetails"
                  option-value="id"
                  option-label="code"
                  label="Serviço de Saúde e Sector Associado" />
              <q-input
                dense
                outlined
                class="col"
                v-model="prescriptionDate"
                :disable="isNewPackStep || isEditPackStep"
                mask="date"
                ref="prescriptionDate"
                :rules="['date']"
                label="Data da Prescrição">
                <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                        <q-date v-model="prescriptionDate">
                        <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                        </q-date>
                    </q-popup-proxy>
                    </q-icon>
                </template>
              </q-input>
              <q-select
                  v-if="hasTherapeuticalRegimen"
                  class="col"
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
                  class="col"
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
                  class="col"
                  dense outlined
                  v-model="curPrescription.duration"
                  :options="durations"
                  :disable="isNewPackStep || isEditPackStep"
                  ref="duration"
                  :rules="[ val => !!val || 'Por favor indicar a duração']"
                  option-value="id"
                  option-label="description"
                  label="Duração [1S, 2S, 1M, 2M, ...]" />
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
              <div>
                <div class="row items-center q-mb-sm">
                    <span class="text-subtitle2">Informação Adicional</span>
                </div>
                <q-separator color="grey-13" size="1px" class="q-mb-sm"/>
              </div>
              <q-select
                  v-if="hasPatientType"
                  class="col"
                  dense outlined
                  ref="patientType"
                  :disable="isNewPackStep || isEditPackStep"
                  :rules="[ val => !!val || 'Por favor indicar o tipo de paciente']"
                  v-model="curPrescription.patientType"
                  :options="patientTypes"
                  label="Tipo Paciente [Inicio, Manter, Alterar]" />
                <q-select
                  v-if="hasPrescriptionChangeMotive"
                  class="col q-mb-sm"
                  :disable="isNewPackStep || isEditPackStep"
                  ref="reasonForUpdate"
                  dense outlined
                  option-value="code"
                  :options="reasonsForUpdate"
                  v-model="curPrescriptionDetails.reasonForUpdate"
                  option-label="description"
                  label="Motivo Alteração [FT, Alergia ...]" />
                <q-select
                  class="col"
                  dense outlined
                  ref="dispenseType"
                  :disable="isNewPackStep || isEditPackStep"
                  :rules="[ val => !!val || 'Por favor indicar o tipo de dispensa']"
                  v-model="curPrescriptionDetails.dispenseType"
                  :options="dispenseTypes"
                  option-value="id"
                  option-label="description"
                  label="Paciente em [DM, DT, DS, DA]" />
                <q-select
                  class="col"
                  ref="patientStatus"
                  :rules="[ val => !!val || 'Por favor indicar a ituacao do paciente (em relação aos modelos)']"
                  v-model="curPrescription.patientStatus"
                  :disable="isNewPackStep || isEditPackStep"
                  :options="patientStatus"
                  dense outlined
                  label="Situacao do paciente (em relação aos modelos)" />
                <div class="row q-mb-sm">
                  <q-btn
                    unelevated
                    color="primary"
                    :disable="isNewPackStep || isEditPackStep"
                    label="Adicionar Medicamentos"
                    class="col all-pointer-events"
                    @click="validateForm()"/>
                </div>
            </div>
          </div>
          <div class="col q-mx-md">
          <span
              v-if="showServiceDrugsManagement">
              <div
                v-for="visitDetails in curPatientVisitDetails" :key="visitDetails.id" >
                <ServiceDrugsManagement
                  v-if="selectedClinicalService.code === visitDetails.episode.patientServiceIdentifier.service.code"
                  :selectedClinicalService="selectedClinicalService"
                  :hasTherapeuticalRegimen="hasTherapeuticalRegimen"
                  :lastPack="lastPack"
                  :step="step"
                  :prescription="curPatientVisitDetail.prescriptions[0]"
                  :oldPrescribedDrugs="prescribedDrugs"
                  @updatePrescribedDrugs="updatePrescribedDrugs"
                  :visitDetails="visitDetails"/>
              </div>
          </span>
          <div v-else class="vertical-middle">
            <q-banner rounded class="bg-orange-1 text-left text-orange-10">
              Nenhum Serviço de Saúde foi Seleccionado!.
            </q-banner>
          </div>
          <span
            class="text-right absolute-bottom q-mb-lg q-mr-lg q-mt-md no-pointer-events">
              <q-btn
                label="Cancelar"
                color="red"
                class="all-pointer-events"
                @click="$emit('close')"/>

              <q-btn
                v-if="selectedClinicalService !==''"
                label="Dispensar"
                @click="generatePacksAndDispense()"
                color="primary"
                class="q-ml-md all-pointer-events" />
            </span>
          </div>
        </div>
      </q-card-section>
      <q-dialog persistent v-model="showDispenseMode">
        <DispenseMode
          @proccedToDispense="proccedToDispense"
          @close="showDispenseMode = false" />
      </q-dialog>
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
export default {
  props: ['selectedVisitDetails', 'step'],
  data () {
    return {
      alert: ref({
        type: '',
        visible: false,
        msg: ''
      }),
      identifiers: [],
      patientVisit: new PatientVisit(),
      curPatientVisitDetails: [],
      curPatientVisitDetail: new PatientVisitDetails(),
      clinicalServices: [],
      selectedClinicalService: new ClinicalService(),
      reasonsForUpdate: ['FT', 'Alergia'],
      patientStatus: ['Novo', 'Manutenção'],
      patientTypes: ['Inicio', 'Manter', 'Alterar', 'Reinício'],
      showServiceDrugsManagement: false,
      prescriptionDate: '',
      showDispenseMode: false,
      prescribedDrugs: []
    }
  },
  methods: {
    initPatientVisit () {
      if (!this.isNewPackStep || !this.isEditPackStep) {
        this.patientVisit.visitDate = new Date()
      } else {
        this.patientVisit = PatientVisit.query()
                                        .with('clinic.*')
                                        .where('id', this.curPatientVisitDetail.patientVisit.id)
                                        .first()
      }
      this.patientVisit.clinic = this.currClinic
      this.patientVisit.patient = this.simplePatient
    },
    setCurVisitDetails () {
      this.showServiceDrugsManagement = false
      Object.keys(this.curPatientVisitDetails).forEach(function (k) {
        const visitDetails = this.curPatientVisitDetails[k]
        if (visitDetails.episode.patientServiceIdentifier.service.id === this.selectedClinicalService.id) {
          this.curPatientVisitDetail = visitDetails
        }
      }.bind(this))
    },
    initCurrPatientVisitDetails () {
      const pack = new Pack({
        clinic: this.currClinic
      })

      if (!this.isNewPackStep && !this.isEditPackStep) {
        const prescription = new Prescription({
          prescriptionDate: new Date(),
          clinic: this.currClinic
        })

        const prescriptionDetail = new PrescriptionDetail()
        prescription.prescriptionDetails.push(prescriptionDetail)

        this.curPatientVisitDetail.packs.push(pack)
        this.curPatientVisitDetail.prescriptions.push(prescription)
      } else {
        this.curPatientVisitDetail = PatientVisitDetails.query().with('clinic.*')
                                                                .with('episode.patientServiceIdentifier.service')
                                                                .with('patientVisit')
                                                                .with('prescriptions.*')
                                                                .where('id', this.selectedVisitDetails.id)
                                                                .first()
        this.curPatientVisitDetail.prescriptions[0].prescriptionDetails = PrescriptionDetail.query()
                                                                                            .withAll()
                                                                                            .where('id', this.curPatientVisitDetail.prescriptions[0].prescriptionDetails[0].id)
                                                                                            .get()
        this.prescriptionDate = this.curPatientVisitDetail.prescriptions[0].prescriptionDate

        this.selectedClinicalService = ClinicalService.query()
                                                      .with('attributes.*')
                                                      .with('therapeuticRegimens')
                                                      .with('identifierType')
                                                      .where('id', this.curPatientVisitDetail.episode.patientServiceIdentifier.service.id)
                                                      .first()
        this.curPatientVisitDetail.prescriptions[0].prescribedDrugs = PrescribedDrug.query()
                                                                                    .with('drug.*')
                                                                                    .where('prescription_id', this.curPatientVisitDetail.prescriptions[0].id)
                                                                                    .get()
        this.curPatientVisitDetail.packs[0] = this.lastPackFull

        const prescribedDrugs = this.curPatientVisitDetail.prescriptions[0].prescribedDrugs
        const packagedDrugs = this.curPatientVisitDetail.packs[0].packagedDrugs

        if (this.isEditPackStep) {
          this.prescribedDrugs = prescribedDrugs
        } else {
          Object.keys(prescribedDrugs).forEach(function (k) {
            const prescribedDrug = prescribedDrugs[k]
              Object.keys(packagedDrugs).forEach(function (k) {
                const packagedDrug = packagedDrugs[k]
                if (this.isNewPackStep && ((prescribedDrug.drug.id === packagedDrug.drug.id) && packagedDrug.toContinue)) {
                  this.prescribedDrugs.push(prescribedDrug)
                }
              }.bind(this))
          }.bind(this))

            this.curPatientVisitDetail.packs = []
            pack.pickupDate = this.lastPack.nextPickUpDate
            this.curPatientVisitDetail.packs.push(pack)
        }
        this.curPatientVisitDetails.push(this.curPatientVisitDetail)
        this.showServiceDrugsManagement = true
      }

      this.initPatientVisit()
    },
    init () {
      if (!this.isNewPackStep && !this.isEditPackStep) {
        Object.keys(this.patient.identifiers).forEach(function (key) {
          if (this.patient.identifiers[key].endDate === '') {
            const episode = Episode.query()
                                    .withAll()
                                    .where('patientServiceIdentifier_id', this.patient.identifiers[key].id)
                                    .orderBy('creationDate', 'desc')
                                    .first()
            this.clinicalServices.push(ClinicalService.query().with('attributes.*').where('id', this.patient.identifiers[key].service.id).first())
            if (!episode.closed()) {
              this.initPatientVisitDetails(episode)
            }
          }
        }.bind(this))
      }
    },
    initPatientVisitDetails (episode) {
      const pack = new Pack({
        clinic: this.currClinic
      })

      const prescription = new Prescription({
        prescriptionDate: new Date(),
        clinic: this.currClinic
      })

      const prescriptionDetail = new PrescriptionDetail()
      prescription.prescriptionDetails.push(prescriptionDetail)

      const curPatientVisitDetail = new PatientVisitDetails({
        patientVisit: this.patientVisit,
        clinic: this.currClinic,
        episode: Episode.query().with('patientServiceIdentifier.service').where('id', episode.id).first()
      })

      curPatientVisitDetail.packs.push(pack)
      curPatientVisitDetail.prescriptions.push(prescription)

      episode.patientVisitDetails.push(curPatientVisitDetail)
      this.curPatientVisitDetails.push(curPatientVisitDetail)
    },
    checkClinicalServiceAttr (attr) {
      if (this.selectedClinicalService === '') return false
      let v
      Object.keys(this.selectedClinicalService.attributes).forEach(function (k) {
          const t = this.selectedClinicalService.attributes[k]
        if (t.clinicalServiceAttributeType.code === attr) {
          v = true
        }
      }.bind(this))
      return v
    },
    updatePrescribedDrugs (prescribedDrugs, pickupDate, nextPDate, duration) {
      this.curPrescription.prescribedDrugs = prescribedDrugs
      this.curPatientVisitDetail.packs[0].packDate = new Date(pickupDate)
      this.curPatientVisitDetail.packs[0].pickupDate = new Date(pickupDate)
      this.curPatientVisitDetail.packs[0].nextPickUpDate = new Date(nextPDate)
      if (duration !== undefined) this.curPatientVisitDetail.packs[0].weeksSupply = duration.weeks
    },
    validateForm () {
      this.$refs.patientStatus.validate()
      this.$refs.clinicalService.validate()
      this.$refs.prescriptionDate.validate()
      if (this.hasTherapeuticalRegimen) this.$refs.therapeuticRegimen.validate()
      if (this.hasTherapeuticalLine) this.$refs.therapeuticLine.validate()
      this.$refs.duration.validate()
      this.$refs.doctor.validate()
      if (this.hasPatientType) this.$refs.patientType.validate()
      this.$refs.dispenseType.validate()

      if (!this.$refs.patientStatus.hasError &&
          !this.$refs.clinicalService.hasError &&
          !this.$refs.prescriptionDate.hasError &&
          (this.hasTherapeuticalRegimen && !this.$refs.therapeuticRegimen.hasError) &&
          (this.hasTherapeuticalLine && !this.$refs.therapeuticLine.hasError) &&
          !this.$refs.duration.hasError &&
          !this.$refs.doctor.hasError &&
          (this.hasPatientType && !this.$refs.patientType.hasError) &&
          !this.$refs.dispenseType.hasError) {
            if (new Date(this.prescriptionDate) < new Date(this.curPatientVisitDetail.episode.episodeDate)) {
              this.displayAlert('error', 'A data da prescrição não deve ser anterior a data de inicio do tratamento no sector corrente')
            } else if (new Date(this.pickupDate) > new Date()) {
              this.displayAlert('error', 'A data da prescrição indicada é maior que a data da corrente')
            } else {
              this.curPatientVisitDetail.prescriptions[0].prescriptionDate = new Date(this.prescriptionDate)
              this.showServiceDrugsManagement = true
            }
      }
    },
    generatePacksAndDispense () {
      let hasError = false
      let error = ''
      Object.keys(this.curPatientVisitDetails).forEach(function (k) {
        const visitDetails = this.curPatientVisitDetails[k]
        if (Number(visitDetails.packs[0].weeksSupply) <= 0) {
          hasError = true
          error = error === '' ? this.selectedClinicalService.description : error + ', ' + this.selectedClinicalService.description
        } else if (new Date(visitDetails.packs[0].pickupDate) > new Date()) {
          hasError = true
          error = 'A data de levantamento indicada é maior que a data corrente'
        } else if (visitDetails.prescriptions[0].prescribedDrugs.length > 0) {
          if (!this.isNewPackStep || !this.isEditPackStep) {
            visitDetails.patientVisit.visitDate = new Date(visitDetails.prescriptions[0].prescriptionDate)
            visitDetails.patientVisit = null
          }
          this.generatePacks(visitDetails)
        }
      }.bind(this))
      if (!hasError) {
        this.showDispenseMode = true
      } else {
        this.displayAlert('error', 'Por favor indicar o período para o qual pretende efectuar a dispensa dos medicamento de [' + error + ' ]')
      }
    },
    generatePacks (visitDetails) {
      Object.keys(visitDetails.prescriptions[0].prescribedDrugs).forEach(function (k) {
        const prescribedDrug = visitDetails.prescriptions[0].prescribedDrugs[k]
        const packDrug = new PackagedDrug()
        packDrug.quantitySupplied = prescribedDrug.qtyPrescribed
        packDrug.drug = prescribedDrug.drug
        packDrug.toContinue = prescribedDrug.toContinue
        visitDetails.packs[0].packagedDrugs.push(packDrug)
      })
    },
    async proccedToDispense (dispenseMode) {
      if (this.isNewPackStep || this.isEditPackStep) {
        this.curPatientVisitDetails[0].patientVisit = null
        this.curPatientVisitDetails[0].prescriptions[0].patientVisitDetails = null
        this.curPatientVisitDetails[0].prescriptions[0].prescriptionDetails[0].prescription = null
      }
      Object.keys(this.curPatientVisitDetails).forEach(function (k) {
        const visitDetails = this.curPatientVisitDetails[k]
        if (visitDetails.prescriptions[0].prescribedDrugs.length > 0) {
          visitDetails.packs[0].dispenseMode = dispenseMode
          this.patientVisit.patientVisitDetails.push(visitDetails)
        }
      }.bind(this))

      await PatientVisit.apiSave(this.patientVisit).then(resp => {
        console.log(resp.response.data)
        PatientVisit.apiFetchById(resp.response.data.id)
        this.showDispenseMode = false
        this.displayAlert('info', 'Dispensa efectuada com sucesso.')
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
        this.$emit('close')
        this.$router.push('/patientpanel')
      }
    }
  },
  computed: {
    isNewPackStep () {
      return this.step === 'addNewPack'
    },
    isEditPackStep () {
      return this.step === 'editPack'
    },
    lastPackFull () {
      return Pack.query()
                 .with('packagedDrugs.*')
                 .with('patientVisitDetails')
                 .where('patientVisitDetails_id', this.selectedVisitDetails.id)
                 .orderBy('pickupDate', 'desc')
                 .first()
    },
    lastPack () {
      return Pack.query()
                 .withAll()
                 .where('patientVisitDetails_id', this.curPatientVisitDetail.id)
                 .orderBy('pickupDate', 'desc').first()
    },
    curPrescription () {
      return this.curPatientVisitDetail.prescriptions[0]
    },
    curPack () {
      return this.curPatientVisitDetail.packs[0]
    },
    curPrescriptionDetails () {
      return this.curPrescription.prescriptionDetails[0]
    },
    hasTherapeuticalRegimen () {
      return this.checkClinicalServiceAttr('THERAPEUTICAL_REGIMEN')
    },
    hasTherapeuticalLine () {
      return this.checkClinicalServiceAttr('THERAPEUTICAL_LINE')
    },
    hasPatientType () {
      return this.checkClinicalServiceAttr('PATIENT_TYPE')
    },
    hasPrescriptionChangeMotive () {
      return this.checkClinicalServiceAttr('PRESCRIPTION_CHANGE_MOTIVE')
    },
    patient () {
      const selectedP = new Patient(SessionStorage.getItem('selectedPatient'))
      return Patient.query().with('identifiers.*')
                            .with('province')
                            .with('attributes')
                            .with('appointments')
                            .with('district')
                            .with('postoAdministrativo')
                            .with('bairro')
                            .with('clinic').where('id', selectedP.id).first()
    },
    simplePatient () {
      return Patient.query().where('id', this.patient.id).first()
    },
    therapeuticRegimens () {
      return TherapeuticRegimen.query()
                              .with('clinicalService')
                              .where('clinical_service_id', this.selectedClinicalService.id)
                              .get()
    },
    therapeuticLines () {
      return TherapeuticLine.all()
    },
    doctors () {
      return Doctor.query().where('clinic_id', this.currClinic.id)
                   .get()
    },
    dispenseTypes () {
      return DispenseType.all()
    },
    durations () {
      return Duration.all()
    },
    currClinic () {
      return Clinic.query().with('province').where('id', SessionStorage.getItem('currClinic').id).first()
    }
  },
  created () {
    this.initCurrPatientVisitDetails()
  },
  mounted () {
    this.init()
  },
  components: {
    ServiceDrugsManagement: require('components/Patient/PatientPanel/ServiceDrugsManagement.vue').default,
    ListHeader: require('components/Shared/ListHeader.vue').default,
    Dialog: require('components/Shared/Dialog/Dialog.vue').default,
    DispenseMode: require('components/Patient/Prescription/DispenseMode.vue').default
  }
}
</script>

<style lang="scss">
.prescription-box {
    border: 1px solid $grey-4;
  }
</style>
