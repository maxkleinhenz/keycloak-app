import { KeycloakProfile } from 'keycloak-js';

export interface KeycloakUser extends KeycloakProfile {
  // access: KeycloackUserAccess;
  // disableableCredentialTypes: [];
  // notBefore: number;
  // requiredActions: [];
  // username: string;
}

export interface KeycloackUserAccess {
  manageGroupMembership: boolean;
  view: boolean;
  mapRoles: boolean;
  impersonate: boolean;
  manage: boolean;
}
