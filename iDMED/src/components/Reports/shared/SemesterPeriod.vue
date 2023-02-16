<template>

     <div class="row q-mb-md">
        <q-select
            class="col q-mr-md"
            dense outlined
                transition-show="flip-up"
            transition-hide="flip-down"
            :options="semesters"
            v-model="semester"
            ref="semesterPeriod"
            option-value="id"
            option-label="description"
            :rules="[ val => ( val != null) || ' Por favor indique o Semestre']"
            lazy-rules
            label="Semestre"
             @blur="setSelectedSemester()"
             :disable="initProcessing"
            />

             <q-input
             :disable="initProcessing"
              class="col q-mr-md"
                dense
                outlined
                type="number"
                v-model="yearSemesterPeriod"
                @blur="setSelectedSemesterYear()"
            />
       </div>
  </template>

<script>
    import { ref } from 'vue'
    export default {
        props: ['initProcessing'],
        data () {
                return {
                    semester: '',
                    yearSemesterPeriod: new Date().getFullYear(),
                    model: ref(new Date().getFullYear()),
                    semesters: [
                        { id: 1, description: 'Semestre 1' },
                        { id: 2, description: 'Semestre 2' }
                        ]
                        }
            },
        methods: {
                setSelectedSemester () {
                this.$emit('setSelectedSemester', this.semester)
        },
                setSelectedSemesterYear () {
                this.$emit('setSelectedSemesterYear', this.yearSemesterPeriod)
        }
            }
            }
</script>
