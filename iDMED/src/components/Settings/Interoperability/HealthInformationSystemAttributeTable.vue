<template>
    <q-table
      :rows="this.rows"
      :columns="columns"
      :filter="filter"
      virtual-scroll>
        <template v-slot:body="props">
            <q-tr :props="props">
            <q-td key="interoperabilityType" :props="props">
                {{ props.row.interoperabilityType.description }}
            </q-td>
            <q-td key="value" :props="props">
              <q-input v-model="props.row.value" dense autofocus counter :disable="viewMode" />
            </q-td>
            </q-tr>
        </template>
    </q-table>

</template>
<script>
import { ref } from 'vue'

export default {
  props: ['rows', 'columns', 'viewMode'],
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
        filter: '',
         selection: ref([''])
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
