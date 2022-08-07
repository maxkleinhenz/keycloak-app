import { KeycloakInstance } from '@dsb-norge/vue-keycloak-js/dist/types';

export const useKeycloak = () => {
  return {
    keycloakInstance,
    baseUrl,
    realm,
    clientId,
    baseApiUrl,
    setKeycloakInstance,
  };
};

let keycloakInstance: KeycloakInstance;
const setKeycloakInstance = (instance: KeycloakInstance) =>
  (keycloakInstance = instance);

const baseUrl = 'https://keycloak.jusos.rocks';
const realm = 'master';
const clientId = 'vue-app';

const baseApiUrl = `${baseUrl}/admin/realms/${realm}`;
