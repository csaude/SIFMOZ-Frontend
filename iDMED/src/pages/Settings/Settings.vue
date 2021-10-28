<template>
  <div>
    <q-splitter
      v-model="splitterModel"
    >

      <template v-slot:before>
       <q-tabs
          v-model="selectedTab"
         vertical
         class="text-teal"
        >
          <q-tab v-for="tab in tabs" :key="tab.name" v-bind="tab" />
        </q-tabs>
      </template>

      <template v-slot:after>
        <q-tab-panels
          v-model="selectedTab"
          animated
          swipeable
          vertical
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel name="clinic">
            <div class="text-h4 q-mb-md"></div>
            <clinics> </clinics>
          </q-tab-panel>

          <q-tab-panel name="national_clinic">
            <div class="text-h4 q-mb-md"></div>
            <nationalClinic> </nationalClinic>
          </q-tab-panel>

          <q-tab-panel name="doctor">
            <div class="text-h4 q-mb-md"></div>
             <doctor> </doctor>
          </q-tab-panel>
            <q-tab-panel name="drugs">
            <div class="text-h4 q-mb-md"></div>
             <drug> </drug>
          </q-tab-panel>
              <q-tab-panel name="clinical_service">
            <div class="text-h4 q-mb-md"></div>
             <clinicalServices> </clinicalServices>
          </q-tab-panel>
             <q-tab-panel name="therapeutic_regimen">
            <div class="text-h4 q-mb-md"></div>
             <therapeuticRegimen> </therapeuticRegimen>
          </q-tab-panel>
          <q-tab-panel name="interoperability">
            <div class="text-h4 q-mb-md"></div>
             <interoperability> </interoperability>
          </q-tab-panel>
        </q-tab-panels>
      </template>

    </q-splitter>
  </div>
</template>
<script>
import { ref } from 'vue'

const tabs = [
  { name: 'national_clinic', icon: 'local_convenience_store', label: 'Clinicas Nacionais' },
  { name: 'clinic', icon: 'local_hospital', label: 'Clinicas' },
  { name: 'clinic_sector', icon: 'local_pharmacy', label: 'Sector Clinico' },
  { name: 'clinical_service', icon: 'local_pharmacy', label: 'Servico Clinico' },
  { name: 'doctor', icon: 'psychology', label: 'Clinicos' },
 { name: 'drugs', icon: 'medication', label: 'Medicamentos' },
  { name: 'therapeutic_regimen', icon: 'healing', label: 'Regime Terapeutico' },
  { name: 'interoperability', icon: 'online_prediction', label: 'Interoperabilidade' },
  { name: 'users', icon: 'group_add', label: 'Utilizadores' }
]
export default {
  setup () {
    return {
    //  tabs: ref('national_clinic'),
      selectedTab: ref('national_clinic'),
      tabs,
      splitterModel: ref(15)
    }
  },
   components: {
        doctor: require('components/Settings/Doctor/Doctors.vue').default,
     //    AddClinic: require('components/Settings/AddClinic.vue').default
          drug: require('components/Settings/Drug/Drugs.vue').default,
       //  AddClinicSector: require('components/Settings/AddClinicSector.vue').default
           nationalClinic: require('components/Settings/NationalClinic/NationalClinics.vue').default,
      clinics: require('components/Settings/Clinic/Clinics.vue').default,
       clinicalServices: require('components/Settings/ClinicalService/ClinicalService.vue').default,
       therapeuticRegimen: require('components/Settings/TherapeuticRegimen/TherapeuticRegimens.vue').default,
       interoperability: require('components/Settings/Interoperability/His.vue').default
    }
}
</script>
<style>

</style>
