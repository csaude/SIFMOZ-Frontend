<template>
  <q-card style="width: 900px; max-width: 90vw;" class="q-pt-lg">
        <form @submit.prevent="submitMobilizer" >
            <q-card-section class="q-px-md">
                <div class="q-mt-md">
                    <div class="row">
                        <nameInput v-model="drug.name"/>
                    </div>
                    <div class="row">
                         <numberField v-model="drug.packSize" label="Tamanho do pacote"/>
                    </div>
                     <div class="row q-mt-md">
                     <numberField v-model="drug.defaultTimes" label="Numero de vezes"/>
                      <numberField v-model="drug.defaultTreatment" class="q-ml-md" label="Tratamento"/>
                          <q-checkbox v-model="drug.sideTreatment" label="Side Treatment"  class="q-ml-md" />
                     </div>
                </div>
            </q-card-section>
           <q-card-actions align="right" class="q-mb-md q-mr-sm">
                <q-btn label="Cancelar" color="red" @click="$emit('close')"/>
                <q-btn type="submit" label="Submeter" color="primary" />
            </q-card-actions>
        </form>
    </q-card>
</template>

<script>
import Drug from '../../../store/models/drug/Drug'
import { ref } from 'vue'
const stringOptions = [
  'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
]
export default {
    props: ['selectedDrug'],
    data () {
      const clinicOptions = ref(this.clinics)
        return {
            currClinic: {},
            drug: new Drug(),
            clinicOptions,
            createValue (val, done) {
              if (val.length > 2) {
                if (!stringOptions.includes(val)) {
                  done(val, 'add-unique')
                }
              }
            }
        }
    },
    methods: {
    },
    created () {
        if (this.drug !== '') {
          this.drug = Object.assign({}, this.selectedDrug)
        }
    },
    components: {
        nameInput: require('components/Shared/NameInput.vue').default,
        numberField: require('components/Shared/Input/NumberField.vue').default
    },
    mounted () {
    },
    computed: {
    }
}
</script>

<style>

</style>
