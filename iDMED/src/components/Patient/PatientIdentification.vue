<template>
    <div>
        <div class="row">
            <nameInput/>
            <middleNameInput class="q-ml-md"/>
            <lastNameInput class="q-ml-md"/>
        </div>
        <div class="row">
            <div class="row col">
                <dateInput label="Data de Nascimento"/>
                <numberInput label="Idade" class="q-ml-sm"/>
            </div>
            <q-select class="col q-ml-md" dense outlined v-model="model" :options="options" label="Género" />
            <div class="row col"><q-space /></div>
        </div>
    </div>
</template>

<script>
export default {
    components: {
        nameInput: require('components/Patient/Inputs/PatientNameInput.vue').default,
        middleNameInput: require('components/Patient/Inputs/PatientMiddleNameInput.vue').default,
        dateInput: require('components/Shared/Input/DateField.vue').default,
        numberInput: require('components/Shared/Input/NumberField.vue').default,
        lastNameInput: require('components/Patient/Inputs/PatientLastNameInput.vue').default
    }
}
</script>

<style>

</style>
