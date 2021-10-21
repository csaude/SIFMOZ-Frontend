<template>
    <q-table
      :rows="this.rows"
      :columns="columns"
      :filter="filter"
      virtual-scroll>
        <template v-slot:top-right>
            <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
            <template v-slot:append>
                <q-icon name="search" />
            </template>
                </q-input>
        </template>
        <template v-slot:body="props">
            <q-tr :props="props">
            <q-td key="clinicName" :props="props">
                {{ props.row.clinicName }}
            </q-td>
            <q-td key="code" :props="props">
                {{ props.row.code }}
            </q-td>
            <q-td key="province" :props="props">
                {{ props.row.province.description }}
            </q-td>
             <q-td key="district" :props="props">
              {{  props.row.district !== undefined && props.row.district !== null ? props.row.district.description : '' }}
            </q-td>
            </q-tr>
        </template>
    </q-table>

</template>
<script>
import { ref } from 'vue'

export default {
  props: ['rows', 'columns', 'updateClinicAppoitment'],
  emits: ['update:appointment'],
  setup () {
    const selected = ref([])
    const lastIndex = ref(null)
    const tableRef = ref(null)
    return {
        valOption: ref(true),
        lastIndex,
        tableRef,
        selected,
        filter: ''
    }
  },
 computed: {
  },
  methods: {
  },
  mounted () {
  },
    components: {
  }
}
</script>
