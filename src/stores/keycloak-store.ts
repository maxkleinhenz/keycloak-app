import axios from 'axios';
import { defineStore } from 'pinia';
import { kc } from 'src/boot/keycloak';
import { KeycloakGroupMember } from 'src/models/KeycloackGroupMember';
import { KeycloakGroup } from 'src/models/KeycloakGroup';
import { KeycloakUser } from 'src/models/KeycloakUser';
import { KeycloakUserInfo } from 'src/models/KeycloakUserInfo';

export const useKeyCloakStore = defineStore('keycloak', {
  state: () => ({
    profile: undefined as KeycloakUserInfo | undefined,
    groups: undefined as KeycloakGroup[] | undefined,
    users: undefined as KeycloakUser[] | undefined,
  }),
  actions: {
    login() {
      kc.login();
    },
    async loadProfile() {
      this.profile = (await kc.loadUserInfo()) as KeycloakUserInfo;
    },
    async loadAllUsers(): Promise<KeycloakUser[]> {
      const users = await axios
        .get<KeycloakUser[]>(
          'https://keycloak.jusos.rocks/admin/realms/master/users'
        )
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
      const groups = await axios
        .get<KeycloakGroup[]>(
          'https://keycloak.jusos.rocks/admin/realms/master/groups'
        )
        .then((response) => {
          return response.data;
        });
      this.groups = groups;
      return groups;
    },
    async loadUserGroups(userId: string | undefined): Promise<KeycloakGroup[]> {
      return await axios
        .get<KeycloakGroup[]>(
          `https://keycloak.jusos.rocks/admin/realms/master/users/${userId}/groups`
        )
        .then((response) => {
          return response.data;
        });
    },
    async loadGroupMember(
      groupId: string
    ): Promise<KeycloakGroupMember[] | undefined> {
      if (!groupId) return undefined;

      return await axios
        .get<KeycloakGroupMember[]>(
          `https://keycloak.jusos.rocks/admin/realms/master/groups/${groupId}/members`
        )
        .then((response) => {
          const members = response.data;
          return members.sort((a, b) =>
            a.firstName + a.lastName < b.firstName + b.lastName ? -1 : 1
          );
        });
    },
    async RemoveUserFromGroup(groupId: string, userId: string) {
      await axios.delete(
        `https://keycloak.jusos.rocks/admin/realms/master/users/${userId}/groups/${groupId}`
      );
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

        return state.groups?.find((group) => group.path === path);
      };
    },
  },
});
