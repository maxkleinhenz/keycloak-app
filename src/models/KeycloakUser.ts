export interface KeycloakUser {
  access: KeycloackUserAccess;
  createdTimestamp: number;
  disableableCredentialTypes: [];
  email: string;
  emailVerified: boolean;
  enabled: boolean;
  firstName: string;
  id: string;
  lastName: string;
  notBefore: number;
  requiredActions: [];
  totp: boolean;
  username: string;
}

export interface KeycloackUserAccess {
  manageGroupMembership: boolean;
  view: boolean;
  mapRoles: boolean;
  impersonate: boolean;
  manage: boolean;
}
