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
              <q-input
                dense
                outlined
                class="col"
                v-model="curPatientVisitDetail.prescription.prescriptionDate"
                mask="date"
                ref="birthDate"
                :rules="['date']"
                label="Data da Prescrição">
                <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                        <q-date v-model="curPatientVisitDetail.prescription.prescriptionDate">
                        <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                        </q-date>
                    </q-popup-proxy>
                    </q-icon>
                </template>
              </q-input>
              <q-select
                  class="col q-mb-md"
                  dense outlined
                  options-dense
                  :options="clinicalServices"
                  v-model="selectedClinicalService"
                  @blur="setCurVisitDetails"
                  option-value="id"
                  option-label="code"
                  label="Serviço de Saúde e Sector Associado" />
              <q-select
                  v-if="hasTherapeuticalRegimen"
                  class="col q-mb-md"
                  dense outlined
                  v-model="curPatientVisitDetail.prescription.prescriptionDetail.therapeuticRegimen"
                  :options="selectedClinicalService.therapeuticRegimens"
                  option-value="id"
                  option-label="description"
                  label="Regime Terapêutico" />
              <q-select
                  v-if="hasTherapeuticalLine"
                  class="col q-mb-md"
                  dense outlined
                  v-model="curPatientVisitDetail.prescription.prescriptionDetail.therapeuticLine"
                  option-value="code"
                  option-label="description"
                  label="Linha Terapêutica" />
              <q-select
                  class="col q-mb-md"
                  dense outlined
                  v-model="selectedDuration"
                  option-value="code"
                  option-label="description"
                  label="Duração [1S, 2S, 1M, 2M, ...]" />
              <q-select
                  class="col q-mb-md"
                  dense outlined
                  v-model="curPatientVisitDetail.prescription.doctor"
                  option-value="code"
                  option-label="description"
                  label="Clínico" />
              <div class="q-mt-md">
                <div class="row items-center q-mb-sm">
                    <span class="text-subtitle2">Informação Adicional</span>
                </div>
                <q-separator color="grey-13" size="1px" class="q-mb-sm"/>
              </div>
              <q-select
                  v-if="hasPatientType"
                  class="col q-mb-md"
                  dense outlined
                  option-value="code"
                  option-label="description"
                  label="Tipo Paciente [Inicio, Manter, Alterar]" />
                <q-select
                  v-if="hasPrescriptionChangeMotive"
                  class="col q-mb-md"
                  dense outlined
                  option-value="code"
                  :options="reasonsForUpdate"
                  v-model="curPatientVisitDetail.prescription.prescriptionDetail.reasonForUpdate"
                  option-label="description"
                  label="Motivo Alteração [FT, Alergia ...]" />
                <q-select
                  class="col q-mb-md"
                  dense outlined
                  v-model="curPatientVisitDetail.prescription.prescriptionDetail.dispenseType"
                  option-value="code"
                  option-label="description"
                  label="Paciente em [DM, DT, DS]" />
                <q-select
                  class="col q-mb-lg"
                  dense outlined
                  option-value="code"
                  option-label="description"
                  label="[Novo, Manutenção]" />
                <div class="q-my-md text-right">
                  <q-btn unelevated color="primary" label="Adicionar Medicamentos" class="" />
                </div>
            </div>
          </div>
          <div class="col q-mx-md">
          <span
              v-if="selectedClinicalService !==''">
              <div
                v-for="visitDetails in curPatientVisitDetails" :key="visitDetails.id" >
                <ServiceDrugsManagement
                  v-if="selectedClinicalService.code === visitDetails.episode.patientServiceIdentifier.service.code"
                  :selectedClinicalService="selectedClinicalService"
                  @addEditDrugs="addEditDrugs"
                  :visitDetails="visitDetails"/>
              </div>
          </span>
          <div v-else class="vertical-middle">
            <q-banner rounded class="bg-orange-1 text-left text-orange-10">
              Nenhum Serviço de Saúde foi Seleccionado!.
            </q-banner>
          </div>
          <div
            class="row text-right absolute-bottom q-mb-lg q-mr-lg">
            <q-space/>
              <q-btn
                label="Cancelar"
                color="red"
                @click="$emit('close')"/>

              <q-btn
                v-if="selectedClinicalService !==''"
                type="submit"
                label="Dispensar"
                color="primary"
                class="q-ml-md" />
            </div>
          </div>
        </div>
      </q-card-section>
      <q-dialog persistent v-model="showAddEditDrug">
        <AddEditPrescribedDrug
          @addPrescribedDrug="addPrescribedDrug"
          :visitDetails="curPatientVisitDetail"
          :hasTherapeuticalRegimen="hasTherapeuticalRegimen"
          @close="showAddEditDrug = false" />
    </q-dialog>
    </q-card>
</template>

<script>

import { SessionStorage } from 'quasar'
import Patient from '../../../store/models/patient/Patient'
import PatientVisitDetails from '../../../store/models/patientVisitDetails/PatientVisitDetails'
import PatientVisit from '../../../store/models/patientVisit/PatientVisit'
import Prescription from '../../../store/models/prescription/Prescription'
import PrescriptionDetail from '../../../store/models/prescriptionDetails/PrescriptionDetail'
import ClinicalService from '../../../store/models/ClinicalService/ClinicalService'
import Episode from '../../../store/models/episode/Episode'
import Pack from '../../../store/models/packaging/Pack'
export default {
  data () {
    return {
      showAddEditDrug: false,
      identifiers: [],
      patientVisit: new PatientVisit(),
      curPatientVisitDetails: [],
      curPatientVisitDetail: new PatientVisitDetails({
        patientVisit: new PatientVisit(),
        prescription: new Prescription({
          prescriptionDetail: new PrescriptionDetail()
        }),
        pack: new Pack()
      }),
      clinicalServices: [],
      selectedClinicalService: '',
      reasonsForUpdate: ['FT', 'Alergia']
    }
  },
  methods: {
    addEditDrugs (pickupDate) {
      this.curPatientVisitDetail.pack.pickupDate = pickupDate
      this.showAddEditDrug = true
    },
    addPrescribedDrug (prescribedDrug) {
      this.curPatientVisitDetail.prescription.prescribedDrugs.push(prescribedDrug)
    },
    initPatientVisit () {
      this.patientVisit.visitDate = new Date()
    },
    setCurVisitDetails () {
      Object.keys(this.curPatientVisitDetails).forEach(function (k) {
        const visitDetails = this.curPatientVisitDetails[k]
        if (visitDetails.episode.patientServiceIdentifier.service.id === this.selectedClinicalService.id) {
          this.curPatientVisitDetail = visitDetails
        }
      }.bind(this))
    },
    init () {
      this.initPatientVisit()
      Object.keys(this.patient.identifiers).forEach(function (key) {
        if (this.patient.identifiers[key].endDate === '') {
          const identifierEpisodes = this.patient.identifiers[key].episodes
          this.clinicalServices.push(ClinicalService.query().with('attributes.*').where('id', this.patient.identifiers[key].service.id).first())
          Object.keys(identifierEpisodes).forEach(function (k) {
            const episode = identifierEpisodes[k]
            if (episode.stopDate === '') {
                this.initPatientVisitDetails(episode)
              }
          }.bind(this))
        }
      }.bind(this))
    },
    initPatientVisitDetails (episode) {
      const curPatientVisitDetail = new PatientVisitDetails({
        patientVisit: new PatientVisit(this.patientVisit),
        prescription: new Prescription({
          prescriptionDate: new Date(),
          prescriptionDetail: new PrescriptionDetail()
        }),
        pack: new Pack(),
        episode: Episode.query().with('patientServiceIdentifier.service').where('id', episode.id).first()
      })

      episode.patientVisitDetails.push(curPatientVisitDetail)
      this.curPatientVisitDetails.push(curPatientVisitDetail)
    },
    checkClinicalServiceAttr (attributes, attr) {
      let v
      Object.keys(attributes).forEach(function (k) {
          const t = attributes[k]
        if (t.clinicalServiceAttributeType.code === attr) {
          v = true
          }
      })
      return v
    }
  },
  computed: {
    hasTherapeuticalRegimen () {
      if (this.selectedClinicalService === '') return false
      return this.checkClinicalServiceAttr(this.selectedClinicalService.attributes, 'THERAPEUTICAL_REGIMEN')
    },
    hasTherapeuticalLine () {
      if (this.selectedClinicalService === '') return false
      return this.checkClinicalServiceAttr(this.selectedClinicalService.attributes, 'THERAPEUTICAL_LINE')
    },
    hasPatientType () {
      if (this.selectedClinicalService === '') return false
      return this.checkClinicalServiceAttr(this.selectedClinicalService.attributes, 'PATIENT_TYPE')
    },
    hasPrescriptionChangeMotive () {
      if (this.selectedClinicalService === '') return false
      return this.checkClinicalServiceAttr(this.selectedClinicalService.attributes, 'PRESCRIPTION_CHANGE_MOTIVE')
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
      }
  },
  mounted () {
    this.init()
  },
  components: {
    ServiceDrugsManagement: require('components/Patient/PatientPanel/ServiceDrugsManagement.vue').default,
    AddEditPrescribedDrug: require('components/Patient/PatientPanel/AddEditPrescribedDrug.vue').default,
    ListHeader: require('components/Shared/ListHeader.vue').default
  }
}
</script>

<style lang="scss">
.prescription-box {
    border: 1px solid $grey-4;
  }
</style>
