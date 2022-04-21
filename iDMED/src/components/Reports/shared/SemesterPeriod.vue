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
            />

             <q-input
              class="col q-mr-md"
                dense
                outlined
                v-model.number="model"
                type="number"
                style="max-width: 120px"
                :rules="[ val => ( val != null) || ' Por favor indique o ano']"
            />
       </div>
  </template>

<script>
    import { ref } from 'vue'
    export default {
        setup () {
            return {
            model: ref(new Date().getFullYear())
            }
        },
        data () {
                return {
                    semester: null,
                    semesters: [
                        { id: 1, description: 'Semestre 1' },
                        { id: 2, description: 'Semestre 2' }
                        ]
                        }
            }
            }
</script>
