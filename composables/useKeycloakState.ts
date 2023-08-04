import { Group } from 'types/groups.model';
import { UserInfo } from 'types/userInfo.model';

const useUserInfoState = () =>
  useState<UserInfo | undefined>('userInfo', undefined);

const useUserGroupState = () =>
  useState<Group[] | undefined>('userGroups', undefined);

const hasRole = (userInfo: UserInfo | undefined, role: string) =>
  userInfo?.resource_access?.account?.roles?.includes(role) ?? false;

export const useKeycloakState = () => {
  const { fetchUserInfo, fetchUserGroups } = useKeycloakApi();

  const getUserInfo = async () => {
    const state = useUserInfoState();

    if (!state.value) {
      const { data } = await fetchUserInfo();
      state.value = data.value!;
    }

    return state;
  };

  const getUserGroup = async () => {
    const state = useUserGroupState();

    if (!state.value) {
      const user = await getUserInfo();
      const { data } = await fetchUserGroups(user.value?.sub ?? '');
      state.value = data.value!;
    }

    return state;
  };

  const canViewGroups = computed(() =>
    hasRole(useUserInfoState().value, 'view-groups')
  );

  return { getUserInfo, getUserGroup, canViewGroups };
};
