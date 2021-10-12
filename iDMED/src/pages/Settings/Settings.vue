<template>
  <div>
    <q-splitter
      v-model="splitterModel"
    >

      <template v-slot:before>
        <q-tabs
          v-model="tab"
          vertical
          class="text-teal"
        >
        <q-tab name="national_clinic" icon="local_convenience_store" label="Clinicas Nacionais" />
          <q-tab name="clinic" icon="local_hospital" label="Clinicas" />
           <q-tab name="clinic_sector" icon="local_pharmacy" label="Sector Clinico" />
          <q-tab name="drugs" icon="medication" label="Medicamentos" />
          <q-tab name="drug_regiment" icon="healing" label="Regime Terapeutico" />
          <q-tab name="doctor" icon="psychology" label="Clinicos" />
          <q-tab name="users" icon="group_add" label="Utilizadores" />
        </q-tabs>
      </template>

      <template v-slot:after>
        <q-tab-panels
          v-model="tab"
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
        </q-tab-panels>
      </template>

    </q-splitter>
  </div>
</template>
<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      tab: ref('mails'),
      splitterModel: ref(10)
    }
  },
   components: {
        doctor: require('components/Settings/Doctor/Doctors.vue').default,
     //    AddClinic: require('components/Settings/AddClinic.vue').default
      //    AddDrug: require('components/Settings/AddDrug.vue').default
       //  AddClinicSector: require('components/Settings/AddClinicSector.vue').default
           nationalClinic: require('components/Settings/NationalClinic/NationalClinics.vue').default,
      clinics: require('components/Settings/Clinic/Clinics.vue').default
    }
}
</script>
<style>

</style>
