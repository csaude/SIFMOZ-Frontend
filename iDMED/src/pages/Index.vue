<template>
  <q-page>
        <div >
            <q-header class="q-pa-sm">
                <q-toolbar>
                    <q-avatar>
                        <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
                    </q-avatar>

                    <q-toolbar-title>SiDMED</q-toolbar-title>

                    <q-tabs v-model="tab" class="absolute-center" no-caps active-bg-color="light-green-10">
                        <q-tab name="home" icon="home" label="Inicial" />
                        <q-tab name="patients" icon="person_outline" label="Pacientes/Utentes" />
                        <q-tab name="groups" icon="groups" label="Grupos" />
                        <q-tab name="stock" icon="shopping_cart" label="Stock" />
                        <q-tab name="dashboard" icon="dashboard" label="Dashboard" />
                        <q-tab name="reports" icon="insert_chart_outlined" label="Relatórios" />
                        <q-tab name="settings" icon="settings" label="Administração" />
                    </q-tabs>

                    <div class="absolute-right items-center q-mt-sm">
                        <q-btn flat icon="account_circle" label="Admin">
                            <q-menu
                            transition-show="scale"
                            transition-hide="scale"
                            >
                            <q-list style="min-width: 100px">
                                <q-item clickable>
                                    <q-item-section>Perfil</q-item-section>
                                </q-item>
                                <q-item clickable>
                                    <q-item-section>Sair</q-item-section>
                                </q-item>
                            </q-list>
                            </q-menu>
                        </q-btn>
                    </div>
                </q-toolbar>

            </q-header>
        </div>

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="home" class="q-pa-none">
            <home :clinic="currClinic"/>
          </q-tab-panel>

          <q-tab-panel name="patients" class="q-pa-none">
            <patient :clinic="currClinic"/>
          </q-tab-panel>

          <q-tab-panel name="groups" class="q-pa-none">
            <groups :clinic="currClinic"/>
          </q-tab-panel>

          <q-tab-panel name="stock" class="q-pa-none">
            <stock :clinic="currClinic"/>
          </q-tab-panel>

          <q-tab-panel name="dashboard" class="q-pa-none">
            <dashboard :clinic="currClinic"/>
          </q-tab-panel>

          <q-tab-panel name="reports" class="q-pa-none">
            <reports :clinic="currClinic"/>
          </q-tab-panel>

          <q-tab-panel name="settings" class="q-pa-none">
            <settings :clinic="currClinic"/>
          </q-tab-panel>
        </q-tab-panels>
    </q-page>
</template>

<script>
import { ref } from 'vue'
export default {
    props: ['clinic'],
  data () {
        return {
            tab: ref('patients'),
            currClinic: {}
        }
    },
    components: {
        home: require('components/Home/Home.vue').default,
        dashboard: require('components/Dashboard/Dashboard.vue').default,
        groups: require('components/Groups/Groups.vue').default,
        patient: require('components/Patient/Patient.vue').default,
        reports: require('components/Reports/Reports.vue').default,
        settings: require('components/Settings/Settings.vue').default,
        stock: require('components/Stock/Stock.vue').default
    },
    created () {
        this.currClinic = Object.assign({}, this.clinic)
    }
}
</script>
