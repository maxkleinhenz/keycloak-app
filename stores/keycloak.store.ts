import { defineStore } from 'pinia';
import { Group } from 'types/groups.model';
import { UserInfo } from 'types/userInfo.model';

export const useKeycloakStore = defineStore('keycloak', () => {
  const userInfo = ref<UserInfo | undefined>(undefined);
  const userGroups = ref<Group[] | undefined>(undefined);

  const getUserInfo = () =>
    useAsyncData('userInfo', async () => {
      if (userInfo.value) return userInfo.value;

      const data = await fetchUserInfo();
      userInfo.value = data;

      return userInfo.value;
    });

  const getUserGroups = async () =>
    useAsyncData(`user:groups`, async () => {
      const userInfo = await getUserInfo();
      const userId = userInfo.data.value?.sub;

      if (!userId) {
        console.error('no user id');
        return;
      }

      if (userGroups.value) return userGroups.value;

      const data = await fetchUserGroups(userId);
      userGroups.value = data;

      return userGroups.value;
    });

  const canUserViewGroups = computed(
    () =>
      userInfo.value?.resource_access?.account?.roles?.includes(
        'view-groups'
      ) ?? false
  );

  const getHeaders = () => useRequestHeaders(['cookie']) as HeadersInit;

  const fetchUserInfo = async () => {
    const headers = getHeaders();
    const data = await $fetch<UserInfo>('/api/user', { headers });
    return data;
  };

  const fetchUserGroups = async (userId: string) => {
    const headers = getHeaders();
    const data = await $fetch<Group[]>(`/api/user/${userId}/groups`, {
      headers,
    });
    return data;
  };

  return {
    userInfo,
    userGroups,
    canUserViewGroups,
    getUserInfo,
    getUserGroups,
  };
});
