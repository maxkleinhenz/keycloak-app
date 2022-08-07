import VueKeyCloak from '@dsb-norge/vue-keycloak-js';
import {
  KeycloakInstance,
  VueKeycloakInstance,
} from '@dsb-norge/vue-keycloak-js/dist/types';
import axios, { AxiosRequestConfig } from 'axios';
import { boot } from 'quasar/wrappers';

export let kc: KeycloakInstance;

export default boot(async ({ app }) => {
  function registerTokenInterceptor() {
    axios.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/restrict-template-expressions
        config.headers[
          'Authorization'
        ] = `Bearer ${app.config.globalProperties.$keycloak.token}`;

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    ); //null, { synchronous: true })
  }

  return new Promise((resolve) => {
    app.use(VueKeyCloak, {
      init: {
        onLoad: 'check-sso', // or 'login-required'
        flow: 'standard',
        pkceMethod: 'S256',
        silentCheckSsoRedirectUri:
          window.location.origin +
          window.location.pathname +
          '/silent-check-sso.html',
        checkLoginIframe: true,
      },
      config: {
        url: 'https://keycloak.jusos.rocks/',
        realm: 'master',
        clientId: 'vue-app',
      },
      onReady: (keycloak: KeycloakInstance) => {
        registerTokenInterceptor();
        resolve();
        kc = keycloak;
      },
    });
  });
});

// Allow usage of this.$keycloak in components
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $keycloak: VueKeycloakInstance;
  }
}
