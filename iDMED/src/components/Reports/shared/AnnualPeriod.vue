<template>

     <div class="row q-mb-md">
             <q-input
              class="col q-mr-md"
                dense
                outlined
                v-model="yearAnnualPeriod"
                type="number"
                label="Ano"
                @blur="setSelectedYearAnnual()"
            />
       </div>
  </template>

<script>

    export default {
        data () {
                return {
                    yearAnnualPeriod: new Date().getFullYear(),
                    semestres: [
                        { id: 1, description: 'Semestre 1' },
                        { id: 2, description: 'Semestre 2' }
                        ]
                        }
            },
        methods: {
            setSelectedYearAnnual () {
            this.$emit('setSelectedYearAnnual', this.yearAnnualPeriod)
            }
        }
           }
</script>
