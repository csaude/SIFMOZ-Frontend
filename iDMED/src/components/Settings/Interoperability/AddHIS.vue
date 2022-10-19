<template>
    <q-card style="width: 900px; max-width: 90vw;">
        <q-card-section class="q-pa-none bg-green-2">
                <div class="q-pa-md">
                    <div class="row items-center">
                        <q-icon name="online_prediction" size="sm"/>
                        <span class="q-pl-sm text-subtitle2">Sistema para Interoperabilidade</span>
                    </div>
                </div>
                <q-separator color="grey-13" size="1px"/>
            </q-card-section>
    <form @submit.prevent="validateHis" >
      <q-scroll-area style="height: 600px;">
        <q-stepper
            v-model="step"
            ref="stepper"
            animated
        >
          <q-step
            :name="1"
            title="Selecção de Atributos"
            >
            <div class="row q-mt-md">
            <nameInput
                ref="nome"
                v-model="his.description"
                label="Nome do Sistema de Informação *" />
            </div>
            <div class="row q-mt-md">
              <codeInput
                  ref="code"
                  v-model="his.abbreviation"
                  :rules="[val => codeRules (val)]"
                  lazy-rules
                  label="Abreviatura *" />
            </div>
            <div class="row q-mt-md">
                <q-table
                class="col my-sticky-header-table"
                title="Atributos"
                :rows="interoperabilityAttributes"
                :columns="columnsAttributes"
                row-key="code"
                selection="multiple"
                v-model:selected="selectedAttributes"
                  >
                    <template v-slot:no-data="{ icon, filter }">
                          <div class="full-width row flex-center text-primary q-gutter-sm text-body2">
                            <span>
                              Sem resultados para visualizar
                            </span>
                            <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
                          </div>
                        </template>
                </q-table>
            </div>
          </q-step>
          <q-step
              :name="2"
              title="Adicionar valor do atributo"
            >
              <div class="">
                        <selectedAttributesTable  :rows="healthInformationAttributeTypes" :columns="columnsSelectedAttributes"/>
              </div>
          </q-step>
        </q-stepper>
        <q-scroll-observer @scroll="scrollHandler" />
      </q-scroll-area>
      <q-card-actions align="right" class="q-mb-md">
        <q-stepper-navigation >
          <q-btn label="Cancelar" color="red" @click="$emit('close')" />
          <q-btn v-if="step > 1" color="primary" @click="$refs.stepper.previous()" label="Voltar" class="q-ml-sm" />
          <q-btn @click="goToNextStep" color="primary" :label="step === 2 ? 'Submeter' : 'Proximo'" class="q-ml-sm"/>
        </q-stepper-navigation>
      </q-card-actions>
      <q-dialog v-model="alert.visible">
        <Dialog :type="alert.type" @closeDialog="closeDialog">
          <template v-slot:title> Informação</template>
          <template v-slot:msg> {{alert.msg}} </template>
        </Dialog>
      </q-dialog>
    </form>
  </q-card>
</template>

<script>
import { ref } from 'vue'
import HealthInformationSystem from '../../../store/models/healthInformationSystem/HealthInformationSystem'
import InteroperabilityAttribute from '../../../store/models/interoperabilityAttribute/InteroperabilityAttribute'
import InteroperabilityType from '../../../store/models/interoperabilityType/InteroperabilityType'

const columnsAttributes = [
  { name: 'name', required: true, label: 'Nome', align: 'left', field: row => row.description, format: val => `${val}`, sortable: true }
]

const columnsSelectedAttributes = [
  { name: 'interoperabilityType', required: true, label: 'Nome', align: 'left', field: row => row.interoperabilityType.description, format: val => `${val}`, sortable: true },
  { name: 'value', required: true, label: 'Valor', align: 'left', field: row => row.value, format: val => `${val}`, sortable: true }
]

export default {
      props: ['selectedHis', 'createMode', 'editMode'],
    data () {
        return {
            databaseCodes: [],
           his: new HealthInformationSystem(),
           codes: [],
           step: ref(1),
           columnsAttributes,
           columnsSelectedAttributes,
            healthInformationAttributeTypes: [],
           interoperabilityAttribute: [],
           selectedAttributes: [],
             alert: ref({
              type: '',
              visible: false,
              msg: ''
            })
        }
    },
    created () {
        if (this.selectedHis !== '') {
          this.his = Object.assign({}, this.selectedHis)
          if (this.selectedHis != null) {
               this.selectedHis.interoperabilityAttributes.forEach(attribute => {
            this.selectedAttributes.push(attribute.interoperabilityType)
            this.healthInformationAttributeTypes.push(attribute)
          })
         // this.healthInformationAttributeTypes.push(this.selectedHis.interoperabilityAttributes)
          }
         // this.selectedAttributes = this.selectedHis.interoperabilityAttributes
        }
    },
      mounted () {
          this.fetchInteroperabilityAttributes()
       // this.extractDatabaseCodes()
    },
    computed: {
        interoperabilityAttributes () {
           return InteroperabilityType.all()
      }
    },
    methods: {
    validateHis () {
            this.$refs.nome.$refs.ref.validate()
             this.$refs.code.$refs.ref.validate()
                if (this.selectedAttributes.length <= 0) {
           this.displayAlert('error', 'Por Favor seleccione pelo menos um atributo para a Interoperabilidade')
                } else if (!this.$refs.nome.$refs.ref.hasError && !this.$refs.code.$refs.ref.hasError) {
                this.submitHis()
            }
        },
        submitHis () {
            console.log(this.his)
           // this.his.interoperabilityAttributes = this.healthInformationAttributeTypes
          this.his.interoperabilityAttributes = []
         //  this.his.interoperabilityAttributes.push(this.healthInformationAttributeTypes)
          this.healthInformationAttributeTypes.forEach(attribute => {
            this.his.interoperabilityAttributes.push(attribute)
          })

           this.his.active = true
            HealthInformationSystem.apiSave(this.his).then(resp => {
                // console.log(resp.response.data)
             this.displayAlert('info', 'Sistema De Informação de Saúde gravado com sucesso.')
             HealthInformationSystem.apiFetchById(resp.response.data.id)
            }).catch(error => {
                this.displayAlert('error', error)
            })
        },
        goToNextStep () {
          let i = 0
          if (this.step === 1) {
            this.$refs.nome.$refs.ref.validate()
             this.$refs.code.$refs.ref.validate()
                if (this.selectedAttributes.length <= 0) {
           this.displayAlert('error', 'Por Favor seleccione pelo menos um atributo para a Interoperabilidade')
                } else if (!this.$refs.nome.$refs.ref.hasError && !this.$refs.code.$refs.ref.hasError) {
                  if (this.createMode) {
                this.addAttributesOnHealthInformationSystem()
                  } else if (this.editMode) {
                   // const attribute = this.selectedAttributes.filter(x => x.code === 'THERAPEUTICAL_REGIMEN')
                     this.his.interoperabilityAttributes.forEach(healthInformationAttributeType => {
                        i++
                      if (!this.selectedAttributes.find(x => x.code === healthInformationAttributeType.interoperabilityType.code)) {
                        const i = this.healthInformationAttributeTypes.map(toRemove => toRemove.id).indexOf(healthInformationAttributeType.id)
                          this.healthInformationAttributeTypes.splice(i, 1)
                       }
                       })
                       console.log(i)
                      this.addAttributesOnHealthInformationSystem()
                  }
          this.$refs.stepper.next()
            }
          // console.log(this.healthInformationAttributeTypes)
        } else {
          this.submitHis()
             }
        },
    extractDatabaseCodes () {
        this.codes.forEach(element => {
            this.databaseCodes.push(element.code)
    })
    },
    displayAlert (type, msg) {
          this.alert.type = type
          this.alert.msg = msg
          this.alert.visible = true
        },
        closeDialog () {
          if (this.alert.type === 'info') {
            this.$emit('close')
          }
        },
    fetchInteroperabilityAttributes () {
      const offset = 0
      const max = 100
      InteroperabilityType.apiGetAll(offset, max)
    },
      codeRules (val) {
      if (this.his.code === '') {
        return 'o Código e obrigatório'
      } else if (!this.his.id && this.selectedHis.id === this.his.id) {
      return !this.databaseCodes.includes(val) || 'o Código indicado ja existe'
         }
    },
    addAttributesOnHealthInformationSystem () {
        this.selectedAttributes.forEach(attribute => {
               if (!this.healthInformationAttributeTypes.find(x => x.interoperabilityType.code === attribute.code)) {
             this.interoperabilityAttribute = new InteroperabilityAttribute()
            this.interoperabilityAttribute.interoperabilityType = attribute
            this.healthInformationAttributeTypes.push(this.interoperabilityAttribute)
               }
          })
    }
    },
    components: {
        nameInput: require('components/Shared/NameInput.vue').default,
        codeInput: require('components/Shared/CodeInput.vue').default,
        selectedAttributesTable: require('components/Settings/Interoperability/HealthInformationSystemAttributeTable.vue').default,
        Dialog: require('components/Shared/Dialog/Dialog.vue').default
    }

}
</script>
<style lang="sass">
.my-sticky-header-table
  /* height or max-height is important */

  .q-table__top
    /* bg color is important for th; just specify one */
    background-color: #0ba58b

  thead tr th
    position: sticky
    z-index: 0
  thead tr
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 0px
</style>
