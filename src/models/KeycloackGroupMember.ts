export interface KeycloakGroupMember {
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
