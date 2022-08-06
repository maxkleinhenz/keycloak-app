import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';
import { kc } from 'boot/keycloak';
import { useKeyCloakStore } from 'src/stores/keycloak-store';

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
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(
      process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE
    ),
  });

  Router.beforeEach((to, from, next) => {
    const keycloakStore = useKeyCloakStore();
    if (to.meta.requiresAuth) {
      // Get the actual url of the app, it's needed for Keycloak
      if (!kc.authenticated) {
        // The page is protected and the user is not authenticated. Force a login.
        keycloakStore.login();
      } else if (kc.hasRealmRole('app-role')) {
        // The user was authenticated, and has the app role
        kc.updateToken(70)
          .then(() => {
            next();
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        kc.userInfo;
        // The user was authenticated, but did not have the correct role
        // Redirect to an error page
        next({ name: 'Unauthorized' });
      }
    } else {
      // This page did not require authentication
      next();
    }
  });

  return Router;
});
