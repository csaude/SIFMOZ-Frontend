<template>
  <div>
    <ListHeader
      :addVisible="true"
      :mainContainer="true"
      @showAdd="$emit('newPacking', headers[0])"
      bgColor="bg-primary">Dispensas Efectuadas
    </ListHeader>
    <div class="q-mb-md box-border">
      <q-table
          class="col"
          dense
          flat
          :rows="headers"
          :columns="columns"
          row-key="id"
          >
          <template v-slot:no-data="{ icon, filter }">
            <div class="full-width row flex-center text-primary q-gutter-sm text-body2">
              <span>
                Nenhuma dispensa efectuada
              </span>
              <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
            </div>
          </template>
          <template #body="props">
            <q-tr :props="props">
              <q-td key="order" :props="props">
              </q-td>
              <q-td key="lastDispenseDate" :props="props">
                {{this.getDDMMYYYFromJSDate(props.row.packDate)}}
              </q-td>
              <q-td key="nextPickupDate" :props="props">
                {{this.getDDMMYYYFromJSDate(props.row.nextPickUpDate)}}
              </q-td>
              <q-td key="duration" :props="props">
                {{props.row.duration.weeks / 4}} mes(es)
              </q-td>
              <q-td key="pickUpDays" :props="props">
                Passam {{this.getDateDiff(new Date(), props.row.packDate)}} dias após o último levantamento
              </q-td>
              <q-td key="options" :props="props">
                <div class="col">
                  <q-btn flat round
                  :disable="!props.row.isLast"
                  color="red-8"
                  icon="delete"
                  @click="removePack(props.row)">
                  <q-tooltip class="bg-red-5">Remover</q-tooltip>
                </q-btn>
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import moment from 'moment'
import { date, SessionStorage } from 'quasar'
import GroupPackHeader from '../../../store/models/group/GroupPackHeader'
const columns = [
  { name: 'order', align: 'left', label: 'Ordem', sortable: false },
  { name: 'lastDispenseDate', align: 'left', label: 'Data da Última Dispensa', sortable: false },
  { name: 'nextPickupDate', align: 'left', label: 'Data do Próximo Levantamento', sortable: false },
  { name: 'duration', align: 'left', label: 'Período Dispensado', sortable: false },
  { name: 'pickUpDays', align: 'left', label: 'Dias de Levantamento', sortable: false },
  { name: 'options', align: 'left', label: 'Opções', sortable: false }
]
export default {
  props: ['packHeaders'],
  data () {
    return {
      grupPacks: ref([]),
      columns
    }
  },
  methods: {
    getJSDateFromDDMMYYY (dateString) {
      const dateParts = dateString.split('-')
      return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0])
    },
    formatDate (dateString) {
      if (!dateString || !moment(dateString).isValid()) return ''
      const dateMoment = moment(dateString).format('DD-MM-YYYY')
      return dateMoment
    },
    getDDMMYYYFromJSDate (jsDate) {
      return moment(jsDate).format('DD-MM-YYYY')
    },
    getDateDiff (date1, date2) {
      return date.getDateDiff(date1, date2, 'days')
    },
    loadHeaders () {
      const headers = GroupPackHeader.query().with('groupPacks.pack').with('duration').where('group_id', SessionStorage.getItem('selectedGroup').id).orderBy('packDate', 'desc').get()
      if (headers.length > 0) {
        headers[0].isLast = true
      }
      return headers
    }
  },
  computed: {
    headers: {
      get () {
        return this.loadHeaders()
      }
    }
  },
  components: {
    ListHeader: require('components/Shared/ListHeader.vue').default
  }
}
</script>

<style>

</style>
