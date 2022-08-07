import axios from 'axios';
import { defineStore } from 'pinia';
import { KeycloakGroupMember } from 'src/models/KeycloackGroupMember';
import { KeycloakGroup } from 'src/models/KeycloakGroup';
import { KeycloakUser } from 'src/models/KeycloakUser';
import { KeycloakUserInfo } from 'src/models/KeycloakUserInfo';
import { useKeycloak } from 'src/use/keyclock.config';

export const useKeyCloakStore = defineStore('keycloak', {
  state: () => ({
    profile: undefined as KeycloakUserInfo | undefined,
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
      this.profile =
        (await keycloakInstance.loadUserInfo()) as KeycloakUserInfo;
    },
    async loadAllUsers(): Promise<KeycloakUser[]> {
      const { baseApiUrl } = useKeycloak();

      const users = await axios
        .get<KeycloakUser[]>(`${baseApiUrl}/users`)
        .then((response) => {
          const users = response.data;
          return users.sort((a, b) =>
            a.firstName + a.lastName < b.firstName + b.lastName ? -1 : 1
          );
        });
      this.users = users;
      return users;
    },
    async loadAllGroups(): Promise<KeycloakGroup[]> {
      const { baseApiUrl } = useKeycloak();

      const groups = await axios
        .get<KeycloakGroup[]>(`${baseApiUrl}/groups`)
        .then((response) => {
          return response.data;
        });
      this.groups = groups;
      return groups;
    },
    async loadUserGroups(userId: string | undefined): Promise<KeycloakGroup[]> {
      const { baseApiUrl } = useKeycloak();

      return await axios
        .get<KeycloakGroup[]>(`${baseApiUrl}/users/${userId}/groups`)
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
  getters: {
    getUserByUsername: (state) => {
      return (username: string | undefined): KeycloakUser | undefined => {
        if (!username) return undefined;
        return state.users?.find((user) => user.username === username);
      };
    },
    getGroupByPath: (state) => {
      return (path: string | undefined): KeycloakGroup | undefined => {
        if (!path) return undefined;
        const flattenGroups: KeycloakGroup[] = [];
        state.groups?.forEach((g) => flattGroups(flattenGroups, g));

        return flattenGroups.find((group) => {
          return group.path === path;
        });
      };
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
