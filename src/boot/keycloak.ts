import { boot } from 'quasar/wrappers';
import Keycloak from 'keycloak-js';
import { keycloakConfig } from 'src/use/keycloak.config';
import {
  startTokenRefreshInterval,
  useKeyCloakStore,
} from 'src/stores/keycloak-store';

export default boot(async () => {
  const keycloakStore = useKeyCloakStore();

  const keycloak = new Keycloak(keycloakConfig);
  keycloakStore.keycloakInstance = keycloak;

  await keycloak
    .init({
      onLoad: 'check-sso',
      flow: 'standard',
      pkceMethod: 'S256',
      silentCheckSsoRedirectUri:
        window.location.origin +
        window.location.pathname +
        '/silent-check-sso.html',
      checkLoginIframe: false,
    })
    .then(() => {
      if (keycloak.authenticated) {
        startTokenRefreshInterval(keycloak);
      }
    });
});
