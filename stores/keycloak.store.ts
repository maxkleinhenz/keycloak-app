import { defineStore } from 'pinia';
import { UserInfo } from 'types/userInfo.model';

export const useKeycloakStore = defineStore('keycloak', () => {
  const userInfo = ref<UserInfo | undefined>(undefined);

  async function getUserInfo() {
    if (userInfo.value) return userInfo.value;

    const headers = useRequestHeaders(['cookie']) as HeadersInit;
    const data = await $fetch<UserInfo>('/api/profile', { headers });
    userInfo.value = data;

    return userInfo.value;
  }

  return { userInfo, getUserInfo };
});
