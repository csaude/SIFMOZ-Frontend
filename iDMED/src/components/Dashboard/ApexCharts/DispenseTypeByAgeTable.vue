<template>
    <div>
     <div class="row q-py-lg q-mt-md text-weight-bold text-subtitle1">
        Tabela Tipo de dispensa por Idade
        </div>
        <q-table
          :rows="dispensesByTypeAge"
          :columns="columns"
          :filter="filter">
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
</template>
<script>
import { useQuasar } from 'quasar'
 import moment from 'moment'
import PatientVisitDetails from '../../../store/models/patientVisitDetails/PatientVisitDetails'
const columns = [
  { name: 'dispenseType', required: true, label: 'Código', align: 'left', field: row => row.dispenseType, format: val => `${val}` },
  { name: 'adult', required: true, label: 'Adultos', align: 'left', field: row => row.adultsValue, format: val => `${val}` },
   { name: 'child', required: true, label: 'Criancas', align: 'left', field: row => row.childsValue, format: val => `${val}` }
]

const monthlyDispense = {
  dispenseType: 'DM',
  adultsValue: '',
  childsValue: ''
}
const dispenseQuarterly = {
  dispenseType: 'DT',
  adultsValue: '',
  childsValue: ''
}
const dispenseSemestraly = {
  dispenseType: 'DT',
  adultsValue: '',
  childsValue: ''
}

export default {
      props: ['serviceCode', 'dataLoaded'],
  data () {
    const $q = useQuasar()

    return {
        columns,
        $q,
        latestPrescriptions: [],
       monthlyDispense,
      dispenseQuarterly,
      dispenseSemestraly,
       dispensesByTypeAge: []
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
                  return patientVisitDetail.episode.patientServiceIdentifier.service.code === this.serviceCode
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
               this.dispensesByTypeAge = []
               this.monthlyDispense.adultsValue = this.monthlyAdultsDispensePrescriptions.length
                this.monthlyDispense.childsValue = this.monthlyKidsDispensePrescriptions.length
                 this.dispenseQuarterly.adultsValue = this.quarterlyAdultsDispensePrescriptions.length
                this.dispenseQuarterly.childsValue = this.quarterlyKidsDispensePrescriptions.length
                 this.dispenseSemestraly.adultsValue = this.semestralAdultsDispensePrescriptions.length
                this.dispenseSemestraly.childsValue = this.semestralKidsDispensePrescriptions.length
       // this.arrDispenseMonthly.push(this.monthlyAdultsDispensePrescriptions.length)
       //  this.arrDispenseMonthly.push(this.monthlyKidsDispensePrescriptions.length)
        //     this.arrDispenseQuarterly.push(this.quarterlyAdultsDispensePrescriptions.length)
        // this.arrDispenseQuarterly.push(this.quarterlyKidsDispensePrescriptions.length)
       //    this.arrDispenseSemestraly.push(this.semestralAdultsDispensePrescriptions.length)
       //  this.arrDispenseSemestraly.push(this.semestralKidsDispensePrescriptions.length)
            console.log(this.dispensesByTypeAge)
             this.dispensesByTypeAge.push(monthlyDispense)
              this.dispensesByTypeAge.push(dispenseQuarterly)
               this.dispensesByTypeAge.push(dispenseSemestraly)
          }
  },
  computed: {
       monthlyAdultsDispensePrescriptions () {
        return this.latestPrescriptions.filter((latestVisitDetails) => {
                  return latestVisitDetails.prescription.prescriptionDetails[0].dispenseType.code === 'DM' && this.idadeCalculator(latestVisitDetails.patientVisit.patient.dateOfBirth) > 15
                })
      },
       quarterlyAdultsDispensePrescriptions () {
          return this.latestPrescriptions.filter((latestVisitDetails) => {
                  return latestVisitDetails.prescription.prescriptionDetails[0].dispenseType.code === 'DT' && this.idadeCalculator(latestVisitDetails.patientVisit.patient.dateOfBirth) > 15
                })
      },
       semestralAdultsDispensePrescriptions () {
         return this.latestPrescriptions.filter((latestVisitDetails) => {
                  return latestVisitDetails.prescription.prescriptionDetails[0].dispenseType.code === 'DS' && this.idadeCalculator(latestVisitDetails.patientVisit.patient.dateOfBirth) > 15
                })
      },
      monthlyKidsDispensePrescriptions () {
        return this.latestPrescriptions.filter((latestVisitDetails) => {
                  return latestVisitDetails.prescription.prescriptionDetails[0].dispenseType.code === 'DM' && this.idadeCalculator(latestVisitDetails.patientVisit.patient.dateOfBirth) < 15
                })
      },
       quarterlyKidsDispensePrescriptions () {
          return this.latestPrescriptions.filter((latestVisitDetails) => {
                  return latestVisitDetails.prescription.prescriptionDetails[0].dispenseType.code === 'DT' && this.idadeCalculator(latestVisitDetails.patientVisit.patient.dateOfBirth) < 15
                })
      },
       semestralKidsDispensePrescriptions () {
         return this.latestPrescriptions.filter((latestVisitDetails) => {
                  return latestVisitDetails.prescription.prescriptionDetails[0].dispenseType.code === 'DS' && this.idadeCalculator(latestVisitDetails.patientVisit.patient.dateOfBirth) < 15
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
