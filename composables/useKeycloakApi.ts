import { GroupMember } from 'types/group-member.model';
import { Group } from 'types/groups.model';
import { User } from 'types/user.model';
import { UserInfo } from 'types/userInfo.model';

export const useKeycloakApi = () => {
  const config = useRuntimeConfig();

  const fetchKeycloak = <T>(url: string) => {
    const { data } = useAuth();
    console.log('fetch', url);
    const accessToken = (data.value?.user as any)?.access_token as
      | string
      | undefined;
    return useFetch<T>(url, {
      // server: false,
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + accessToken,
      },
    });
  };

  const fetchUserInfo = () =>
    fetchKeycloak<UserInfo>(
      `${config.public.AUTH_ISSUER}/protocol/openid-connect/userinfo`
    );

  const fetchUser = (userId: string) => {
    const url = `${config.public.KEYCLOAK_ADMIN_API}/users/${userId}`;
    console.log('fetchUser', url);
    return fetchKeycloak<User>(url);
  };

  const fetchUserGroups = (userId: string) =>
    fetchKeycloak<Group[]>(
      `${config.public.KEYCLOAK_ADMIN_API}/users/${userId}/groups`
    );

  const fetchGroups = (groupId: string) =>
    fetchKeycloak<Group>(
      `${config.public.KEYCLOAK_ADMIN_API}/groups/${groupId}`
    );

  const fetchGroupMembers = (groupId: string) =>
    fetchKeycloak<GroupMember[]>(
      `${config.public.KEYCLOAK_ADMIN_API}/groups/${groupId}/members`
    );

  const fetchUserCount = (search?: string | undefined) => {
    const searchParam = search ? `?search=${search}` : '';
    return fetchKeycloak<number>(
      `${config.public.KEYCLOAK_ADMIN_API}/users/count${searchParam}`
    );
  };

  const fetchUsers = (
    offset: number,
    max: number,
    search?: string | undefined
  ) => {
    const searchParam = search ? `&search=${search}` : '';
    return fetchKeycloak<User[]>(
      `${config.public.KEYCLOAK_ADMIN_API}/users/?first=${offset}&max=${max}${searchParam}`
    );
  };

  return {
    fetchUserInfo,
    fetchUser,
    fetchUserGroups,
    fetchGroups,
    fetchGroupMembers,
    fetchUserCount,
    fetchUsers,
  };
};
