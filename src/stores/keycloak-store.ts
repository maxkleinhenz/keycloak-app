import axios from 'axios';
import Keycloak from 'keycloak-js';
import { defineStore } from 'pinia';
import { KeycloakGroupMember } from 'src/models/KeycloackGroupMember';
import { KeycloakGroup } from 'src/models/KeycloakGroup';
import { KeycloakUser } from 'src/models/KeycloakUser';
import { keyclockConfig } from 'src/use/keyclock.config';

const createAxios = (token: string) => {
  return axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

let tokenInterval: NodeJS.Timeout | undefined;
export const startTokenRefreshInterval = (
  keycloakInstance: Keycloak | undefined
) => {
  clearInterval(tokenInterval);

  tokenInterval = setInterval(async () => {
    await keycloakInstance?.updateToken(70).then((refreshed) => {
      if (!refreshed) {
        console.log(
          `Token not refreshed, valid for ${Math.round(
            (keycloakInstance?.tokenParsed?.exp ?? 0) +
              (keycloakInstance?.timeSkew ?? 0) -
              new Date().getTime() / 1000
          )} seconds`
        );
      }
    });
  }, 6000);
};

export const useKeyCloakStore = defineStore('keycloak', {
  state: () => {
    return {
      keycloakInstance: undefined as undefined | Keycloak,
      keycloakBaseApiUrl: `${keyclockConfig.url}/admin/realms/${keyclockConfig.realm}`,
      profile: undefined as KeycloakUser | undefined,
      groups: undefined as Array<KeycloakGroup> | undefined,
      users: undefined as KeycloakUser[] | undefined,
    };
  },
  actions: {
    async loginKeycloak(absoluteUrl?: string) {
      if (this.keycloakInstance) {
        await this.keycloakInstance
          .login({ redirectUri: absoluteUrl })
          .then(() => {
            startTokenRefreshInterval(this.keycloakInstance);
          });
      }
    },
    async logout(redirectUri = '/') {
      this.keycloakInstance?.logout({ redirectUri: redirectUri });
    },
    async loadProfile() {
      if (this.keycloakInstance) {
        const profile = await this.keycloakInstance.loadUserProfile();
        this.profile = await this.getUser(profile.id as string);
      }
    },
    async getUser(userId: string) {
      return await createAxios(this.keycloakInstance?.token ?? '')
        .get<KeycloakUser>(`${this.keycloakBaseApiUrl}/users/${userId}`)
        .then((response) => {
          return response.data;
        });
    },
    async updateUser(userId: string, user: KeycloakUser) {
      return await createAxios(this.keycloakInstance?.token ?? '')
        .put(`${this.keycloakBaseApiUrl}/users/${userId}`, user)
        .then((response) => {
          const newUser = JSON.parse(response.config.data) as KeycloakUser;
          return newUser;
        });
    },
    async loadUserGroups(userId: string | undefined): Promise<KeycloakGroup[]> {
      return await createAxios(this.keycloakInstance?.token ?? '')
        .get<KeycloakGroup[]>(
          `${this.keycloakBaseApiUrl}/users/${userId}/groups`
        )
        .then((response) => {
          return response.data;
        });
    },
    async loadGroup(groupId: string): Promise<KeycloakGroup> {
      return await createAxios(this.keycloakInstance?.token ?? '')
        .get<KeycloakGroup>(`${this.keycloakBaseApiUrl}/groups/${groupId}`)
        .then((response) => {
          return response.data;
        });
    },
    async loadGroupMember(
      groupId: string
    ): Promise<KeycloakGroupMember[] | undefined> {
      if (!groupId) return undefined;

      return await createAxios(this.keycloakInstance?.token ?? '')
        .get<KeycloakGroupMember[]>(
          `${this.keycloakBaseApiUrl}/groups/${groupId}/members`
        )
        .then((response) => {
          const members = response.data;
          return members.sort((a, b) =>
            a.firstName + a.lastName < b.firstName + b.lastName ? -1 : 1
          );
        });
    },
    async RemoveUserFromGroup(groupId: string, userId: string) {
      await createAxios(this.keycloakInstance?.token ?? '').delete(
        `${this.keycloakBaseApiUrl}/users/${userId}/groups/${groupId}`
      );
    },
  },
  getters: {
    isAuthenticated(): boolean {
      return this.keycloakInstance?.authenticated ?? false;
    },
  },
});
