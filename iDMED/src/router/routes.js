
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Patient.vue') },
      { path: 'patients', component: () => import('pages/Patient.vue') },
      { path: 'groups', component: () => import('pages/Groups.vue') },
      { path: 'stock', component: () => import('pages/Stock.vue') },
      { path: 'dashboard', component: () => import('pages/Dashboard.vue') },
      { path: 'reports', component: () => import('pages/Reports.vue') },
      { path: 'settings', component: () => import('pages/Settings.vue') },
      { path: 'home', component: () => import('pages/Home.vue') },
      {
        name: 'login',
        path: 'login',
        component: () => import('components/Login.vue')
      }
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
