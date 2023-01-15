import axios from 'axios';
import Keycloak, { KeycloakProfile } from 'keycloak-js';
import { defineStore } from 'pinia';
import { KeycloakGroupMember } from 'src/models/KeycloackGroupMember';
import { KeycloakGroup } from 'src/models/KeycloakGroup';
import { KeycloakUser } from 'src/models/KeycloakUser';
import { KeycloakUserInfo } from 'src/models/KeycloakUserInfo';
import { keycloakConfig } from 'src/use/keycloak.config';

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
      keycloakBaseAdminApiUrl: `${keycloakConfig.url}/admin/realms/${keycloakConfig.realm}`,
      keycloakBaseAccountApiUrl: `${keycloakConfig.url}/realms/${keycloakConfig.realm}/account`,
      profile: undefined as KeycloakProfile | undefined,
      userInfo: undefined as KeycloakUserInfo | undefined,
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
        this.profile = await this.keycloakInstance.loadUserProfile();
        this.userInfo =
          (await this.keycloakInstance.loadUserInfo()) as KeycloakUserInfo;
      }
    },
    async updateProfile(signal: AbortSignal, profile: KeycloakProfile) {
      return await createAxios(this.keycloakInstance?.token ?? '').post(
        this.keycloakBaseAccountApiUrl,
        profile,
        { signal: signal }
      );
    },
    async getUser(userId: string) {
      return await createAxios(this.keycloakInstance?.token ?? '')
        .get<KeycloakUser>(`${this.keycloakBaseAdminApiUrl}/users/${userId}`)
        .then((response) => {
          return response.data;
        });
    },
    async getUsersCount(
      signal: AbortSignal,
      search?: string | undefined
    ): Promise<number> {
      const searchParam = search ? `?search=${search}` : '';
      return await createAxios(this.keycloakInstance?.token ?? '')
        .get<number>(
          `${this.keycloakBaseAdminApiUrl}/users/count${searchParam}`,
          {
            signal: signal,
          }
        )
        .then((response) => {
          return response.data;
        });
    },
    async getUsers(
      signal: AbortSignal,
      offset: number,
      max: number,
      search?: string | undefined
    ): Promise<KeycloakUser[]> {
      const searchParam = search ? `&search=${search}` : '';
      return await createAxios(this.keycloakInstance?.token ?? '')
        .get<KeycloakUser[]>(
          `${this.keycloakBaseAdminApiUrl}/users/?first=${offset}&max=${max}${searchParam}`,
          {
            signal: signal,
          }
        )
        .then((response) => {
          return response.data;
        });
    },
    async updateUser(userId: string, user: KeycloakProfile) {
      return await createAxios(this.keycloakInstance?.token ?? '')
        .put(`${this.keycloakBaseAdminApiUrl}/users/${userId}`, user)
        .then((response) => {
          const newUser = JSON.parse(response.config.data) as KeycloakUser;
          return newUser;
        });
    },
    async loadUserGroups(userId: string | undefined): Promise<KeycloakGroup[]> {
      return await createAxios(this.keycloakInstance?.token ?? '')
        .get<KeycloakGroup[]>(
          `${this.keycloakBaseAdminApiUrl}/users/${userId}/groups`
        )
        .then((response) => {
          return response.data;
        });
    },
    async loadGroup(groupId: string): Promise<KeycloakGroup> {
      return await createAxios(this.keycloakInstance?.token ?? '')
        .get<KeycloakGroup>(`${this.keycloakBaseAdminApiUrl}/groups/${groupId}`)
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
          `${this.keycloakBaseAdminApiUrl}/groups/${groupId}/members`
        )
        .then((response) => {
          const members = response.data;
          return members.sort((a, b) =>
            a.firstName + a.lastName < b.firstName + b.lastName ? -1 : 1
          );
        });
    },
    async addUserToGroup(userId: string, groupId: string | undefined) {
      if (!groupId) return;

      await createAxios(this.keycloakInstance?.token ?? '').put(
        `${this.keycloakBaseAdminApiUrl}/users/${userId}/groups/${groupId}`
      );
    },
    async removeUserFromGroup(userId: string, groupId: string | undefined) {
      if (!groupId) return;

      await createAxios(this.keycloakInstance?.token ?? '').delete(
        `${this.keycloakBaseAdminApiUrl}/users/${userId}/groups/${groupId}`
      );
    },
  },
  getters: {
    isAuthenticated(): boolean {
      return this.keycloakInstance?.authenticated ?? false;
    },
  },
});
