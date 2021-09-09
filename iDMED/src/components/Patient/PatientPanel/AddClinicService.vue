<template>
  <q-card style="width: 900px; max-width: 90vw;">
        <form @submit.prevent="submitMobilizer" >
            <q-card-section >
              <div class="row items-center text-subtitle1">
                <q-icon  name="female" size="md" color="primary"/>
                <div class="text-bold text-grey-10 q-ml-sm">Nataline Ford</div>
                <div class="text-grey-10 q-ml-sm"><span class="text-bold text-h6">|</span> Femenino</div>
                <div class="text-grey-10 q-ml-sm"><span class="text-bold text-h6">|</span> 23 Anos</div>
              </div>
              <q-separator/>
            </q-card-section>
            <div class="text-center text-h6">Adicionar Serviço de Saúde</div>
            <div class="q-mx-lg">
              <div class="q-mt-lg">
                  <div class="row items-center q-mb-sm">
                      <span class="text-subtitle2">Dados do serviço de Saúde</span>
                  </div>
                  <q-separator color="grey-13" size="1px" class="q-mb-sm"/>
              </div>
              <div class="row q-mt-md">
                  <q-select class="col" dense outlined v-model="model" :options="options" label="Serviço de Saúde" />
                  <dateInput label="Data de Admissão" class="q-ml-md"/>
                  <q-select class="col q-ml-md" dense outlined v-model="model" :options="options" label="Estado" />
              </div>
              <div class="row q-mt-md">
                  <q-select class="col" dense outlined v-model="model" :options="options" label="Sector Clinico" />
                  <dateInput label="Data de Início" class="q-ml-md"/>
                  <div class="col q-ml-md"  tabindex="0"> Preferido
                      <q-radio keep-color color="primary"  val="true" label="Sim" />
                      <q-radio keep-color color="primary"  val="false" label="Nao"/>
                  </div>
              </div>

              <div class="q-mt-lg">
                  <div class="row items-center q-mb-sm">
                      <span class="text-subtitle2">Dados do Identificador</span>
                  </div>
                  <q-separator color="grey-13" size="1px" class="q-mb-sm"/>
              </div>
              <div class="row">
                  <identifierInput/>
                  <div class="col q-ml-md"  tabindex="0"> Assumir Identificador Anterior
                      <q-radio keep-color color="primary"  val="true" label="Sim" />
                      <q-radio keep-color color="primary"  val="false" label="Nao"/>
                  </div>
              </div>
            </div>
           <q-card-actions align="right" class="q-mb-md q-mr-sm">
                <q-btn label="Cancelar" color="primary" @click="$emit('close')"/>
                <q-btn type="submit" label="Submeter" color="primary" />
            </q-card-actions>
        </form>
    </q-card>
</template>

<script>
export default {
    props: ['currPatient'],
    data () {
        return {
            patient: {}
        }
    },
    created () {
        this.patient = Object.assign({}, this.currPatient)
    },
    components: {
      dateInput: require('components/Shared/Input/DateField.vue').default,
      identifierInput: require('components/Patient/Inputs/PatientIdentifierInput.vue').default
    }
}
</script>

<style>

</style>
