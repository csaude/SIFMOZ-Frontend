<template>
     <div  class="row" style="width: 100%; min-height: 200px; linear-gradient( 135deg, #343E59 10%, #2B2D3E 40%)">
      <div class="col">
        <q-table
         style="max-width: 100%; "
          :rows="dispensesByTypeAgeAndGender"
          :columns="columns"
           class="my-sticky-header-table text-color-white"
            title="Total de dispensa por Idade no Serviço"
           hide-bottom>
        <template v-slot:body="props">
            <q-tr :props="props">
            <q-td key="dispenseType" :props="props">
                {{ props.row.dispenseType }}
            </q-td>
            <q-td key="adult" :props="props">
                {{ props.row.adultsValue }}
            </q-td>
              <q-td key="child" :props="props">
                {{ props.row.childsValue }}
            </q-td>
            </q-tr>
        </template>
    </q-table>
      </div>
      <div class="col q-pl-xl">
      <q-table
      class="my-sticky-header-table"
         style="max-width: 100%; "
          :rows="dispensesByTypeAgeAndGender"
          :columns="columnsGender"
            title="Total de dispensa por Gênero no Serviço"
            bordered
           hide-bottom>
        <template v-slot:body="props">
            <q-tr :props="props">
            <q-td key="dispenseType" :props="props">
                {{ props.row.dispenseType }}
            </q-td>
            <q-td key="male" :props="props">
                {{ props.row.maleValue }}
            </q-td>
              <q-td key="female" :props="props">
                {{ props.row.femaleValue }}
            </q-td>
            </q-tr>
        </template>
    </q-table>
      </div>
    </div>
</template>
<script>
import { useQuasar } from 'quasar'
 import moment from 'moment'
import PatientVisitDetails from '../../../store/models/patientVisitDetails/PatientVisitDetails'
const columns = [
  { name: 'dispenseType', required: true, label: 'Tipo de Dispensa', align: 'left', field: row => row.dispenseType, format: val => `${val}` },
  { name: 'adult', required: true, label: 'Adultos', align: 'left', field: row => row.adultsValue, format: val => `${val}` },
   { name: 'child', required: true, label: 'Criancas', align: 'left', field: row => row.childsValue, format: val => `${val}` }
]

const columnsGender = [
  { name: 'dispenseType', required: true, label: 'Tipo de Dispensa', align: 'left', field: row => row.dispenseType, format: val => `${val}` },
  { name: 'male', required: true, label: 'Masculino', align: 'left', field: row => row.maleValue, format: val => `${val}` },
   { name: 'female', required: true, label: 'Feminino', align: 'left', field: row => row.femaleValue, format: val => `${val}` }
]
const monthlyDispense = {
  dispenseType: 'Dispensa Mensal',
  adultsValue: '',
  childsValue: '',
  maleValue: '',
  femaleValue: ''
}
const dispenseQuarterly = {
  dispenseType: 'Dispensa Trimestral',
  adultsValue: '',
  childsValue: '',
    maleValue: '',
  femaleValue: ''
}
const dispenseSemestraly = {
  dispenseType: 'Dispensa Semestral',
  adultsValue: '',
  childsValue: '',
  maleValue: '',
  femaleValue: ''
}

export default {
      props: ['serviceCode', 'dataLoaded'],
  data () {
    const $q = useQuasar()

    return {
        columns,
        columnsGender,
        $q,
        latestPrescriptions: [],
       monthlyDispense,
      dispenseQuarterly,
      dispenseSemestraly,
       dispensesByTypeAgeAndGender: []
    }
  },
    methods: {
       getLastPatientPrescriptionByClinicalService () {
          const patientVisitDetails = PatientVisitDetails.query()
                            .with('patientVisit')
                             .with('prescription')
                            .with('prescription.prescriptionDetails')
                             .with('prescription.prescriptionDetails.dispenseType')
                            .with('patientVisit.patient')
                            .with('episode.patientServiceIdentifier.service')
                              .get()
                     const patientVisitDetailsTarv = patientVisitDetails.filter((patientVisitDetail) => {
                  return patientVisitDetail.episode.patientServiceIdentifier.service !== null ? patientVisitDetail.episode.patientServiceIdentifier.service.code === this.serviceCode : false
                })
              patientVisitDetailsTarv.forEach(patientVisitDetail => {
             //  let patient = patientVisitDetail.patientVisit.patient
                if (this.latestPrescriptions.length === 0) {
                  this.latestPrescriptions.push(patientVisitDetail)
                } else {
               const visit = this.latestPrescriptions.filter(x => x.patientVisit.patient.id === patientVisitDetail.patientVisit.patient.id)
                if (visit.length > 0) {
                  const index = this.latestPrescriptions.map(x => {
                              return x.Id
                                 }).indexOf(visit[0].id)
                      const prescriptionDate = visit[0].prescription.prescriptionDate
                     // console.log(visit.prescription.prescriptionDate)
                   if (moment(prescriptionDate).isBefore(patientVisitDetail.prescription.prescriptionDate)) {
                        this.latestPrescriptions.splice(index, 1)
                         this.latestPrescriptions.push(patientVisitDetail)
                   }
                } else {
                     this.latestPrescriptions.push(patientVisitDetail)
                }
             }
              })
              if (patientVisitDetailsTarv.length === 0) {
                this.latestPrescriptions = []
              }
         return this.latestPrescriptions
          },
            idadeCalculator (birthDate) {
            if (moment(birthDate).isValid()) {
               const utentBirthDate = moment(birthDate)
               const todayDate = moment(new Date())
               const idade = todayDate.diff(utentBirthDate, 'years')
               console.log(idade)
               return idade
            }
        },
         updateChart () {
               this.dispensesByTypeAgeAndGender = []
               this.monthlyDispense.adultsValue = this.monthlyAdultsDispensePrescriptions.length
                this.monthlyDispense.childsValue = this.monthlyKidsDispensePrescriptions.length
                 this.dispenseQuarterly.adultsValue = this.quarterlyAdultsDispensePrescriptions.length
                this.dispenseQuarterly.childsValue = this.quarterlyKidsDispensePrescriptions.length
                 this.dispenseSemestraly.adultsValue = this.semestralAdultsDispensePrescriptions.length
                this.dispenseSemestraly.childsValue = this.semestralKidsDispensePrescriptions.length

              this.monthlyDispense.maleValue = this.monthlyMaleDispensePrescriptions.length
                this.monthlyDispense.femaleValue = this.monthlyFemaleDispensePrescriptions.length
                 this.dispenseQuarterly.maleValue = this.quarterlyMaleDispensePrescriptions.length
                this.dispenseQuarterly.femaleValue = this.quarterlyFemaleDispensePrescriptions.length
                 this.dispenseSemestraly.maleValue = this.semestralMaleDispensePrescriptions.length
                this.dispenseSemestraly.femaleValue = this.semestralFemaleDispensePrescriptions.length

       // this.arrDispenseMonthly.push(this.monthlyAdultsDispensePrescriptions.length)
       //  this.arrDispenseMonthly.push(this.monthlyKidsDispensePrescriptions.length)
        //     this.arrDispenseQuarterly.push(this.quarterlyAdultsDispensePrescriptions.length)
        // this.arrDispenseQuarterly.push(this.quarterlyKidsDispensePrescriptions.length)
       //    this.arrDispenseSemestraly.push(this.semestralAdultsDispensePrescriptions.length)
       //  this.arrDispenseSemestraly.push(this.semestralKidsDispensePrescriptions.length)
            console.log(this.dispensesByTypeAgeAndGender)
             this.dispensesByTypeAgeAndGender.push(monthlyDispense)
              this.dispensesByTypeAgeAndGender.push(dispenseQuarterly)
               this.dispensesByTypeAgeAndGender.push(dispenseSemestraly)
          }
  },
  computed: {
       monthlyAdultsDispensePrescriptions () {
        return this.latestPrescriptions.filter((latestVisitDetails) => {
                  return latestVisitDetails.prescription.prescriptionDetails[0].dispenseType.code === 'DM' &&
                   this.idadeCalculator(latestVisitDetails.patientVisit.patient.dateOfBirth) > 15 &&
                   latestVisitDetails.episode.patientServiceIdentifier.service.code === this.serviceCode
                })
      },
       quarterlyAdultsDispensePrescriptions () {
          return this.latestPrescriptions.filter((latestVisitDetails) => {
                  return latestVisitDetails.prescription.prescriptionDetails[0].dispenseType.code === 'DT' &&
                    this.idadeCalculator(latestVisitDetails.patientVisit.patient.dateOfBirth) > 15 &&
                      latestVisitDetails.episode.patientServiceIdentifier.service.code === this.serviceCode
                })
      },
       semestralAdultsDispensePrescriptions () {
         return this.latestPrescriptions.filter((latestVisitDetails) => {
                  return latestVisitDetails.prescription.prescriptionDetails[0].dispenseType.code === 'DS' &&
                   this.idadeCalculator(latestVisitDetails.patientVisit.patient.dateOfBirth) > 15 &&
                   latestVisitDetails.episode.patientServiceIdentifier.service.code === this.serviceCode
                })
      },
      monthlyKidsDispensePrescriptions () {
        return this.latestPrescriptions.filter((latestVisitDetails) => {
                  return latestVisitDetails.prescription.prescriptionDetails[0].dispenseType.code === 'DM' &&
                   this.idadeCalculator(latestVisitDetails.patientVisit.patient.dateOfBirth) < 15 &&
                     latestVisitDetails.episode.patientServiceIdentifier.service.code === this.serviceCode
                })
      },
       quarterlyKidsDispensePrescriptions () {
          return this.latestPrescriptions.filter((latestVisitDetails) => {
                  return latestVisitDetails.prescription.prescriptionDetails[0].dispenseType.code === 'DT' &&
                   this.idadeCalculator(latestVisitDetails.patientVisit.patient.dateOfBirth) < 15 &&
                     latestVisitDetails.episode.patientServiceIdentifier.service.code === this.serviceCode
                })
      },
       semestralKidsDispensePrescriptions () {
         return this.latestPrescriptions.filter((latestVisitDetails) => {
                  return latestVisitDetails.prescription.prescriptionDetails[0].dispenseType.code === 'DS' &&
                   this.idadeCalculator(latestVisitDetails.patientVisit.patient.dateOfBirth) < 15 &&
                    latestVisitDetails.episode.patientServiceIdentifier.service.code === this.serviceCode
                })
      },
       monthlyMaleDispensePrescriptions () {
        return this.latestPrescriptions.filter((latestVisitDetails) => {
                  return latestVisitDetails.prescription.prescriptionDetails[0].dispenseType.code === 'DM' &&
                    latestVisitDetails.patientVisit.patient.gender === 'Masculino' &&
                     latestVisitDetails.episode.patientServiceIdentifier.service.code === this.serviceCode
                })
      },
       quarterlyMaleDispensePrescriptions () {
          return this.latestPrescriptions.filter((latestVisitDetails) => {
                  return latestVisitDetails.prescription.prescriptionDetails[0].dispenseType.code === 'DT' &&
                    latestVisitDetails.patientVisit.patient.gender === 'Masculino' &&
                     latestVisitDetails.episode.patientServiceIdentifier.service.code === this.serviceCode
                })
      },
       semestralMaleDispensePrescriptions () {
         return this.latestPrescriptions.filter((latestVisitDetails) => {
                  return latestVisitDetails.prescription.prescriptionDetails[0].dispenseType.code === 'DS' &&
                    latestVisitDetails.patientVisit.patient.gender === 'Masculino' &&
                     latestVisitDetails.episode.patientServiceIdentifier.service.code === this.serviceCode
                })
      },
        monthlyFemaleDispensePrescriptions () {
        return this.latestPrescriptions.filter((latestVisitDetails) => {
                  return latestVisitDetails.prescription.prescriptionDetails[0].dispenseType.code === 'DM' &&
                    latestVisitDetails.patientVisit.patient.gender === 'Feminino' &&
                    latestVisitDetails.episode.patientServiceIdentifier.service.code === this.serviceCode
                })
      },
       quarterlyFemaleDispensePrescriptions () {
          return this.latestPrescriptions.filter((latestVisitDetails) => {
                  return latestVisitDetails.prescription.prescriptionDetails[0].dispenseType.code === 'DT' &&
                    latestVisitDetails.patientVisit.patient.gender === 'Feminino' &&
                    latestVisitDetails.episode.patientServiceIdentifier.service.code === this.serviceCode
                })
      },
       semestralFemaleDispensePrescriptions () {
         return this.latestPrescriptions.filter((latestVisitDetails) => {
                  return latestVisitDetails.prescription.prescriptionDetails[0].dispenseType.code === 'DS' &&
                    latestVisitDetails.patientVisit.patient.gender === 'Feminino' &&
                    latestVisitDetails.episode.patientServiceIdentifier.service.code === this.serviceCode
                })
      }
  },
    created () {
    /*  this.$q.loading.show({
      message: 'Carregando ...',
      spinnerColor: 'grey-4',
      spinner: QSpinnerBall
      // delay: 400 // ms
    }) */
    //  this.loadData()
   //   console.log(this.allDispensePrescriptions)
   //    console.log(this.quarterlyDispensePrescriptions)
  //   this.getLastPatientPrescriptionByClinicalService()
   //   this.updateChart()
    },
    watch: {
   serviceCode: function (newVal, oldVal) {
          console.log('Prop changed: ', newVal, ' | was: ', oldVal)
           this.getLastPatientPrescriptionByClinicalService()
       this.updateChart()
        },
        dataLoaded: function (newVal, oldVal) {
          console.log('Prop changed: ', newVal, ' | was: ', oldVal)
         this.getLastPatientPrescriptionByClinicalService()
      this.updateChart()
        }
        }
}
</script>
<style lang="sass">
.my-sticky-header-table
  /* height or max-height is important */
  .q-table__top,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: $light-green-1

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
</style>
