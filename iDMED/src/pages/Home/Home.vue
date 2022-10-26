<template>
 <q-page class="flex flex-center">
  <div class="">
   <div class="row q-pa-xl q-gutter-xl">
    <div class="col" v-if="menusVisible('Pacientes')">
    <router-link :to="`/patients`">
        <q-btn round >
          <q-avatar size="190px" >
            <img src="~assets/patientsButton.png">
          </q-avatar>
          <q-tooltip content-class="bg-pink-4 text-white shadow-4"
                          :offset="[10, 10]"
                          transition-show="rotate"
                          transition-hide="rotate">
                 Pacientes/Utentes
                </q-tooltip>
        </q-btn>
     </router-link>
    </div>
    <div class="col" v-if="menusVisible('Grupos')">
    <router-link :to="`/group/search`">
        <q-btn round>
          <q-avatar size="190px">
            <img src="~assets/groupsButton.png">
          </q-avatar>
           <q-tooltip content-class="bg-blue text-white shadow-4"
                          :offset="[10, 10]"
                          transition-show="rotate"
                          transition-hide="rotate">
                  Grupos
                </q-tooltip>
        </q-btn>
     </router-link>
    </div>
    <div class="col" v-if="menusVisible('Stock')">
    <router-link :to="`/stock`">
        <q-btn round>
          <q-avatar size="190px">
            <img src="~assets/stockButton.png">
          </q-avatar>
           <q-tooltip content-class="bg-blue text-white shadow-4"
                          :offset="[10, 10]"
                          transition-show="rotate"
                          transition-hide="rotate">
                  Stock
                </q-tooltip>
        </q-btn>
     </router-link>
    </div>
   </div>
   <div class="row ">
   <div class="col col-sm-3"/>
   <div class="col" v-if="menusVisible('Dashboard')">
     <router-link :to="`/dashboard`">
        <q-btn round>
          <q-avatar size="190px">
            <img src="~assets/dashboardButton.png">
          </q-avatar>
          <q-tooltip content-class="text-white shadow-4"
                          :offset="[10, 10]"
                          transition-show="rotate"
                          transition-hide="rotate">
                  Dashboard
                </q-tooltip>
        </q-btn>
     </router-link>
   </div>
   <div class="col" v-if="menusVisible('Relatorios')">
     <router-link :to="`/reports`">
        <q-btn round>
          <q-avatar size="190px">
            <img src="~assets/reportsButton.png">
          </q-avatar>
          <q-tooltip content-class="text-white shadow-4"
                          :offset="[10, 10]"
                          transition-show="rotate"
                          transition-hide="rotate">
                  Relatórios
                </q-tooltip>
        </q-btn>
     </router-link>
   </div>
   <div class="col-2" v-if="menusVisible('Administração')">
      <router-link :to="`/settings`">
        <q-btn round>
          <q-avatar size="190px">
            <img src="~assets/settingsButton.png">
          </q-avatar>
          <q-tooltip content-class="bg-blue text-white shadow-4"
                          :offset="[10, 10]"
                          transition-show="rotate"
                          transition-hide="rotate">
                  Administração
                </q-tooltip>
        </q-btn>
     </router-link>
   </div>
   </div>
  </div>
  </q-page>
</template>

<script>
import { SessionStorage, QSpinnerBall, useQuasar } from 'quasar'
import Clinic from '../../store/models/clinic/Clinic'
import mixinplatform from 'src/mixins/mixin-system-platform'
import mixinutils from 'src/mixins/mixin-utils'
import SynchronizationService from 'src/services/Synchronization/SynchronizationService'
export default {
   mixins: [mixinplatform, mixinutils],
  data () {
    return {
       $q: useQuasar()
    }
  },
    components: {
    },
    methods: {
       menusVisible (name) {
        const menus = localStorage.getItem('role_menus')
        if (!menus.includes(name)) {
               return false
        } else {
          return true
        }
      },
      showloading () {
       this.$q.loading.show({
          spinner: QSpinnerBall,
          spinnerColor: 'gray',
          spinnerSize: 140,
          message: 'Carregando, aguarde por favor...',
          messageColor: 'white'
        })
      },
      hideLoading () {
        this.$q.loading.hide()
      }
    },
    mounted () {
     setTimeout(() => {
       if (this.mobile) {
         if (!this.isAppSyncDone) {
          SynchronizationService.loadAndSaveAppParameters(this.$q)
          SynchronizationService.doPatientGet(this.clinic.id, 0, 100)
          SynchronizationService.doStockEntranceGet(this.clinic.id, 0, 100)
         } else {
           this.hideLoading()
         }
       } else {
         SynchronizationService.loadAndSaveAppParameters(this.$q)
       }
     }, 3000)
    },
    created () {
      this.showloading()
    },
    computed: {
      clinic () {
        return Clinic.query()
                   .with('province')
                   .with('facilityType')
                   .with('district.province')
                   .where('id', SessionStorage.getItem('currClinic').id)
                   .first()
      }
    }
}
</script>

<style>

</style>
