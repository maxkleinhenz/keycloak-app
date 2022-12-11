import { KeycloakConfig } from 'keycloak-js';

export const keycloakConfig: KeycloakConfig = {
  url: 'https://login.rote.tools',
  realm: 'user',
  clientId: 'group-manager',
};
