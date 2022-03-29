
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter (to, from, next) {
      const authUser = localStorage.getItem('user')
      if (authUser === null || String(authUser).includes('null')) {
          next('/Login')
        } else {
          next()
        }
    },
    children: [
      { path: '', component: () => import('pages/Home/Home.vue') },
      { path: 'patients', component: () => import('pages/Patient/Patient.vue') },
      { path: 'patientpanel', component: () => import('pages/Patient/Panel/PatientPanel.vue') },
      // { path: 'groups', component: () => import('pages/Groups/Groups.vue') },
      { path: 'group/panel', component: () => import('pages/Groups/GroupPanel.vue') },
      { path: 'group/search', component: () => import('pages/Groups/SearchAddGroup.vue') },
      { path: 'stock', component: () => import('pages/Stock/Stock.vue') },
      { path: 'stock/entrance', component: () => import('pages/Stock/Entrance/EntrancePanel.vue') },
      { path: 'stock/drugFile', component: () => import('pages/Stock/DrugFile/DrugFile.vue') },
      { path: 'stock/inventory', component: () => import('pages/Stock/Inventory/InventoryPanel.vue') },
      // { path: 'dashboard', component: () => import('pages/Dashboard/Dashboard.vue') },
      // { path: 'reports', component: () => import('pages/Reports/Reports.vue') },
      // { path: 'groups', component: () => import('pages/Groups/Groups.vue') },
      // { path: 'stock', component: () => import('pages/Stock/Stock.vue') },
      // { path: 'dashboard', component: () => import('pages/Dashboard/Dashboard.vue') },
      { path: 'reports', component: () => import('pages/Reports/Reports.vue') },
      { path: 'settings', component: () => import('pages/Settings/Settings.vue') },
      { path: 'home', component: () => import('pages/Home/Home.vue') },
      { path: 'add-clinic', component: () => import('components/Settings/Clinic/AddClinic.vue') }
    ]
  },
  {
    path: '/Login',
    name: 'Login',
    component: () => import('pages/Login/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/Logout',
    component: () => import('pages/Logout/Logout'),
    meta: { requiresAuth: false }
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
