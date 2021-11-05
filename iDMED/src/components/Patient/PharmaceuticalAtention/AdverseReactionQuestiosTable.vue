<template>
  <div class="q-pa-md">
    <q-table
      title="Reacoes Adversas aos Medicmanentos"
      :rows="monithoringQuestions"
      :columns="columns"
      row-key="question"
      :separator="separator"
      v-model:pagination="pagination"
      :rows-per-page-options="[0]"
      virtual-scroll
        hide-bottom
    >
     <template v-slot:body="props">
            <q-tr :props="props">
            <q-td key="question" v-if="props.row.code !== '02'" >
             {{props.row.question}}
            </q-td>
            <q-td key="question" v-if="props.row.code === '02'">
                  <q-input filled v-model="props.row.text" label=" Descreva brevemente a reação?" @update:model-value="handleInput(props.row)" :disable="onlyView"/>
            </q-td>
             <q-td key="completed" v-if="props.row.code === '01'" align="right">
                <q-radio   v-model="props.row.completed" val="true" @update:model-value="handleInput(props.row)"  align="right" :disable="onlyView"/>
            </q-td>
             <q-td key="completed" v-if="props.row.code === '01'" align="left" >
                <q-radio   v-model="props.row.completed" val="false" @update:model-value="handleInput(props.row)" align="left" :disable="onlyView"/>
            </q-td>
            </q-tr>
        </template>
    </q-table>
     <q-card>
     <q-card-actions align="right" class="q-mb-md q-mr-sm" v-if="onlyView">
                <q-btn label="Sair" color="red" @click="$emit('close')" align="right" />
     </q-card-actions>
    </q-card>
  </div>
</template>
<script>
import RAMScreening from '../../../store/models/screening/RAMScreening'

const columns = [
  {
    name: 'question',
    required: true,
    label: 'Perguntas de Rastreio de Reacções Adversas aos Medicamentos',
    align: 'left',
    field: row => row.question,
    format: val => `${val}`
  },
  { name: 'sim', label: 'Sim', field: row => row.completed, align: 'right' },
  { name: 'nao', label: 'Não', field: row => row.completed, align: 'left' }
]

const monithoringQuestions = [
        {
           question: 'Tem alguma reação adversa que acha que e causada pelos medicamentos ?',
           completed: false,
            code: '01'
         },
         {
           question: '',
           completed: false,
            code: '02',
            text: ''
         }
]

export default {
   props: ['selectedRamTracing', 'onlyView'],
    data () {
        return {
            columns,
           monithoringQuestions,
           rAMScreening: new RAMScreening()
        }
    },
    methods: {
         handleInput (row) {
   switch (row.code) {
    case '01':
      this.rAMScreening.adverseReactionMedicine = row.completed
      break
      case '02':
      this.rAMScreening.adverseReaction = row.text
      break
  default:
    console.log('Sorry, we are out of .')
   }
    this.$emit('rAMScreening', this.rAMScreening)
    },
     addingValueToArray () {
       if (this.selectedRamTracing) {
      monithoringQuestions.forEach(monithoringQuestion => {
           if (monithoringQuestion.code === '01') monithoringQuestion.completed = String(this.selectedRamTracing.adverseReactionMedicine)
            if (monithoringQuestion.code === '02') monithoringQuestion.text = this.selectedRamTracing.adverseReaction
          })
    }
     }
    },
    created () {
      this.addingValueToArray()
    },
    components: {
    },
    mounted () {
    },
    computed: {
    }
}
</script>
