<template>

     <div class="row q-mb-md">
             <q-input
              class="col q-mr-md"
                dense
                outlined
                v-model.number="model"
                :value="year"
                type="number"
                style="max-width: 200px"
                :rules="[ val => ( val != null) || ' Por favor indique o ano']"
                label="Ano"
            />
       </div>
  </template>

<script>
    import { ref } from 'vue'
    export default {
        props: ['year'],
        setup () {
            return {
            model: ref(new Date().getFullYear())
            }
        },
        data () {
                return {
                    semestres: [
                        { id: 1, description: 'Semestre 1' },
                        { id: 2, description: 'Semestre 2' }
                        ]
                        }
            }
            }
</script>
