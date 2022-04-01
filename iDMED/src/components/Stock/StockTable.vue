<template>
  <div>
    <q-table
            :class=headerClass
            dense
            :rows="drugs"
            :columns="columns"
            :filter="filter"
            row-key="id"
             :title=title
            >
            <template v-slot:top-right>
              <q-input
                outlined
                dense
                v-if=!isCharts
                style="width: 400px"
                debounce="300"
                v-model="filter"
                placeholder="Pesquisar">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>
            <template v-slot:no-data="{ icon, filter }">
              <div class="full-width row flex-center text-primary q-gutter-sm text-body2">
                <span>
                  Sem resultados para visualizar
                </span>
                <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
              </div>
            </template>
            <template #header="props">
                  <q-tr class="text-left bg-grey-3"  :props="props">
                    <q-th style="width: 70px"  >{{columns[0].label}}</q-th>
                    <q-th class="col" >{{columns[1].label}}</q-th>
                    <q-th class="text-center" style="width: 190px" >{{columns[2].label}}</q-th>
                    <q-th class="text-center" style="width: 190px" >{{columns[3].label}}</q-th>
                    <q-th class="text-center" style="width: 190px" >{{columns[4].label}}</q-th>
                    <q-th class="text-center" style="width: 110px" v-if=!isCharts >{{columns[5].label}}</q-th>
                  </q-tr>
            </template>
            <template #body="props">
              <q-tr :props="props">
                <q-td key="order" :props="props">
                </q-td>
                <q-td key="drug" :props="props">
                  {{props.row.name}}
                </q-td>
                <q-td key="consumeAVG" :props="props">
                  {{props.row.getMonthAVGConsuption()}}
                </q-td>
                <q-td key="currUnits" :props="props">
                  {{props.row.getCurStockAmount()}}
                </q-td>
                <q-td key="state" :props="props">
                  <q-chip :color="props.row.getConsuptionRelatedColor()" text-color="white">
                    {{props.row.getConsuptionState()}}
                  </q-chip>
                </q-td>
                <q-td key="options" :props="props">
                  <div class="col">
                    <q-btn flat round
                    color="primary"
                    icon="description"
                      v-if=!isCharts
                    @click="openDrugFile(props.row)">
                    <q-tooltip class="bg-primary">Visualizar Ficha</q-tooltip>
                  </q-btn>
                  </div>
                </q-td>
              </q-tr>
            </template>
        </q-table>
  </div>
</template>

<script>
import { date, SessionStorage } from 'quasar'
import Drug from '../../store/models/drug/Drug'
// import PatientVisitDetails from '../../store/models/patientVisitDetails/PatientVisitDetails'
import { ref } from 'vue'
import moment from 'moment'
import PackagedDrug from '../../store/models/packagedDrug/PackagedDrug'
const columns = [
  { name: 'order', required: true, label: 'Ordem', align: 'left', sortable: false },
  { name: 'drug', align: 'left', label: 'Medicamento', sortable: true },
  { name: 'consumeAVG', align: 'center', label: 'Média de Consumo Mensal', sortable: false },
  { name: 'currUnits', align: 'center', label: 'Saldo Actual', sortable: true },
  { name: 'state', align: 'center', label: 'Estado', sortable: true },
  { name: 'options', align: 'center', label: 'Opções', sortable: false }
]
// let headerClass = 'col'
// let title = ''
export default {
   props: ['isCharts', 'dataLoaded', 'serviceCode'],
  data () {
    return {
      filter: ref(''),
      columns,
      headerClass: '',
      title: ''
    }
  },
  methods: {
    openDrugFile (drug) {
      SessionStorage.set('selectedDrug', drug)
      this.$router.push('/stock/drugFile')
    },
    getStickyHeaderClass () {
      if (this.isCharts) {
      this.headerClass = 'my-sticky-header-table text-center'
       this.title = 'Alerta de Stock'
      } else {
         this.headerClass = 'col'
       this.title = ''
      }
    },
    getDrugsByServiceCode () {
        if (this.isCharts && this.dataLoaded && this.serviceCode != null) {
        const drugsToShow = new Set()
           const packagedDrugs = PackagedDrug.query()
                  .with('drug.stocks')
                 .with('pack.patientVisitDetails.episode.patientServiceIdentifier.service')
                 .orderBy('name')
                 .get()
                  console.log(packagedDrugs)
             const packagedDrugss = packagedDrugs.filter((packagedDrug) => {
               console.log(moment(packagedDrug.pack.pickupDate).isAfter(date.subtractFromDate(new Date(), { months: 3 })))
                    return moment(packagedDrug.pack.pickupDate).isAfter(date.subtractFromDate(new Date(), { months: 3 })) && packagedDrug.pack.patientVisitDetails[0].episode.patientServiceIdentifier.service.code === this.serviceCode
             })
               console.log(packagedDrugss)
              packagedDrugs.forEach((packagedDrug) => {
                     drugsToShow.add(packagedDrug.drug)
              })
              console.log(...drugsToShow.keys())
           return [...drugsToShow.keys()]
      }
    }
  },
  computed: {
    stockList () {
      return []
    },
    drugs: {
      get () {
      if (this.isCharts && this.dataLoaded && this.serviceCode != null) {
        const drugsToShow = new Set()
           const packagedDrugs = PackagedDrug.query()
                  .with('drug.stocks')
                  .with('drug.packaged_drugs')
                 .with('pack.patientVisitDetails.episode.patientServiceIdentifier.service')
                 .orderBy('name')
                 .get()
                  console.log(packagedDrugs)
             const packagedDrugss = packagedDrugs.filter((packagedDrug) => {
               console.log(moment(packagedDrug.pack.pickupDate).isAfter(date.subtractFromDate(new Date(), { months: 3 })))
                    return moment(packagedDrug.pack.pickupDate).isAfter(date.subtractFromDate(new Date(), { months: 3 })) && packagedDrug.pack.patientVisitDetails[0].episode.patientServiceIdentifier.service.code === this.serviceCode
             })
               console.log(packagedDrugss)
              packagedDrugss.forEach((packagedDrug) => {
                     drugsToShow.add(packagedDrug.drug)
              })
           return [...drugsToShow.keys()]
      } else {
      return Drug.query()
                 .with('stocks')
                 .has('stocks')
                 .with('packaged_drugs.pack', (query) => {
                        query.where((pack) => {
                          return pack.pickupDate >= date.subtractFromDate(new Date(), { months: 3 })
                        })
                      })
                  .where('active', true)
                 .orderBy('name')
                 .get()
      }
      }
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
    this.getStickyHeaderClass()
    },
      watch: {
   serviceCode: function (newVal, oldVal) {
          console.log('Prop changed: ', newVal, ' | was: ', oldVal)
      //   this.getDrugsByServiceCode()
    //   this.updateChart()
        },
        dataLoaded: function (newVal, oldVal) {
          console.log('Prop changed: ', newVal, ' | was: ', oldVal)
       //  this.getLastPatientPrescriptionByClinicalService()
   //   this.updateChart()
  // this.drugs = this.getDrugsByServiceCode()
        }
        }
}
</script>
<style lang="sass">
.my-sticky-header-table
  .q-table__top,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #0ba58b

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

</style>
