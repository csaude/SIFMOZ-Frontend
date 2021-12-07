<template>
  <q-card style="width: 800px; max-width: 90vw;" class="q-pt-lg">
        <form @submit.prevent="submitForm" >
            <q-card-section class="q-px-md">
                <div class="q-mt-lg">
                    <div class="row items-center q-mb-md">
                        <q-icon name="person_outline" size="sm"/>
                        <span class="q-pl-sm text-subtitle2">Dados da Guia</span>
                    </div>
                    <q-separator color="grey-13" size="1px"/>
                </div>
                <div class="q-mt-md">
                    <div class="row">
                      <q-input
                          dense
                          outlined
                          class="col q-ml-md"
                          v-model="dateReceived"
                          mask="date"
                          ref="birthDate"
                          :rules="['date']"
                          label="Data e Hora do Inventário *">
                          <template v-slot:append>
                              <q-icon name="event" class="cursor-pointer">
                              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                  <q-date v-model="dateReceived" >
                                  <div class="row items-center justify-end">
                                      <q-btn v-close-popup label="Close" color="primary" flat />
                                  </div>
                                  </q-date>
                              </q-popup-proxy>
                              </q-icon>
                          </template>
                      </q-input>
                    </div>
                </div>
                <div class="row">
                    <div class="col q-ml-md"  tabindex="0"> Tipo de Inventário:
                        <q-radio keep-color color="primary"  val="true" label="Geral" />
                        <q-radio keep-color color="primary"  val="false" label="Parcial"/>
                    </div>
                </div>
                <div class="row"></div>
            </q-card-section>
           <q-card-actions align="right" class="q-mb-md q-mr-sm">
                <q-btn label="Cancelar" color="red" @click="$emit('close')"/>
                <q-btn type="submit" label="Submeter" color="primary" />
            </q-card-actions>
        </form>
    </q-card>
</template>

<script>
export default {
  components: {
  }
}
</script>

<style>

</style>
