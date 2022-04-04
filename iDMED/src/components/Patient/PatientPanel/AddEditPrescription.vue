<template>
  <q-card>
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
              <div>
                <div class="row items-center q-mb-xs">
                    <span class="text-subtitle2">Informação Adicional</span>
                </div>
                <q-separator color="grey-13" size="1px" class="q-mb-sm"/>
              </div>
              <div class="row">
              <div class="col">
                <q-item-label dense caption>Altera Linha Terapêutica?</q-item-label>
              </div>
                <div class="col">
                <q-radio :disable="isNewPackStep || isEditPackStep" v-model="curPrescription.patientType" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="N/A" label="Não" />
                <q-radio :disable="isNewPackStep || isEditPackStep" v-model="curPrescription.patientType" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="Alterar" label="Sim" />
                </div>
              </div>
                <q-select
                  v-if="hasPrescriptionChangeMotive && String(curPrescription.patientType).includes('Alterar')"
                  class="col q-mb-sm"
                  :disable="isNewPackStep || isEditPackStep"
                  ref="reasonForUpdate"
                  dense outlined
                  option-value="code"
                  :options="reasonsForUpdate"
                  v-model="curPrescriptionDetails.reasonForUpdate"
                  option-label="description"
                  label="Motivo Alteração" />
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
                <!--q-toggle
                  v-model="curPatientVisitDetail.createPackLater"
                  :disable="isNewPackStep || isEditPackStep || showServiceDrugsManagement"
                  label="Para Dispensar à Posterior" /-->
                <div class="row q-mb-sm">
                  <q-btn
                    unelevated
                    color="primary"
                    :disable="isNewPackStep || isEditPackStep || showServiceDrugsManagement"
                    label="Adicionar Medicamentos"
                    class="col all-pointer-events"
                    @click="validateForm()"/>
                </div>
            </div>
          </div>
          <div class="col q-mx-md">
          <div
            class="q-pa-md box-border"
            v-if="showServiceDrugsManagement">
              <div
                v-for="visitDetails in curPatientVisitDetails" :key="visitDetails.id" >
                <ServiceDrugsManagement
                  v-if="selectedClinicalService.code === visitDetails.episode.patientServiceIdentifier.service.code"
                  :selectedClinicalService="selectedClinicalService"
                  :hasTherapeuticalRegimen="hasTherapeuticalRegimen"
                  :lastPack="lastPack"
                  :step="step"
                  :prescription="curPatientVisitDetail.prescription"
                  :oldPrescribedDrugs="prescribedDrugs"
                  @updatePrescribedDrugs="updatePrescribedDrugs"
                  :visitDetails="visitDetails"/>
              </div>
          </div>
          <div v-else class="vertical-middle">
            <q-banner rounded class="bg-orange-1 text-left text-orange-10">
              Nenhum Serviço de Saúde foi Seleccionado!.
            </q-banner>
          </div>
              <div class="row" v-if="showServiceDrugsManagement && hasVisitsToPackNow">
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
         <div class="row">
           <span
            class="text-right absolute-bottom q-mb-lg q-mr-lg q-mt-md no-pointer-events">

              <q-btn
                label="Cancelar"
                color="red"
                class="all-pointer-events"
                @click="$emit('close')"/>

              <q-btn
                v-if="selectedClinicalService !==''"
                :label="dispenseLabel"
                @click="generatePacksAndDispense()"
                color="primary"
                class="q-ml-md all-pointer-events" />
            </span>
         </div>
          </div>
        </div>
      </q-card-section>
      <q-dialog persistent v-model="showDispenseMode">
        <DispenseMode
          @proccedToDispense="proccedToDispense"
          @close="showDispenseMode = false" />
      </q-dialog>
      <q-dialog persistent v-model="alert.visible">
        <Dialog :type="alert.type" @closeDialog="closeDialog">
          <template v-slot:title> Informação</template>
          <template v-slot:msg> {{alert.msg}} </template>
        </Dialog>
      </q-dialog>
    </q-card>
</template>

<script>
import { ref } from 'vue'
import { QSpinnerBall, SessionStorage } from 'quasar'
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
export default {
  props: ['selectedVisitDetails', 'step', 'service'],
  data () {
    return {
      alert: ref({
        type: '',
        visible: false,
        msg: ''
      }),
      mds: ref('US_'),
      identifiers: [],
      patientVisit: new PatientVisit(),
      curPatientVisitDetails: [],
      curPatientVisitDetail: new PatientVisitDetails(),
      clinicalServices: [],
      selectedClinicalService: new ClinicalService(),
      reasonsForUpdate: ['FT', 'Alergia'],
      patientStatus: ['Inicio', 'Manutenção'],
      patientTypes: ['Sim', 'Não'],
      showServiceDrugsManagement: false,
      prescriptionDate: '',
      showDispenseMode: false,
      prescribedDrugs: [],
      dispenseMode: []
    }
  },
  methods: {
    alterPatientStatus () {
      if (String(this.curPrescriptionDetails.dispenseType.description).includes('Mensal')) {
        this.curPrescription.patientStatus = 'N/A'
      }
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
    setCurVisitDetails () {
      this.$q.loading.show({
        message: 'Carregando ...',
        spinnerColor: 'grey-4',
        spinner: QSpinnerBall
      })

      setTimeout(() => {
        this.$q.loading.hide()
      }, 400)
      this.showServiceDrugsManagement = false
      Object.keys(this.curPatientVisitDetails).forEach(function (k) {
        const visitDetails = this.curPatientVisitDetails[k]
        if (visitDetails.episode.patientServiceIdentifier.service.id === this.selectedClinicalService.id) {
          this.curPatientVisitDetail = visitDetails
          if (visitDetails.prescription.prescribedDrugs.length > 0) {
            this.prescribedDrugs = visitDetails.prescription.prescribedDrugs
            this.showServiceDrugsManagement = true
          }
        }
      }.bind(this))
    },
    initCurrPatientVisitDetails () {
      const pack = new Pack({
        clinic: this.currClinic
      })
      if (this.selectedVisitDetails !== null) {
        this.curPatientVisitDetail.createPackLater = this.selectedVisitDetails.createPackLater
      }

      if (!this.isNewPackStep && !this.isEditPackStep) {
        let prescription = new Prescription({
          prescriptionDate: new Date(),
          clinic: this.currClinic
        })

        if (this.service !== null && this.service !== undefined) {
          console.log(this.service)
          prescription = this.selectedVisitDetails.prescription
          this.prescriptionDate = this.getDDMMYYYFromJSDate(new Date())
          this.prescribedDrugs = prescription.prescribedDrugs
          this.showServiceDrugsManagement = true
          prescription.id = null
          prescription.$id = null
          prescription.clinic = this.currClinic
          prescription.prescriptionDetails[0].id = null
          prescription.prescriptionDetails[0].$id = null
          prescription.prescribedDrugs.forEach((pd) => {
            pd.id = null
            pd.$id = null
          })
        } else {
          const prescriptionDetail = new PrescriptionDetail()
          prescription.prescriptionDetails.push(prescriptionDetail)
        }

        this.curPatientVisitDetail.pack = pack
        this.curPatientVisitDetail.prescription = prescription
      } else {
        console.log(this.selectedVisitDetails)
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

        if (!this.isFirstPack) {
          this.curPatientVisitDetail.pack = this.lastPackFull
          packagedDrugs = this.curPatientVisitDetail.pack.packagedDrugs
        }
console.log(this.isEditPackStep)
        if (this.isEditPackStep || this.isFirstPack) {
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

            this.curPatientVisitDetail.pack = null
            console.log(this.isFirstPack)
            if (this.isFirstPack) {
              pack.pickupDate = this.curPatientVisitDetail.prescription.prescriptionDate
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

        this.curPatientVisitDetails.push(this.curPatientVisitDetail)
        this.showServiceDrugsManagement = true
      }
      console.log(this.curPatientVisitDetail)

      this.initPatientVisit()
    },
    init () {
      if (this.service !== null && this.service !== undefined) {
        this.selectedClinicalService = this.service
      }
      if (!this.isNewPackStep && !this.isEditPackStep) {
        Object.keys(this.patient.identifiers).forEach(function (key) {
          if (this.patient.identifiers[key].endDate === '' || this.patient.identifiers[key].endDate === null) {
            console.log(this.patient.identifiers[key].lastEpisode())
            const episode = Episode.query()
                                    .withAll()
                                    .where('patientServiceIdentifier_id', this.patient.identifiers[key].id)
                                    .orderBy('creationDate', 'desc')
                                    .first()
            if (episode !== null && !episode.closed()) {
              this.clinicalServices.push(ClinicalService.query().with('attributes.*').where('id', this.patient.identifiers[key].service.id).first())
              this.initPatientVisitDetails(episode)
            }
          }
        }.bind(this))
      }
    },
    initPatientVisitDetails (episode) {
      const pack = new Pack({
        clinic: this.currClinic,
        syncStatus: this.patient.his_id.length > 10 ? 'R' : 'N'
      })
      console.log('initPatientVisitDetails')
      let prescription = null
      if (this.service === null || this.service === undefined) {
        prescription = new Prescription({
          prescriptionDate: new Date(),
          clinic: this.currClinic
        })

        const prescriptionDetail = new PrescriptionDetail()
        prescription.prescriptionDetails.push(prescriptionDetail)
      } else {
        console.log(this.service)
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
      this.curPatientVisitDetails.push(curPatientVisitDetail)
      console.log(this.curPatientVisitDetails)
    },
    checkClinicalServiceAttr (attr) {
      console.log(this.selectedClinicalService)
      if (this.selectedClinicalService === '' || this.selectedClinicalService === null || this.selectedClinicalService === undefined) return false
      const has = this.selectedClinicalService.attributes.some((attribute) => {
        return attribute.clinicalServiceAttributeType.code === attr
      })
      return has
    },
    updatePrescribedDrugs (prescribedDrugs, pickupDate, nextPDate, duration) {
      console.log(nextPDate)
      if (!this.curPatientVisitDetail.createPackLater && this.curPatientVisitDetail.pack !== null) {
        if (pickupDate !== undefined) this.curPatientVisitDetail.pack.packDate = this.getJSDateFromDDMMYYY(pickupDate)
        if (pickupDate !== undefined) this.curPatientVisitDetail.pack.pickupDate = this.getJSDateFromDDMMYYY(pickupDate)
        if (nextPDate !== undefined) this.curPatientVisitDetail.pack.nextPickUpDate = this.getJSDateFromDDMMYYY(nextPDate)
        if (duration !== undefined) this.curPatientVisitDetail.pack.weeksSupply = duration.weeks
      }
    },
    validateForm () {
      console.log(this.hasTherapeuticalRegimen)
      console.log(this.hasTherapeuticalLine)
      this.$refs.patientStatus.validate()
      this.$refs.clinicalService.validate()
      if (this.hasTherapeuticalRegimen) this.$refs.therapeuticRegimen.validate()
      if (this.hasTherapeuticalLine) this.$refs.therapeuticLine.validate()
      this.$refs.duration.validate()
      this.$refs.doctor.validate()
      // if (this.hasPatientType) this.$refs.patientType.validate()
      this.$refs.dispenseType.validate()

      if (!this.$refs.patientStatus.hasError &&
          !this.$refs.clinicalService.hasError &&
          // (this.hasTherapeuticalRegimen && !this.$refs.therapeuticRegimen.hasError) &&
          // (this.hasTherapeuticalLine && !this.$refs.therapeuticLine.hasError) &&
          !this.$refs.duration.hasError &&
          !this.$refs.doctor.hasError &&
          // (this.hasPatientType && !this.$refs.patientType.hasError) &&
          !this.$refs.dispenseType.hasError) {
      console.log(this.hasTherapeuticalLine)
            if (this.getJSDateFromDDMMYYY(this.prescriptionDate) < new Date(this.curPatientVisitDetail.episode.episodeDate)) {
              this.displayAlert('error', 'A data da prescrição não deve ser anterior a data de inicio do tratamento no sector corrente')
            } else if (new Date(this.pickupDate) > new Date()) {
              this.displayAlert('error', 'A data da prescrição indicada é maior que a data da corrente')
            } else {
              this.curPatientVisitDetail.prescription.prescriptionDate = this.getJSDateFromDDMMYYY(this.prescriptionDate)
              this.showServiceDrugsManagement = true
            }
      }
    },
    generatePacksAndDispense () {
      let hasError = false
      let error = ''
      Object.keys(this.curPatientVisitDetails).forEach(function (k) {
        const visitDetails = this.curPatientVisitDetails[k]
        if (!visitDetails.createPackLater) {
          if (Number(visitDetails.pack.weeksSupply) <= 0) {
            hasError = true
            error = error === '' ? this.selectedClinicalService.description : error + ', ' + this.selectedClinicalService.description
          } else if (new Date(visitDetails.pack.pickupDate) > new Date()) {
            hasError = true
            error = 'A data de levantamento indicada é maior que a data corrente'
          } else if (this.dispenseMode === '') {
            hasError = true
            error = 'Por favor indicar o modo da dispensa.'
          } else if (visitDetails.prescription.prescribedDrugs.length > 0) {
            if (!this.isNewPackStep || !this.isEditPackStep || !this.isFirstPack) {
              visitDetails.patientVisit.visitDate = new Date(visitDetails.prescription.prescriptionDate)
              visitDetails.patientVisit = null
            }
            this.generatePacks(visitDetails)
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
      if (!hasError) {
        this.proccedToDispense()
      } else {
        this.displayAlert('error', 'Por favor indicar o período para o qual pretende efectuar a dispensa dos medicamento de [' + error + ' ]')
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
                            .with('clinic.province')
                            .with('entrance.clinic.province')
                            .with('center.clinic.province')
                            .with('drug.form')
                            .where('drug_id', prescribedDrug.drug.id)
                            .orderBy('expireDate', 'asc')
                            .get()
        const validStock = stocks.filter((item) => {
          return new Date(item.expireDate) > new Date() && item.stockMoviment > 0
        })
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
            console.log(packagedDrugStock)
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
      })
    },
    proccedToDispense () {
      if (this.isNewPackStep || this.isEditPackStep || this.isFirstPack) {
        this.curPatientVisitDetails[0].patientVisit = null
        this.curPatientVisitDetails[0].prescription.patientVisitDetails = null
        this.curPatientVisitDetails[0].prescription.prescriptionDetails[0].prescription = null
      }
      console.log(this.curPatientVisitDetails)
      this.patientVisit.patientVisitDetails = []
      Object.keys(this.curPatientVisitDetails).forEach(function (k) {
        const visitDetails = Object.assign({}, this.curPatientVisitDetails[k])
        if (visitDetails.prescription.prescribedDrugs.length > 0) {
          if (!visitDetails.createPackLater) {
            visitDetails.pack.dispenseMode = this.dispenseMode
          } else {
            visitDetails.pack = null
          }
          if (this.isFirstPack && this.curPatientVisitDetails[0].prescription.id !== null) {
            visitDetails.clinic = this.currClinic
            // visitDetails.prescription = null
          }
          this.patientVisit.visitDate = this.curPatientVisitDetails[0].pack.pickupDate
          this.patientVisit.patientVisitDetails.push(visitDetails)
        }
      }.bind(this))

      console.log(this.patientVisit)
      const i = 0
      this.saveVisitPrescriptionAndPack(this.patientVisit, i)
    },
    saveVisitPrescriptionAndPack (patientVisit, i) {
      if (patientVisit.patientVisitDetails[i] !== null && patientVisit.patientVisitDetails[i] !== undefined) {
        const patientVDetails = patientVisit.patientVisitDetails[i]
        console.log(patientVDetails)
        if (patientVDetails.prescription.id === null) {
          Prescription.apiSave(patientVDetails.prescription).then(resp => {
            patientVDetails.prescription.id = resp.response.data.id
            patientVDetails.prescription.$id = resp.response.data.id
            patientVDetails.prescription.prescribedDrugs = []
            patientVDetails.prescription.prescriptionDetails[0].id = resp.response.data.prescriptionDetails[0].id
            if (patientVDetails.pack !== null) {
              Pack.apiSave(patientVDetails.pack).then(resp => {
                patientVDetails.pack.id = resp.response.data.id
                patientVDetails.pack.$id = resp.response.data.id
                patientVDetails.pack.packagedDrugs = []
                i = i + 1
                setTimeout(this.saveVisitPrescriptionAndPack(patientVisit, i), 2)
              })
            } else {
              i = i + 1
              setTimeout(this.saveVisitPrescriptionAndPack(patientVisit, i), 2)
            }
          })
        } else {
          console.log(patientVDetails.pack)
          Pack.apiSave(patientVDetails.pack).then(resp => {
            patientVDetails.pack.id = resp.response.data.id
            patientVDetails.pack.$id = resp.response.data.id
            patientVDetails.pack.packagedDrugs = []
            i = i + 1
            setTimeout(this.saveVisitPrescriptionAndPack(patientVisit, i), 2)
          })
        }
      } else {
        console.log(this.patientVisit)
        this.savePatientVisit(patientVisit)
      }
    },
    savePatientVisit (patientVisit) {
      PatientVisit.apiSave(this.patientVisit).then(resp => {
        this.patientVisit.id = resp.response.data.id
        this.patientVisit.$id = resp.response.data.id
        this.fecthVisit(resp.response.data.id)
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
    fecthVisit (id) {
      PatientVisit.apiFetchById(id).then(resp => {
        console.log(resp)
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
            }).catch(error => {
                console.log(error)
            })
    },
    getJSDateFromDDMMYYY (dateString) {
      console.log(dateString)
      if (dateString === null || dateString === undefined) return null
      const dateParts = dateString.split('-')
      return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0])
    },
    getDDMMYYYFromJSDate (jsDate) {
      return moment(jsDate).format('DD-MM-YYYY')
    }
  },
  computed: {
    dispenseModes: {
        get () {
          return DispenseMode.query().where((dispenseMode) => {
            return dispenseMode.code.includes(this.mds)
          }).get()
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
        let createPackLater = false
        if (this.curPatientVisitDetails.length <= 0) return false

        Object.keys(this.curPatientVisitDetails).forEach(function (k) {
          const visitDetails = this.curPatientVisitDetails[k]
          if (createPackLater === false) {
            createPackLater = visitDetails.createPackLater
          }
        }.bind(this))
        return createPackLater
      }
    },
    hasVisitsToPackNow: {
      get () {
        let createPackLater = true
        if (this.curPatientVisitDetails.length <= 0) return false

        Object.keys(this.curPatientVisitDetails).forEach(function (k) {
          const visitDetails = this.curPatientVisitDetails[k]
          if (createPackLater === true) {
            createPackLater = visitDetails.createPackLater
          }
        }.bind(this))
      return !createPackLater
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
        const selectedP = new Patient(SessionStorage.getItem('selectedPatient'))
        return Patient.query().with('identifiers.*')
                              .with('province')
                              .with('attributes')
                              .with('appointments')
                              .with('district')
                              .with('postoAdministrativo')
                              .with('bairro')
                              .with('clinic')
                              .where('id', selectedP.id)
                              .first()
      }
    },
    simplePatient: {
      get () {
        return Patient.query().where('id', this.patient.id).first()
      }
    },
    therapeuticRegimens: {
      get () {
        return TherapeuticRegimen.query()
                                .with('clinicalService')
                                .has('code')
                                .where('active', true)
                                .where('clinical_service_id', this.selectedClinicalService.id)
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
        return Doctor.query().where('clinic_id', this.currClinic.id)
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
    },
    currClinic: {
      get () {
        return Clinic.query().with('province').where('id', SessionStorage.getItem('currClinic').id).first()
      }
    }
  },
  created () {
    this.initCurrPatientVisitDetails()
  },
  mounted () {
    this.init()
    this.doDispenseModeGetAll(0)
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
  .box-border {
    border: 1px solid $grey-4
  }
</style>
