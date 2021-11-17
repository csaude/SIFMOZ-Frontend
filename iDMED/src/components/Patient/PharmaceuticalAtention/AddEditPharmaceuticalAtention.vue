<template>
  <q-card style="max-width: 100vw;">
        <form @submit.prevent="submitMobilizer" >
            <q-card-section class="q-pa-none">
              <div class="row items-center text-subtitle1 q-pa-md">
                <q-icon  :name="patient.gender == 'Femenino' ? 'female' : 'male'" size="md" color="primary"/>
                <div class="text-bold text-grey-10 q-ml-sm">{{patient.fullName}}</div>
                <div class="text-grey-10 q-ml-sm"><span class="text-bold text-h6">|</span> {{patient.gender}}</div>
                <div class="text-grey-10 q-ml-sm"><span class="text-bold text-h6">|</span> {{patient.age()}} Anos de Idade</div>
              </div>
              <q-separator/>
            </q-card-section>
            <div class="text-center text-h6 q-mt-sm">
              Atenção Farmacêutica
            </div>
             <div class="text-left text-subtitle1 bold q-ml-md">
             Data de Registo
            </div>
            <div class="text-left text-h7 bold q-ml-sm q-pa-md">
              <q-input
                  dense
                  outlined
                  style="width: 350px"
                  v-model="visitDate"
                  mask="date"
                  filled
                  ref="data"
                  :disable="this.editMode"
                  :rules="[ visitDate => !!visitDate || 'A data da Consulta e obrigatoria']"
                  label="Data da Consulta">
                  <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                          <q-date v-model="visitDate"  @update:model-value="verifyHasSameDay()">
                          <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                          </q-date>
                      </q-popup-proxy>
                      </q-icon>
                  </template>
              </q-input>
            </div>
            <div class="q-mx-lg">
              <q-stepper
                v-model="step"
                ref="stepper"
                color="primary"
                animated
                header-nav
              >
                <q-step
                  :name="1"
                  title="Dados Vitais"
                  icon="show_chart"
                  :done="step > 1"
                >
                  <div class="row q-mt-md">
                        <numberField v-model="vitalSigns.height" label="Altura *"  :disable="onlyView" suffix="[Metros]" ref="height" @update:model-value="getImcValue()"/>
                      <numberField v-model="vitalSigns.weight" class="q-ml-md" label="Peso *"  suffix="[Kg]" :disable="onlyView" ref="weight" @update:model-value="getImcValue()"/>
                    </div>
                    <div class="row q-mt-md">
                      <numberField v-model="vitalSigns.imc" label="IMC *" filled disable ref="imc"/>
                      <TextInput dense v-model="imcDescription" class="col q-ml-md" filled label="IMC-Descricao"  disable />
                    </div>
                    <div class="row">
                        <numberField v-model="vitalSigns.systole" label="Sistole *"  :disable="onlyView"  suffix="[mmHg]" ref="systole"/>
                      <numberField v-model="vitalSigns.distort" class="q-ml-md" label="Diastole *" suffix="[mmHg]" :disable="onlyView" ref="distort"/>
                    </div>
                </q-step>

                <q-step
                  :name="2"
                  title="Rastreio de Tuberculose"
                  icon="show_chart"
                  :done="step > 2"
                >
                 <tbTable  @tbScreening="TBScreening = $event" :selectedTbTracing="patientVisit.tbScreening[0]"/>
                </q-step>

                <q-step
                  :name="3"
                  title="Rastreio de Gravidez"
                  v-if="this.patient.gender === 'Femenino'"
                  icon="show_chart"
                  :done="step > 3"
                >
                   <pregnancyTable  @pregnancyScreening="pregnancyScreening = $event" :selectedPregnancyTracing="patientVisit.pregnancyScreening[0]"/>
                </q-step>

                <q-step
                  :name="4"
                  title="Monitoria e Reforço à Adesão"
                  icon="show_chart"
                  :done="step > 4"
                >
                  <adherenceTable  @adherenceScreening="adherenceScreening = $event" :selectedAdherenceTracing="patientVisit.adherenceScreening[0]"/>
                </q-step>

                <q-step
                  :name="5"
                  title="Reações Adversas"
                  icon="show_chart"
                >
                 <ramTable  @rAMScreening="rAMScreening = $event" :selectedRamTracing="patientVisit.ramScreening[0]" :isNewRender="true"/>
                </q-step>
              </q-stepper>
            </div>
             <q-card-actions align="right" class="q-mb-md">
                <q-stepper-navigation >
                <q-btn label="Cancelar" color="red" @click="$emit('close')" />
                 <q-btn v-if="step > 1" color="primary" @click="$refs.stepper.previous()" label="Voltar" class="q-ml-sm" />
          <q-btn @click="goToNextStep" color="primary" :label="step === 5 ? 'Submeter' : 'Proximo'" class="q-ml-sm"/>
        </q-stepper-navigation>
            </q-card-actions>
             <q-dialog v-model="alert.visible">
          <Dialog :type="alert.type" @closeDialog="closeDialog">
            <template v-slot:title> Informação</template>
            <template v-slot:msg> {{alert.msg}} </template>
          </Dialog>
        </q-dialog>
        </form>
    </q-card>
</template>

<script>
import { SessionStorage } from 'quasar'
import PatientVisit from '../../../store/models/patientVisit/PatientVisit'
import Patient from '../../../store/models/patient/Patient'
import { ref } from 'vue'
import VitalSignsScreening from '../../../store/models/screening/VitalSignsScreening'
import TBScreening from '../../../store/models/screening/TBScreening'
import PregnancyScreening from '../../../store/models/screening/PregnancyScreening'
import AdherenceScreening from '../../../store/models/screening/AdherenceScreening'
import RAMScreening from '../../../store/models/screening/RAMScreening'
import Clinic from '../../../store/models/clinic/Clinic'
export default {
    props: ['editPatientVisit', 'editMode'],
    data () {
        return {
          alert: ref({
        type: '',
        visible: false,
        msg: ''
          }),
            patientVisit: new PatientVisit(),
            vitalSigns: new VitalSignsScreening(),
            TBScreening: new TBScreening(),
            pregnancyScreening: new PregnancyScreening(),
            adherenceScreening: new AdherenceScreening(),
             rAMScreening: new RAMScreening(),
            step: ref(1),
             visitDate: '',
             imcDescription: '',
             hasVisitSameDay: false
        }
    },
    created () {
        if (this.editPatientVisit) {
        this.patientVisit = Object.assign({}, this.editPatientVisit)
        this.visitDate = this.editPatientVisit.visitDate
        this.vitalSigns = Object.assign({}, this.editPatientVisit.vitalSigns[0])
        this.TBScreening = Object.assign({}, this.editPatientVisit.tbScreening[0])
        }
    },
    computed: {
      patient () {
      const selectedP = new Patient(SessionStorage.getItem('selectedPatient'))
      return Patient.query().with('identifiers.*')
                            .with('province')
                            .with('attributes')
                            .with('appointments')
                            .with('district')
                            .with('postoAdministrativo')
                            .with('bairro')
                            .with('clinic.province').where('id', selectedP.id).first()
      },
      currClinic () {
      return Clinic.query().with('province').where('id', SessionStorage.getItem('currClinic').id).first()
    }
    },
    methods: {
       goToNextStep () {
          if (this.step === 1) {
           // this.patientVisit.TBScreening = this.TBScreening
           // this.patientVisit.pregnancyScreening = this.pregnancyScreening
            this.$refs.height.$refs.ref.validate()
            this.$refs.weight.$refs.ref.validate()
            this.$refs.systole.$refs.ref.validate()
            this.$refs.distort.$refs.ref.validate()
           //  this.$refs.data.$refs.ref.validate()
           if (this.visitDate === '') {
              this.displayAlert('error', 'Por Favor Preencha data de consulta')
           } else if (new Date(this.visitDate) < new Date(this.patient.dateOfBirth)) {
              this.displayAlert('error', 'A data de consulta indicada é maior que a data de nascimento do paciente/utente')
           } else if (this.patient.hasIdentifiers() && (new Date(this.patient.getOldestIdentifier().startDate) > new Date(this.visitDate))) {
              this.displayAlert('error', 'A data da consulta indicada é maior que a data da admissão ao serviço se saúde [ ' + this.patient.getOldestIdentifier().service.code + ' ]')
           } else if (this.hasVisitSameDay && !this.editMode) {
             this.displayAlert('error', 'Ja Existe uma Atenção farmceutica nessa data .Por Favor use a funcionalidade editar')
           } else if (this.vitalSigns.height <= 0) {
              this.displayAlert('error', 'Por favor indique uma altura maior que zero ')
           } else if (this.vitalSigns.weight <= 0) {
              this.displayAlert('error', 'Por favor indique um peso maior que zero ')
            } else if (this.vitalSigns.systole <= 0 || this.vitalSigns.distort <= 0) {
              this.displayAlert('error', 'Por favor indique um sistole ou diastole maior que zero ')
            } else if (!this.$refs.height.$refs.ref.hasError && !this.$refs.weight.$refs.ref.hasError &&
             !this.$refs.systole.$refs.ref.hasError && !this.$refs.distort.$refs.ref.hasError) {
              this.$refs.stepper.next()
            }
          } else if (this.step === 2) {
            if (this.TBScreening.treatmentTB === 'true' && this.TBScreening.startTreatmentDate === '') {
                this.displayAlert('error', 'Deve Preencher a Data de inicio de Tratamento uma vez que esta em Tratamento TB.')
            } else if ((this.TBScreening.startTreatmentDate) && new Date(this.TBScreening.startTreatmentDate) > new Date()) {
                this.displayAlert('error', 'A Data de inicio de Tratamento indicada é maior que a data da corrente.')
            } else if (this.patient.gender === 'Masculino') {
              this.$refs.stepper.goTo(4)
            } else {
              this.$refs.stepper.next()
            }
          } else if (this.step === 3) {
             if (this.pregnancyScreening.pregnant === 'false' && this.pregnancyScreening.lastMenstruation === '') {
                this.displayAlert('error', 'Deve Preencher a Data da Ultima Menstruação.')
            } else {
              this.$refs.stepper.next()
            }
          } else if (this.step === 4) {
            if ((this.adherenceScreening.hasPatientCameCorrectDate === 'false' && this.adherenceScreening.daysWithoutMedicine === '') ||
             (this.adherenceScreening.hasPatientCameCorrectDate === 'false' && this.adherenceScreening.daysWithoutMedicine <= 0)) {
               this.displayAlert('error', 'Por Favor Indique quantos dias de atraso completou o paciente')
          } else if ((this.adherenceScreening.patientForgotMedicine === 'true' && this.adherenceScreening.lateDays === '') ||
             (this.adherenceScreening.patientForgotMedicine === 'true' && this.adherenceScreening.lateDays <= 0)) {
               this.displayAlert('error', 'Por Favor Indique quantos dias passou da hora sem tomar os Medicamentos')
          } else {
             this.$refs.stepper.next()
          }
          } else if (this.step === 5) {
             if (this.rAMScreening.adverseReactionMedicine === 'true' && this.rAMScreening.adverseReaction === '') {
                this.displayAlert('error', 'Por Favor Indique as reacoes adversas')
             } else {
            this.patientVisit.clinic = this.currClinic
            this.patientVisit.patient = this.patient
             this.patientVisit.visitDate = new Date(this.visitDate)
            this.patientVisit.vitalSigns.push(this.vitalSigns)
            this.patientVisit.tbScreening.push(this.TBScreening)
            this.patientVisit.pregnancyScreening.push(this.pregnancyScreening)
            this.patientVisit.adherenceScreening.push(this.adherenceScreening)
            this.patientVisit.ramScreening.push(this.rAMScreening)

            PatientVisit.apiSave(this.patientVisit).then(resp => {
             this.displayAlert('info', 'Atenção Farmaceutica efectuada com sucesso.')
            this.$emit('patientVisitNew', this.patientVisit)
             }).catch(error => {
             this.displayAlert('error', error)
          })
             }
          }
          },
          displayAlert (type, msg) {
      this.alert.type = type
      this.alert.msg = msg
      this.alert.visible = true
    },
    closeDialog () {
      this.alert.visible = false
      if (this.alert.type === 'info') this.$emit('close')
    },
       getImcValue () {
        if (this.vitalSigns.height !== 0.0 && this.vitalSigns.weight !== 0) {
          this.vitalSigns.imc = this.vitalSigns.weight / ((this.vitalSigns.height) * (this.vitalSigns.height))
           this.getImcDescription()
        }
        },
         verifyHasSameDay () {
         const visits = PatientVisit.query().with('patient.*')
                          .with('vitalSigns')
                          .with('tbScreening')
                          .with('pregnancyScreening')
                          .with('adherenceScreening')
                          .with('ramScreening')
                          .with('patientVisitDetails')
                          .with('clinic').where('patient_id', this.patient.id).has('clinic').has('vitalSigns').get()

                      for (const visit of visits) {
                   if (new Date(visit.visitDate).getTime() === new Date(this.visitDate).getTime() && visit.vitalSigns.length > 0) {
                               this.hasVisitSameDay = true
                               break
                          } else if (new Date(visit.visitDate).getTime() === new Date(this.visitDate).getTime() && visit.vitalSigns.length === 0) {
                                 this.patientVisit = visit
                               this.hasVisitSameDay = false
                          } else {
                           this.hasVisitSameDay = false
                          }
                       }
         },
    getImcDescription () {
        const imc = this.vitalSigns.imc
      if (imc >= 16 && imc <= 16.9) {
         this.imcDescription = 'Muito abaixo do peso'
      } else if (imc >= 17 && imc <= 18.4) {
         this.imcDescription = 'Abaixo do peso'
      } else if (imc >= 18.5 && imc <= 24.9) {
         this.imcDescription = 'Peso normal'
      } else if (imc >= 25 && imc <= 29.9) {
         this.imcDescription = 'Acima do peso'
      }
      return this.imcDescription
    }
    },
    components: {
       TextInput: require('components/Shared/Input/TextField.vue').default,
       numberField: require('components/Shared/Input/NumberField.vue').default,
       tbTable: require('components/Patient/PharmaceuticalAtention/TbQuestionsTable.vue').default,
       pregnancyTable: require('components/Patient/PharmaceuticalAtention/PregnancyQuestionsTable.vue').default,
        adherenceTable: require('components/Patient/PharmaceuticalAtention/MonitoringReinforcementAdherinTable.vue').default,
        ramTable: require('components/Patient/PharmaceuticalAtention/AdverseReactionQuestiosTable.vue').default,
           Dialog: require('components/Shared/Dialog/Dialog.vue').default
    }
}
</script>

<style>

</style>
