<template>
  <q-card>
      <q-card-section class="q-pa-none" >
        <div class="row items-center text-subtitle1 q-pa-md">
          <q-icon  :name="patient.gender == 'Femenino' ? 'female' : 'male'" size="md" color="primary"/>
          <div class="text-bold text-grey-10 q-ml-sm">{{patient.fullName}}</div>
          <div class="text-grey-10 q-ml-sm"><span class="text-bold text-h6">|</span> {{patient.gender}}</div>
          <div class="text-grey-10 q-ml-sm"><span class="text-bold text-h6">|</span> Anos</div>
        </div>
        <q-separator/>
      </q-card-section>

      <q-card-section>
        <div class="text-center">Prescrição</div>
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
                mask="date"
                ref="birthDate"
                :rules="['date']"
                label="Data da Prescrição">
                <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                        <q-date >
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
                  @blur="checkSelectedServiceAttr"
                  v-model="selectedClinicalService"
                  option-value="code"
                  option-label="description"
                  label="Serviço de Saúde e Sector Associado" />
              <q-select
                  v-if="hasTherapeuticalRegimen"
                  class="col q-mb-md"
                  dense outlined
                  option-value="code"
                  option-label="description"
                  label="Regime Terapêutico" />
              <q-select
                  v-if="hasTherapeuticalLine"
                  class="col q-mb-md"
                  dense outlined
                  option-value="code"
                  option-label="description"
                  label="Linha Terapêutica" />
              <q-select
                  class="col q-mb-md"
                  dense outlined
                  option-value="code"
                  option-label="description"
                  label="Duração [1S, 2S, 1M, 2M, ...]" />
              <q-select
                  class="col q-mb-md"
                  dense outlined
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
                  option-label="description"
                  label="Motivo Alteração [FT, Alergia ...]" />
                <q-select
                  class="col q-mb-md"
                  dense outlined
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
            <div
              v-for="visitDetails in curPatientVisitDetails" :key="visitDetails.id" >
              <ServiceDrugsManagement
                v-if="selectedClinicalService.code === visitDetails.episode.patientProgramIdentifier.clinicalService.code"
                :selectedClinicalService="selectedClinicalService"
                @addEditDrugs="addEditDrugs"
                :visitDetails="visitDetails"/>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-dialog persistent v-model="showAddEditDrug">
        <AddEditPrescribedDrug
          :visitDetails="curPatientVisitDetail"
          @close="showAddEditDrug = false" />
    </q-dialog>
    </q-card>
</template>

<script>

export default {
  props: ['patient'],
  data () {
    return {
      showAddEditDrug: false,
      identifiers: [],
      patientVisit: {},
      curPatientVisitDetails: [],
      curPatientVisitDetail: {
        prescription: {}
      },
      clinicalServices: [],
      selectedClinicalService: ''
    }
  },
  methods: {
    addEditDrugs (visitDetails) {
      this.curPatientVisitDetail = Object.assign({}, visitDetails)
      this.showAddEditDrug = true
    },
    initPatientVisit () {
      this.patientVisit.visitDate = new Date()
    },
    init () {
      this.initPatientVisit()
      Object.keys(this.identifiers).forEach(function (key) {
        if (this.identifiers[key].endDate === '') {
          const identifierEpisodes = this.identifiers[key].episodes
          this.clinicalServices.push(this.identifiers[key].clinicalService)
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
      const curPatientVisitDetail = {}
      const prescription = {}
      prescription.prescriptionDate = new Date()
      curPatientVisitDetail.patientVisit = this.patientVisit
      curPatientVisitDetail.prescription = prescription
      curPatientVisitDetail.episode = episode
      episode.patientVisitDetails.push(curPatientVisitDetail)
      this.curPatientVisitDetails.push(curPatientVisitDetail)
    },
    checkSelectedServiceAttr () {
      this.checkTherapeuticalRegimenAttr()
      this.checkTherapeuticalLineAttr()
      this.checkPatientTypeAttr()
      this.checkPrescriptionChangeMotiveAttr()
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
    }
  },
  mounted () {
    this.init()
  },
  components: {
    ServiceDrugsManagement: require('components/Patient/PatientPanel/ServiceDrugsManagement.vue').default,
    AddEditPrescribedDrug: require('components/Patient/PatientPanel/AddEditPrescribedDrug.vue').default,
    ListHeader: require('components/Shared/ListHeader.vue').default
  },
  created () {
      this.identifiers = Object.assign({}, this.patient.identifiers)
  }
}
</script>

<style lang="scss">
.prescription-box {
    border: 1px solid $grey-4;
  }
</style>
