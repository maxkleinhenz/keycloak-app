import { KeycloakConfig } from 'keycloak-js';

export const keyclockConfig: KeycloakConfig = {
  url: 'https://keycloak.jusos.rocks',
  realm: 'master',
  clientId: 'vue-app',
};
