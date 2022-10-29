import axios from 'axios';
import { defineStore } from 'pinia';
import { KeycloakGroupMember } from 'src/models/KeycloackGroupMember';
import { KeycloakGroup } from 'src/models/KeycloakGroup';
import { KeycloakUser } from 'src/models/KeycloakUser';
import { useKeycloak } from 'src/use/keyclock.config';

export const useKeyCloakStore = defineStore('keycloak', {
  state: () => ({
    profile: undefined as KeycloakUser | undefined,
    groups: undefined as Array<KeycloakGroup> | undefined,
    users: undefined as KeycloakUser[] | undefined,
  }),
  actions: {
    login() {
      const { keycloakInstance } = useKeycloak();
      keycloakInstance.login();
    },
    async logout(redirectUri = '/') {
      const { keycloakInstance } = useKeycloak();
      await keycloakInstance.logout({ redirectUri: redirectUri });
    },
    async loadProfile() {
      const { keycloakInstance } = useKeycloak();
      const profile = await keycloakInstance.loadUserProfile();
      this.profile = await this.getUser(profile.id as string);
    },
    getUser: async (userId: string) => {
      const { baseApiUrl } = useKeycloak();
      return await axios
        .get<KeycloakUser>(`${baseApiUrl}/users/${userId}`)
        .then((response) => {
          return response.data;
        });
    },
    async loadUserGroups(userId: string | undefined): Promise<KeycloakGroup[]> {
      const { baseApiUrl } = useKeycloak();
      return await axios
        .get<KeycloakGroup[]>(`${baseApiUrl}/users/${userId}/groups`)
        .then((response) => {
          return response.data;
        });
    },
    async loadGroup(groupId: string): Promise<KeycloakGroup> {
      const { baseApiUrl } = useKeycloak();

      return await axios
        .get<KeycloakGroup>(`${baseApiUrl}/groups/${groupId}`)
        .then((response) => {
          return response.data;
        });
    },
    async loadGroupMember(
      groupId: string
    ): Promise<KeycloakGroupMember[] | undefined> {
      if (!groupId) return undefined;

      const { baseApiUrl } = useKeycloak();
      return await axios
        .get<KeycloakGroupMember[]>(`${baseApiUrl}/groups/${groupId}/members`)
        .then((response) => {
          const members = response.data;
          return members.sort((a, b) =>
            a.firstName + a.lastName < b.firstName + b.lastName ? -1 : 1
          );
        });
    },
    async RemoveUserFromGroup(groupId: string, userId: string) {
      const { baseApiUrl } = useKeycloak();
      await axios.delete(`${baseApiUrl}/users/${userId}/groups/${groupId}`);
    },
  },
});

const flattGroups = (result: KeycloakGroup[], group: KeycloakGroup) => {
  result.push(group);
  group.subGroups.forEach((g) => {
    flattGroups(result, g);
  });
  return result;
};
