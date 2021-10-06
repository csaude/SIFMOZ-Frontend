<template>
  <q-layout view="lHh Lpr lFf">
    <div >
            <q-header class="q-pa-sm">
                <q-toolbar>
                    <q-avatar>
                        <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
                    </q-avatar>

                    <q-toolbar-title>SiDMED</q-toolbar-title>

                    <q-tabs class="absolute-center" no-caps active-bg-color="light-green-10">
                        <q-route-tab :to="'/home'" name="home" icon="home" label="Inicial" />
                        <q-route-tab default :to="'/patients'" name="patients" icon="person_outline" label="Pacientes/Utentes" />
                        <q-route-tab :to="'/groups'" name="groups" icon="groups" label="Grupos" />
                        <q-route-tab :to="'/stock'"  name="stock" icon="shopping_cart" label="Stock" />
                        <q-route-tab :to="'/dashboard'" name="dashboard" icon="dashboard" label="Dashboard" />
                        <q-route-tab :to="'/reports'" name="reports" icon="insert_chart_outlined" label="Relatórios" />
                        <q-route-tab :to="'/settings'" name="settings" icon="settings" label="Administração" />
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
    <q-page-container>
     <keep-alive>
      <router-view />
      </keep-alive>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'MainLayout',
  components: { }
})
</script>
