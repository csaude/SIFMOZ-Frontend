import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE)
  })

   Router.beforeEach((to, from, next) => {
     const authUser = localStorage.getItem('user')
    console.log('beforeEach', to.path + ' - Auth: ' + authUser)

    //  if(!to.meta.requiresAuth && !authUser) {
    // next({ name: 'Login' })
    //  next()
    //  }

     if (authUser === null || String(authUser).includes('null')) {
        next()
        console.log('eeeennnttrrraaaa')
     } else {
       next()
     }
    // if (findOne(to.meta.roles,authUser.auth.isAuthenticated.roles)) {
    //   console.log(' yes >'+to.meta.roles+ " <> "+authUser.auth.isAuthenticated.roles);
    //   return next()
    // } else {
    //   console.log('NO'+to.meta.roles.includes(authUser.auth.isAuthenticated.roles)+' '+to.meta.roles+' >> '+authUser.auth.isAuthenticated.roles)
    //   return next({name:'Home'})
    // }

    // console.log('beforeEach', to.path + ' - Auth: ' + authUser)
  //   if (authUser === null) {
  //     next({ path: '/Login' })
  //   } else if ((to.path === '/Login' || to.path === 'Login') && authUser !== null) {
  //       next({ path: '/Login' })
  //     }
  //     next({ path: '/Login' })
   })

  return Router
})
