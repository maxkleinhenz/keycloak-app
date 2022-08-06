import axios from 'axios';
import { defineStore } from 'pinia';
import { kc } from 'src/boot/keycloak';
import { KeycloakGroupMember } from 'src/models/KeycloackGroupMember';
import { KeycloakGroup } from 'src/models/KeycloakGroup';
import { KeycloakUserInfo } from 'src/models/KeycloakUserInfo';

export const useKeyCloakStore = defineStore('keycloak', {
  state: () => ({
    profile: undefined as KeycloakUserInfo | undefined,
    groups: undefined as KeycloakGroup[] | undefined,
  }),
  actions: {
    login() {
      kc.login();
    },
    async loadProfile() {
      this.profile = (await kc.loadUserInfo()) as KeycloakUserInfo;
    },
    async loadAllGroups() {
      this.groups = await axios
        .get<KeycloakGroup[]>(
          'https://keycloak.jusos.rocks/admin/realms/master/groups'
        )
        .then((response) => {
          const groups: Array<KeycloakGroup> = [];
          response.data.forEach((g) => {
            const group: KeycloakGroup = {
              id: g.id,
              name: g.name,
              path: g.path,
              subGroups: g.subGroups,
            };
            groups.push(group);
          });
          return groups;
        });
    },
    async loadGroupMember(groupId: string) {
      return await axios
        .get<KeycloakGroupMember[]>(
          `https://keycloak.jusos.rocks/admin/realms/master/groups/${groupId}/members`
        )
        .then((response) => {
          const members: Array<KeycloakGroupMember> = [];
          response.data.forEach((m) => {
            const member: KeycloakGroupMember = {
              createdTimestamp: m.createdTimestamp,
              disableableCredentialTypes: m.disableableCredentialTypes,
              email: m.email,
              emailVerified: m.emailVerified,
              enabled: m.enabled,
              firstName: m.firstName,
              id: m.id,
              lastName: m.lastName,
              notBefore: m.notBefore,
              requiredActions: m.requiredActions,
              totp: m.totp,
              username: m.username,
            };
            members.push(member);
          });
          return members.sort((a, b) =>
            a.firstName + a.lastName < b.firstName + b.lastName ? -1 : 1
          );
        });
    },
  },
  getters: {
    getGroupByPath: (state) => {
      return (path: string) =>
        state.groups?.find((group) => group.path === path);
    },
  },
});
