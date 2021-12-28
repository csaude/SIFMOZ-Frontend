
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Home/Home.vue') },
      { path: 'patients', component: () => import('pages/Patient/Patient.vue') },
      { path: 'patientpanel', component: () => import('pages/Patient/Panel/PatientPanel.vue') },
      { path: 'groups', component: () => import('pages/Groups/Groups.vue') },
      { path: 'stock', component: () => import('pages/Stock/Stock.vue') },
      { path: 'stock/entrance', component: () => import('pages/Stock/Entrance/EntrancePanel.vue') },
      { path: 'stock/inventory', component: () => import('pages/Stock/Inventory/InventoryPanel.vue') },
      { path: 'dashboard', component: () => import('pages/Dashboard/Dashboard.vue') },
      { path: 'reports', component: () => import('pages/Reports/Reports.vue') },
      { path: 'settings', component: () => import('pages/Settings/Settings.vue') },
      { path: 'home', component: () => import('pages/Home/Home.vue') },
      { path: 'add-clinic', component: () => import('components/Settings/Clinic/AddClinic.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
