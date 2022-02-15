<template>
  <q-card style="width: 900px; max-width: 90vw;">
        <form @submit.prevent="doFormValidation" >
            <q-card-section >
              <div class="row items-center text-subtitle1">
                <q-icon  name="groups" size="md" color="primary"/>
                <div class="text-bold text-grey-10 q-ml-sm">Grupo: {{curGroup.code}}</div>
                <div class="text-grey-10 q-ml-sm"><span class="text-bold text-h6">|</span> {{curGroup.name}}</div>
                <div class="text-grey-10 q-ml-sm"><span class="text-bold text-h6">|</span> {{curGroup.groupType.code}}</div>
              </div>
              <q-separator/>
            </q-card-section>
            <div class="q-mx-lg">
              <div class="q-mt-lg">
                  <div class="row items-center q-mb-sm">
                      <span class="text-subtitle2">Dispensa</span>
                  </div>
                  <q-separator color="grey-13" size="1px" class="q-mb-sm"/>
              </div>
              <div class="row q-mt-md">
                <q-input
                  dense
                  outlined
                  bg-color="white"
                  class="col"
                  v-model="pickupDate"
                  @update:model-value="determineNextPickUpDate()"
                  ref="pickupDate"
                  label="Data de Levantamento">
                  <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                          <q-date v-model="pickupDate" mask="DD-MM-YYYY" @update:model-value="determineNextPickUpDate()" >
                          <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                          </q-date>
                      </q-popup-proxy>
                      </q-icon>
                  </template>
              </q-input>

              <q-select
                dense
                class="q-mx-sm col"
                bg-color="white"
                @blur="determineNextPickUpDate()"
                outlined
                v-model="drugsDuration"
                :options="durations"
                option-value="id"
                option-label="description"
                label="Dispensa para" />

              <q-input
                outlined dense
                v-model="nextPDate"
                label="Proximo Levantamento"
                bg-color="white"
                class="col"
                ref="nextPickupDate">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="nextPDate" mask="DD-MM-YYYY">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-select
                dense
                class="q-mx-sm col"
                bg-color="white"
                outlined
                v-model="dispenseMode"
                :options="dispenseModes"
                option-value="id"
                option-label="description"
                label="Modo de dispensa" />
              </div>
              <span>
                <div class="q-mt-md">
                  <div class="row items-center q-mb-sm">
                      <span class="text-subtitle2">Membros</span>
                  </div>
                  <q-separator color="grey-13" size="1px" class="q-mb-sm"/>
                </div>
                <span v-if="curGroup !== null" >
                  <span v-for="member in curGroup.members" :key="member.id">
                  <ListHeader
                    :addVisible="true"
                    :mainContainer="true"
                    @showAdd="openAddPrescribedDrugForm(member.patient)"
                    bgColor="bg-primary">{{member.patient.preferedIdentifier().value}} - {{member.patient.fullName}}
                  </ListHeader>
                  <div class="col">
                    <q-table
                      class="col"
                      dense
                      flat
                      :rows="member.patient.identifiers[0].episodes[0].lastVisit().prescription.prescribedDrugs"
                      :columns="columns"
                      row-key="id"
                      >
                      <template v-slot:no-data="{ icon, filter }">
                        <div class="full-width row flex-center text-primary q-gutter-sm text-body2">
                          <span>
                            Nenhum Medicamento Indicado
                          </span>
                          <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
                        </div>
                      </template>
                      <template #body="props">
                        <q-tr :props="props">
                          <q-td key="order" :props="props">
                          </q-td>
                          <q-td key="drug" :props="props">
                            {{props.row.drug.name}}
                          </q-td>
                          <q-td key="packSize" :props="props">
                            {{props.row.drug.packSize}}
                          </q-td>
                          <q-td key="form" :props="props">
                            {{props.row.drug.form.description}}
                          </q-td>
                          <q-td key="takeInstrucions" :props="props">
                            {{props.row.drug.defaultTreatment}} - {{props.row.drug.defaultTimes}}X por {{props.row.drug.defaultPeriodTreatment}}
                          </q-td>
                          <q-td key="packs" :props="props">
                            {{props.row.getQtyPrescribed(drugsDuration)}}
                          </q-td>
                          <q-td key="options" :props="props">
                            <div class="col">
                              <q-btn flat round
                              color="red-8"
                              icon="delete"
                              @click="removePatient(props.row)">
                              <q-tooltip class="bg-red-5">Remover</q-tooltip>
                            </q-btn>
                            </div>
                          </q-td>
                        </q-tr>
                      </template>
                    </q-table>
                  </div>
                  </span>
                </span>

              </span>
            </div>
           <q-card-actions align="right" class="q-mb-md q-mr-sm">
              <q-btn label="Cancelar" color="red" @click="$emit('close')"/>
              <q-btn type="submit" label="Dispensar" color="primary" />
            </q-card-actions>
        </form>
        <q-dialog persistent v-model="showAddEditDrug">
          <AddEditPrescribedDrug
            @addPrescribedDrug="addPrescribedDrug"
            :visitDetails="selectedVisitDetails"
            :hasTherapeuticalRegimen="hasTherapeuticalRegimen"
            @close="showAddEditDrug = false" />
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
import { date, QSpinnerBall, SessionStorage } from 'quasar'
import DispenseMode from '../../store/models/dispenseMode/DispenseMode'
import Duration from '../../store/models/Duration/Duration'
import Group from '../../store/models/group/Group'
import moment from 'moment'
import Patient from '../../store/models/patient/Patient'
import Episode from '../../store/models/episode/Episode'
import GroupPackHeader from '../../store/models/group/GroupPackHeader'
import GroupPack from '../../store/models/group/GroupPack'
import Pack from '../../store/models/packaging/Pack'
import Clinic from '../../store/models/clinic/Clinic'
import Stock from '../../store/models/stock/Stock'
import PackagedDrug from '../../store/models/packagedDrug/PackagedDrug'
import PackagedDrugStock from '../../store/models/packagedDrug/PackagedDrugStock'
import PatientVisitDetails from '../../store/models/patientVisitDetails/PatientVisitDetails'
import PatientVisit from '../../store/models/patientVisit/PatientVisit'
import Prescription from '../../store/models/prescription/Prescription'
import ClinicalService from '../../store/models/ClinicalService/ClinicalService'
const columns = [
  { name: 'order', align: 'left', label: 'Ordem', sortable: false },
  { name: 'drug', align: 'left', label: 'Medicamento', sortable: false },
  { name: 'packSize', align: 'left', label: 'Quantidade no Frasco', sortable: false },
  { name: 'form', align: 'left', label: 'Forma', sortable: false },
  { name: 'takeInstrucions', align: 'left', label: 'Instrução de Toma', sortable: false },
  { name: 'packs', align: 'left', label: 'Número de Frascos', sortable: false },
  { name: 'options', align: 'left', label: 'Opções', sortable: false }
]
export default {
  props: ['group'],
  data () {
    return {
      columns,
      alert: ref({
        type: '',
        visible: false,
        msg: ''
      }),
      nextPDate: '',
      pickupDate: '',
      drugsDuration: '',
      dispenseMode: '',
      curGroupPackHeader: new GroupPackHeader(),
      selectedGroup: null,
      showAddEditDrug: false,
      selectedVisitDetails: new PatientVisitDetails(),
      hasTherapeuticalRegimen: false
    }
  },
  methods: {
    init () {
      this.loadGroup()
    },
    doFormValidation () {
      this.generatepacks()
    },
    addPrescribedDrug (prescribedDrug, visitDetails) {
      console.log(prescribedDrug)
      console.log(visitDetails)
    },
    openAddPrescribedDrugForm (patient) {
      patient.identifiers[0].service = ClinicalService.query()
                                                      .with('identifierType')
                                                      .with('therapeuticRegimens')
                                                      .with('clinicSectors')
                                                      .with('attributes.clinicalServiceAttributeType')
                                                      .where('id', patient.identifiers[0].service.id)
                                                      .first()
      const pvd = new PatientVisitDetails({
                          patientVisit: new PatientVisit({
                                          visitDate: new Date(),
                                          patient: Patient.query()
                                                          .with('province')
                                                          .with('district.province')
                                                          .with('clinic.province')
                                                          .where('id', patient.id)
                                                          .first(),
                                          clinic: this.clinic
                                        }),
                          clinic: this.clinic,
                          prescription: Prescription.query()
                                                    .with('prescriptionDetails.therapeuticRegimen')
                                                    .with('duration')
                                                    .with('prescribedDrugs')
                                                    .with('patientVisitDetails.*')
                                                    .where('id', patient.identifiers[0].episodes[0].lastVisit().prescription.id)
                                                    .first(),
                          episode: Episode.query()
                                          .with('startStopReason')
                                          .with('episodeType')
                                          .with('clinicSector')
                                          .with('patientServiceIdentifier')
                                          .where('id', patient.identifiers[0].episodes[0].id)
                                          .first()
                        })
      this.selectedVisitDetails = pvd
      this.selectedVisitDetails.episode.patientServiceIdentifier.service = patient.identifiers[0].service
      this.hasTherapeuticalRegimen = patient.identifiers[0].hasTherapeuticalRegimen()
      this.showAddEditDrug = true
    },
    generatepacks () {
      this.$q.loading.show({
        message: 'Por favor aguarde ...',
        spinnerColor: 'grey-4',
        spinner: QSpinnerBall
      })

      setTimeout(() => {
        this.$q.loading.hide()
      }, 900)
      this.initGroupPackHeader()
      this.curGroup.members.forEach((member) => {
        const pack = new Pack({
          packDate: this.curGroupPackHeader.packDate,
          pickupDate: this.curGroupPackHeader.packDate,
          nextPickUpDate: this.curGroupPackHeader.nextPickUpDate,
          weeksSupply: this.curGroupPackHeader.duration.weeks,
          dispenseMode: this.dispenseMode,
          clinic: this.clinic,
          patientVisitDetails: [],
          syncStatus: member.patient.his_id.length > 10 ? 'R' : 'N'
        })
        this.initNewPack(member.patient.identifiers[0].episodes[0].patientVisitDetails[0], pack, member.patient, member.patient.identifiers[0].episodes[0])
        const groupPack = new GroupPack({
          pack: pack
        })
        this.curGroupPackHeader.groupPacks.push(groupPack)
      })
      const i = 0
      this.savePatientVisitDetails(this.curGroupPackHeader.groupPacks, i)
    },
    savePatientVisitDetails (groupPacks, i) {
      if (groupPacks[i] !== null && groupPacks[i] !== undefined) {
        const patientVisit = groupPacks[i].pack.patientVisitDetails[0].patientVisit
        patientVisit.patientVisitDetails.push(groupPacks[i].pack.patientVisitDetails[0])
        patientVisit.patientVisitDetails[0].patientVisit = null
        groupPacks[i].pack.patientVisitDetails = []
        Pack.apiSave(groupPacks[i].pack).then(resp => {
          groupPacks[i].pack.id = resp.response.data.id
          patientVisit.patientVisitDetails[0].pack = groupPacks[i].pack
          patientVisit.patientVisitDetails[0].pack.packagedDrugs = []

          console.log(patientVisit)
          PatientVisit.apiSave(patientVisit).then(resp => {
            groupPacks[i].pack.patientVisitDetails = []
            i = i + 1
            setTimeout(this.savePatientVisitDetails(groupPacks, i), 4)
          })
        })
      } else {
        GroupPackHeader.apiSave(this.curGroupPackHeader).then(resp => {
          this.curGroupPackHeader.id = resp.response.data.id
          Group.apiFetchById(this.curGroupPackHeader.group.id)
          this.displayAlert('info', 'Operação efectuada com sucesso.')
        })
        console.log(this.curGroupPackHeader)
      }
    },
    savePack (pack, i) {
      Pack.apiSave(pack).then(resp => {
        pack.id = resp.response.data.id
        i = i + 1
        setTimeout(this.savePatientVisitDetails(i), 400)
      })
    },
    fechtPatientVisitDetails (pack) {
      PatientVisitDetails.apiFetchById(pack.patientVisitDetails.id).then(resp => {
        pack.patientVisitDetails = PatientVisitDetails.find(pack.patientVisitDetails.id)
      })
    },
    initGroupPackHeader () {
      this.curGroupPackHeader = new GroupPackHeader()
      this.curGroupPackHeader.group = Group.query()
                                            .with('service')
                                            .with('groupType')
                                            .with('clinic.province')
                                            .where('id', this.group.id)
                                            .first()
      this.curGroupPackHeader.duration = this.drugsDuration
      this.curGroupPackHeader.packDate = this.getJSDateFromDDMMYYY(this.pickupDate)
      this.curGroupPackHeader.nextPickUpDate = this.getJSDateFromDDMMYYY(this.nextPDate)
    },
    initNewPack (visitDetails, pack, patient, episode) {
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
          if (validStock[i] !== undefined && (validStock[i].stockMoviment >= qtyPrescribed)) {
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
        const pvd = new PatientVisitDetails({
                          patientVisit: new PatientVisit({
                                          visitDate: this.curGroupPackHeader.packDate,
                                          patient: Patient.query()
                                                          .with('province')
                                                          .with('district.province')
                                                          .with('clinic.province')
                                                          .where('id', patient.id)
                                                          .first(),
                                          clinic: this.clinic
                                        }),
                          clinic: this.clinic,
                          prescription: Prescription.query()
                                                    .with('doctor')
                                                    .with('duration')
                                                    .with('prescriptionDetails')
                                                    .where('id', visitDetails.prescription.id)
                                                    .first(),
                          episode: Episode.query()
                                          .with('startStopReason')
                                          .with('episodeType')
                                          .with('clinicSector')
                                          .with('patientServiceIdentifier')
                                          .where('id', episode.id)
                                          .first()
                        })
                        console.log(pvd)
        pack.patientVisitDetails = []
        pack.patientVisitDetails.push(pvd)
        pack.packagedDrugs.push(packDrug)
      }.bind(this))
    },
    loadGroup () {
      const group = Group.query()
                        .with('service')
                        .with('members.patient.identifiers.identifierType')
                        .with('groupType')
                        .where('id', this.group.id)
                        .first()
      group.members.forEach((member) => {
        member.patient = Patient.query().with(['identifiers.identifierType', 'identifiers.service.identifierType'])
                                .with('province')
                                .with('clinic').where('id', member.patient.id).first()
        member.patient.identifiers = member.patient.identifiers.filter((identifier) => {
          return identifier.service.id === this.group.service.id
        })
        member.patient.identifiers[0].episodes = []
        member.patient.identifiers[0].episodes[0] = this.lastStartEpisodeWithPrescription(member.patient.identifiers[0].id)
      })
      console.log(group)
      this.selectedGroup = group
      return group
    },
    lastStartEpisodeWithPrescription (identifierId) {
      let episode = null
      const episodes = Episode.query()
                              .with('startStopReason')
                              .with('clinicSector')
                              .with('patientServiceIdentifier')
                              .with(['patientVisitDetails.*'])
                              .has('patientVisitDetails')
                              .whereHas('episodeType', (query) => {
                                    query.where('code', 'INICIO')
                                  })
                              .where('patientServiceIdentifier_id', identifierId)
                              .orderBy('creationDate', 'desc')
                              .get()
      Object.keys(episodes).forEach(function (k) {
        const id = episodes[k]
        if (episode === null && id.hasVisits()) {
          episode = id
          episode.lastVisit().prescription = Prescription.query()
                                                          .with('doctor')
                                                          .with('duration')
                                                          .with('prescribedDrugs.drug.form')
                                                          .with('prescriptionDetails')
                                                          .where('id', episode.lastVisit().prescription.id)
                                                          .first()
        }
      })
      return episode
    },
    determineNextPickUpDate () {
      if (date.isValid(this.getJSDateFromDDMMYYY(this.pickupDate)) && this.drugsDuration !== '') {
        const newDate = this.getJSDateFromDDMMYYY(this.pickupDate)
        let lostDays = parseInt((this.drugsDuration.weeks / 4) * 2)
        if (this.drugsDuration.weeks <= 1) lostDays = 0
        const daysToAdd = parseInt((this.drugsDuration.weeks * 7) + lostDays)
        this.nextPDate = this.getDDMMYYYFromJSDate(date.addToDate(newDate, { days: daysToAdd }))
        // this.$emit('updateQtyPrescribed', this.drugsDuration, this.pickupDate, this.nextPDate)
      }
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
        SessionStorage.set('selectedGroup', this.curGroup)
        this.$router.push('/group/panel')
      }
    },
    getJSDateFromDDMMYYY (dateString) {
      const dateParts = dateString.split('-')
      return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0])
    },
    getDDMMYYYFromJSDate (jsDate) {
      return moment(jsDate).format('DD-MM-YYYY')
    }
  },
  computed: {
    curGroup: {
      get () {
        if (this.selectedGroup !== null) {
          return this.selectedGroup
        } else {
          return this.loadGroup()
        }
      }
    },
    durations: {
      get () {
        return Duration.all()
      }
    },
    dispenseModes: {
      get () {
        return DispenseMode.all()
      }
    },
    clinic () {
      return Clinic.query().with('province').where('id', SessionStorage.getItem('currClinic').id).first()
    }
  },
  components: {
    Dialog: require('components/Shared/Dialog/Dialog.vue').default,
    ListHeader: require('components/Shared/ListHeader.vue').default,
    AddEditPrescribedDrug: require('components/Patient/PatientPanel/AddEditPrescribedDrug.vue').default
  }
}
</script>

<style>

</style>
