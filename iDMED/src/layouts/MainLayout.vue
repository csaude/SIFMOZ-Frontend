<template>
  <q-layout view="lHh Lpr lFf">
    <div >
            <q-header >
                <q-toolbar>
                    <q-avatar size="100px">
                        <img class="bg-white" src="../assets/LogoiDMED.png">
                    </q-avatar>

                    <q-toolbar-title class="text-bold text-italic" style="font-family: 'Gill Sans';font-size: 35px;">iDMED</q-toolbar-title>

                    <q-tabs
                      class="absolute-center"
                      no-caps
                      v-model="tab"
                      active-color="orange"
                      indicator-color="orange"
                      align="justify"
                      narrow-indicator>
                        <q-route-tab exact default :to="'/home'" name="home" icon="home" label="Inicial" />
                        <q-route-tab exact :to="'/patients'" name="patients" icon="person_outline" label="Pacientes/Utentes" />
                        <q-route-tab exact :to="'/groups'" name="groups" icon="groups" label="Grupos" />
                        <q-route-tab exact :to="'/stock'"  name="stock" icon="shopping_cart" label="Stock" />
                        <q-route-tab exact :to="'/dashboard'" name="dashboard" icon="dashboard" label="Dashboard" />
                        <q-route-tab exact :to="'/reports'" name="reports" icon="insert_chart_outlined" label="Relatórios" />
                        <q-route-tab exact :to="'/settings'" name="settings" icon="settings" label="Administração" />
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
                                <q-item to="/Logout" clickable>
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
import { defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'MainLayout',
  setup () {
    return {
      tab: ref('patients')
    }
  },
  components: { }
})
</script>
