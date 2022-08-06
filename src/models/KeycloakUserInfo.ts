export interface KeycloakUserInfo {
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  groups: string[];
  name: string;
  preferred_username: string;
  sub: string;
}
