<template>
  <q-card style="width: 900px; max-width: 90vw;">
        <form @submit.prevent="submitForm" >
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
                  <span v-for="member in curGroup.members" :key="member.id">
                  <ListHeader
                    :addVisible="true"
                    :mainContainer="true"
                    @showAdd="$emit('newPacking')"
                    bgColor="bg-primary">{{member.patient.preferedIdentifier().value}} - {{member.patient.fullName}}
                  </ListHeader>
                  <div class="col">
                    <q-table
                      class="col"
                      dense
                      flat
                      :rows="member.patient.identifiers[0].episodes[0].patientVisitDetails[0].prescriptions[0].prescribedDrugs"
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
            </div>
           <q-card-actions align="right" class="q-mb-md q-mr-sm">
              <q-btn label="Cancelar" color="red" @click="$emit('close')"/>
              <q-btn type="submit" label="Dispensar" color="primary" />
            </q-card-actions>
        </form>
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
import { date } from 'quasar'
import DispenseMode from '../../store/models/dispenseMode/DispenseMode'
import Duration from '../../store/models/Duration/Duration'
import Group from '../../store/models/group/Group'
import moment from 'moment'
import Patient from '../../store/models/patient/Patient'
import Episode from '../../store/models/episode/Episode'
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
      dispenseMode: ''
    }
  },
  methods: {
    init () {

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
      return group
    },
    lastStartEpisodeWithPrescription (identifierId) {
      let episode = null
      const episodes = Episode.query()
                              .with('startStopReason')
                              .with('clinicSector')
                              .with('patientServiceIdentifier')
                              .with(['patientVisitDetails.prescriptions.*', 'patientVisitDetails.prescriptions.prescribedDrugs.drug.form', 'patientVisitDetails.packs.*'])
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
        return this.loadGroup()
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
    }
  },
  components: {
    Dialog: require('components/Shared/Dialog/Dialog.vue').default,
    ListHeader: require('components/Shared/ListHeader.vue').default
  },
  mounted () {
    this.init()
  }
}
</script>

<style>

</style>
