export interface KeycloakGroup {
  id: string;
  name: string;
  path: string;
  subGroups: KeycloakGroup[];
}
