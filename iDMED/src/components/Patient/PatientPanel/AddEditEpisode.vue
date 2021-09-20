<template>
  <q-card style="width: 900px; max-width: 90vw;">
        <form @submit.prevent="submitMobilizer" >
            <q-card-section >
              <div class="row items-center text-subtitle1">
                <q-icon  :name="patient.gender == 'Femenino' ? 'female' : 'male'" size="md" color="primary"/>
                <div class="text-bold text-grey-10 q-ml-sm">{{patient.firstNames}}</div>
                <div class="text-grey-10 q-ml-sm"><span class="text-bold text-h6">|</span> {{patient.gender}}</div>
                <div class="text-grey-10 q-ml-sm"><span class="text-bold text-h6">|</span> {{age}} Anos</div>
              </div>
              <q-separator/>
            </q-card-section>
            <div class="text-center text-h6">
              <span v-if="episodeToEdit.id > 0">Actualizar</span>
              <span v-else>Adicionar</span>
              Episódio
            </div>
            <div class="q-mx-lg">
              <div class="q-mt-lg">
                  <div class="row items-center q-mb-sm">
                      <span class="text-subtitle2">Dados de início no serviço de Saúde</span>
                  </div>
                  <q-separator color="grey-13" size="1px" class="q-mb-sm"/>
              </div>
              <div class="row q-mt-md">
                  <q-select
                    class="col"
                    dense outlined
                    v-model="identifier.clinicalService"
                    :options="options"
                    disable
                    option-value="code"
                    option-label="description"
                    label="Serviço de Saúde" />

                  <q-input
                      dense
                      outlined
                      disable
                      class="col q-ml-md"
                      v-model="identifier.startDate"
                      mask="date"
                      ref="birthDate"
                      :rules="['date']"
                      label="Data de Admissão">
                      <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                              <q-date v-model="identifier.startDate" >
                              <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                              </div>
                              </q-date>
                          </q-popup-proxy>
                          </q-icon>
                      </template>
                  </q-input>

                  <q-select
                    disable class="col q-ml-md"
                    dense outlined
                    v-model="identifier.estado"
                    label="Notas de início" />
              </div>
              <div class="row q-mt-md">
                  <q-select
                    class="col"
                    disable
                    dense outlined
                    v-model="episode.clinicSector"
                    :options="options"
                    option-value="code"
                    option-label="description"
                    label="Sector Clinico" />
                  <q-input
                      dense
                      outlined
                      disable
                      class="col q-ml-md"
                      v-model="episode.startDate"
                      mask="date"
                      ref="birthDate"
                      :rules="['date']"
                      label="Data de Inicio">
                      <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                              <q-date v-model="episode.startDate" >
                              <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                              </div>
                              </q-date>
                          </q-popup-proxy>
                          </q-icon>
                      </template>
                  </q-input>
                  <div class="col q-ml-md"/>
              </div>
              <span v-if="episode.id > 0">
                <div class="q-mt-md">
                  <div class="row items-center q-mb-sm">
                      <span class="text-subtitle2">Dados de Fim do Episódio</span>
                  </div>
                  <q-separator color="grey-13" size="1px" class="q-mb-sm"/>
                </div>
                <div class="row">
                  <q-input
                        dense
                        outlined
                        class="col"
                        v-model="episode.stopDate"
                        mask="date"
                        :rules="['date']"
                        label="Data de Fim">
                        <template v-slot:append>
                            <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                <q-date v-model="episode.stopDate" >
                                <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                                </q-date>
                            </q-popup-proxy>
                            </q-icon>
                        </template>
                    </q-input>
                  <q-select
                      class="col q-ml-md"
                      dense outlined
                      v-model="episode.clinicSector"
                      :options="options"
                      option-value="code"
                      option-label="description"
                      label="Notas de Fim" />

                      <TextInput v-model="episode.notes" label="Outras notas de fim" dense class="col q-ml-md" />
                </div>
              </span>
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
    props: ['episodeToEdit', 'curIdentifier', 'selectedPatient'],
    data () {
        return {
            patient: {},
            identifier: {},
            episode: {},
            estados: ['Activo', 'Curado']
        }
    },
    created () {
        this.patient = Object.assign({}, this.selectedPatient)
        this.identifier = Object.assign({}, this.curIdentifier)
        this.episode = Object.assign({}, this.episodeToEdit)
    },
    components: {
      TextInput: require('components/Shared/Input/TextField.vue').default
    }
}
</script>

<style>

</style>
