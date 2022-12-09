import { KeycloakConfig } from 'keycloak-js';

export const keyclockConfig: KeycloakConfig = {
  url: 'https://login.rote.tools',
  realm: 'user',
  clientId: 'group-manager',
};
