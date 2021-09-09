<template>
    <div>
        <div class="row">
            <q-input outlined v-model="firstNames" label="Outlined" />
        </div>
        <pre>{{firstNames}}</pre>
    </div>
</template>

<script>
import { ref } from 'vue'
export default {
    props: ['patient'],
    setup () {
        return {
            currPatient: {},
            firstNames: ref('')
        }
    },
    methods: {
        updateName (event) {
            console.log(event)
        }
    },
    components: {
    },
    created () {
        this.currPatient = Object.assign({}, this.patient)
    }
}
</script>

<style>

</style>
