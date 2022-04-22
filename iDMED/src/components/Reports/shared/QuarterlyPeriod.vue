<template>

     <div class="row q-mb-md">
        <q-select
            class="col q-mr-md"
            dense outlined
                transition-show="flip-up"
            transition-hide="flip-down"
            :options="quarters"
             v-model="quarter"
            ref="quarterlyPeriod"
            option-value="id"
            option-label="description"
            :rules="[ val => ( val != null) || ' Por favor indique o Trimestre']"
            lazy-rules
            label="Trimestre"
            @blur="setSelectedQuarter()"
            />

             <q-input
              class="col q-mr-md"
                dense
                outlined
                type="number"
                style="max-width: 120px"
                :rules="[ val => ( val != null) || ' Por favor indique o ano']"
                v-model="yearQuarterlyPeriod"
                @blur="setSelectedYearQuarter()"
            />
       </div>
  </template>

<script>
    import { ref } from 'vue'
    export default {
        data () {
                return {
                    quarter: '',
                    yearQuarterlyPeriod: '',
                    model: ref(new Date().getFullYear()),
                    quarters: [
                        { id: 1, description: 'Trimestre 1' },
                        { id: 2, description: 'Trimestre 2' },
                        { id: 3, description: 'Trimestre 3' }
                        ]
                        }
            },
        methods: {
                setSelectedQuarter () {
                     this.$emit('setSelectedQuarter', this.quarter)
                 },
                setSelectedYearQuarter () {
                    this.$emit('setSelectedYearQuarter', this.yearQuarterlyPeriod)
                 }
            }
            }
</script>
