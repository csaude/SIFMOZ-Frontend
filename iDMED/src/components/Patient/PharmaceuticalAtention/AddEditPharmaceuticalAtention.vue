<template>
  <q-card style="width: 900px; max-width: 80vw;">
        <form @submit.prevent="submitMobilizer" >
            <q-card-section >
              <div class="row items-center text-subtitle1">
                <q-icon  :name="patient.gender == 'Femenino' ? 'female' : 'male'" size="md" color="primary"/>
                <div class="text-bold text-grey-10 q-ml-sm">{{patient.fullName}}</div>
                <div class="text-grey-10 q-ml-sm"><span class="text-bold text-h6">|</span> {{patient.gender}}</div>
                <div class="text-grey-10 q-ml-sm"><span class="text-bold text-h6">|</span> {{patient.age()}} Anos de Idade</div>
              </div>
              <q-separator/>
            </q-card-section>
            <div class="text-center text-h6">
              Atenção Farmacêutica
            </div>
            <div class="q-mx-lg">
              <q-stepper
                v-model="step"
                ref="stepper"
                vertical
                color="primary"
                header-nav
                animated
              >
                <q-step
                  :name="1"
                  title="Dados Vitais"
                  icon="settings"
                  :done="step > 1"
                >
                  For each ad campaign that you create, you can control how much you're willing to
                  spend on clicks and conversions, which networks and geographical locations you want
                  your ads to show on, and more.
                </q-step>

                <q-step
                  :name="2"
                  title="Rastreio de Tuberculose"
                  icon="create_new_folder"
                  :done="step > 2"
                >
                  An ad group contains one or more ads which target a shared set of keywords.
                </q-step>

                <q-step
                  :name="3"
                  title="Rastreio de Gravidez"
                  icon="add_comment"
                  :done="step > 3"
                >
                  Try out different ad text to see what brings in the most customers, and learn how to
                  enhance your ads using features like ad extensions. If you run into any problems with
                  your ads, find out how to tell if they're running and how to resolve approval issues.

                  Try out different ad text to see what brings in the most customers, and learn how to
                  enhance your ads using features like ad extensions. If you run into any problems with
                  your ads, find out how to tell if they're running and how to resolve approval issues.
                </q-step>

                <q-step
                  :name="4"
                  title="Monitoria e Reforço à Adesão"
                  icon="add_comment"
                  :done="step > 4"
                >
                  Try out different ad text to see what brings in the most customers, and learn how to
                  enhance your ads using features like ad extensions. If you run into any problems with
                  your ads, find out how to tell if they're running and how to resolve approval issues.
                </q-step>

                <q-step
                  :name="5"
                  title="Reações Adversas"
                  icon="add_comment"
                >
                  Try out different ad text to see what brings in the most customers, and learn how to
                  enhance your ads using features like ad extensions. If you run into any problems with
                  your ads, find out how to tell if they're running and how to resolve approval issues.
                </q-step>
              </q-stepper>
            </div>
           <q-card-actions align="right" class="q-mb-md q-mr-sm">
                <q-btn label="Cancelar" color="red" @click="$emit('close')"/>
                <q-btn type="submit" label="Submeter" color="primary" />
            </q-card-actions>
        </form>
    </q-card>
</template>

<script>
import { SessionStorage } from 'quasar'
import PatientVisit from '../../../store/models/patientVisit/PatientVisit'
import Patient from '../../../store/models/patient/Patient'
import { ref } from 'vue'
export default {
    props: ['currVisit'],
    data () {
        return {
            patientVisit: new PatientVisit(),
            step: ref(2)
        }
    },
    created () {
        // this.patientVisit = Object.assign({}, this.currVisit)
    },
    computed: {
      patient () {
      const selectedP = new Patient(SessionStorage.getItem('selectedPatient'))
      return Patient.query().with('identifiers.*')
                            .with('province')
                            .with('attributes')
                            .with('appointments')
                            .with('district')
                            .with('postoAdministrativo')
                            .with('bairro')
                            .with('clinic').where('id', selectedP.id).first()
      }
    },
    components: {
      // TextInput: require('components/Shared/Input/TextField.vue').default
    }
}
</script>

<style>

</style>
