<template>
  <div class="q-pa-md">
    <q-table
      title="Rasterio de Tuberculose"
      :rows="tbQuestions"
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
            <q-td key="question" v-if="props.row.code !== '03'">
             {{props.row.question}}
            </q-td>
             <q-td key="date" v-if="props.row.code === '03' && this.visible === true">
                  <q-input
                        dense
                        outlined
                        class="col"
                        v-model="props.row.date"
                        mask="date"
                        :rules="['date']"
                         :disable="onlyView"
                        label="Data de Inicio de Tratamento de Tuberculose">
                        <template v-slot:append>
                            <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                <q-date v-model="props.row.date" >
                                <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                                </q-date>
                            </q-popup-proxy>
                            </q-icon>
                        </template>
                    </q-input>
            </q-td>
            <q-td key="completed" v-if="props.row.code !== '03'" align="right">
                <q-radio   v-model="props.row.completed" val=true @update:model-value="handleInput(props.row)" :disable="onlyView"/>
            </q-td>
             <q-td key="completed" v-if="props.row.code !== '03'" align="left">
                <q-radio   v-model="props.row.completed" val=false @update:model-value="handleInput(props.row)" :disable="onlyView"/>
            </q-td>
            </q-tr>
        </template>
    </q-table>
   <q-table
      :rows="tbQuestion2"
      :columns="columns2"
      row-key="question"
      :separator="separator"
      v-model:pagination="pagination"
      :rows-per-page-options="[0]"
      virtual-scroll
        hide-bottom
    >
     <template v-slot:body="props">
            <q-tr :props="props">
            <q-td key="question" >
             {{props.row.question}}
            </q-td>
            <q-td key="completed" align="right">
                <q-radio   v-model="props.row.completed" val=true @update:model-value="handleInput(props.row)" :disable="onlyView"/>
            </q-td>
             <q-td key="completed" align="left">
                <q-radio   v-model="props.row.completed"  val=false  @update:model-value="handleInput(props.row)" :disable="onlyView"/>
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
import TBScreening from '../../../store/models/screening/TBScreening'

const columns = [
  {
    name: 'question',
    required: true,
    label: 'Perguntas de Rastreio de Tuberculose',
    align: 'left',
    field: row => row.question,
    format: val => `${val}`
  },
  { name: 'sim', label: 'Sim', field: row => row.completed, align: 'right' },
  { name: 'nao', label: 'Não', field: row => row.completed, align: 'left' }
]
const columns2 = [
  {
    name: 'question',
    required: true,
    label: 'Sinais e Sintomas sugestivos a TB',
    align: 'left',
    field: row => row.question,
    format: val => `${val}`
  },
  { name: 'sim', label: 'Sim', field: row => row.completed, align: 'right' },
  { name: 'nao', label: 'Não', field: row => row.completed, align: 'left' }
]

const tbQuestions = [
        {
           question: 'Está Actualmente em tratamento Profilático com Isoniazida(TPI)?',
           completed: false,
            code: '01'
         },
         {
           question: 'Está em tratamento de tuberculose(TB)?',
           completed: false,
            code: '02'
         },
          {
           question: '',
           completed: true,
            code: '03',
            date: ''
         }
]

const tbQuestion2 = [
     {
           question: 'Está com tosse a duas semanas?',
           completed: false,
            code: '04'
        },
        {
            question: 'Teve febres nas ultimas duas semanas ?',
            completed: false,
            code: '05'
        },
        {
           question: 'Perdeu peso >1.5 kg no ultimo mês?',
           completed: false,
           code: '06'
        },
        {
           question: 'Tem suado muito a noite?',
           completed: false,
            code: '07'
         },
        {
           question: 'Teve cansaco ou fadiga nas ultimas duas semanas ?',
           completed: false,
            code: '08'
        },
        {
         question: 'Tem um parente em casa que está a fazer tratamento de TB ?',
         completed: false,
         code: '09'
        }
]
export default {
    props: ['selectedTbTracing', 'onlyView'],
    data () {
        return {
            columns,
           tbQuestions,
           tbQuestion2,
           columns2,
           visible: false,
           tbScreening: new TBScreening()
        }
    },
    methods: {
         handleInput (row) {
   switch (row.code) {
    case '01':
      this.tbScreening.treatmentTPI = row.completed
      break
     case '02':
      this.tbScreening.treatmentTB = row.completed
      if (row.completed === 'true') {
      this.visible = true
      } else {
         this.visible = false
      }
      break
       case '03':
      if (this.tbScreening.treatmentTB === 'true') {
        this.tbScreening.startTreatmentDate = new Date(row.date)
      } else {
        this.tbScreening.startTreatmentDate = ''
      }
      break
     case '04':
      this.tbScreening.cough = row.completed
      break
      case '05':
      this.tbScreening.fever = row.completed
      break
      case '06':
      this.tbScreening.losingWeight = row.completed
      break
        case '07':
      this.tbScreening.sweating = row.completed
      break
       case '08':
      this.tbScreening.fatigueOrTirednessLastTwoWeeks = row.completed
      break
       case '09':
      this.tbScreening.parentTBTreatment = row.completed
      break
  default:
    console.log('Sorry, we are out of .')
   }
    this.$emit('tbScreening', this.tbScreening)
    },
    addingValueToArray () {
       if (this.selectedTbTracing) {
      tbQuestions.forEach(tbQuestion => {
           if (tbQuestion.code === '01') tbQuestion.completed = String(this.selectedTbTracing.treatmentTPI)
            if (tbQuestion.code === '02') tbQuestion.completed = String(this.selectedTbTracing.treatmentTB)
          })

           tbQuestion2.forEach(tbQuestion => {
            if (tbQuestion.code === '04') tbQuestion.completed = String(this.selectedTbTracing.cough)
            if (tbQuestion.code === '05') tbQuestion.completed = String(this.selectedTbTracing.fever)
            if (tbQuestion.code === '06') tbQuestion.completed = String(this.selectedTbTracing.losingWeight)
            if (tbQuestion.code === '07') tbQuestion.completed = String(this.selectedTbTracing.sweating)
            if (tbQuestion.code === '08') tbQuestion.completed = String(this.selectedTbTracing.fatigueOrTirednessLastTwoWeeks)
            if (tbQuestion.code === '09') tbQuestion.completed = String(this.selectedTbTracing.parentTBTreatment)
          })
           this.tbScreening = Object.assign({}, this.selectedTbTracing)
           this.$emit('tbScreening', this.tbScreening)
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
