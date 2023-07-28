// import { Group } from 'types/groups.model';
// import { UserInfo } from 'types/userInfo.model';

// export const useKeycloakApi = () => {
//   const getHeaders = () => useRequestHeaders(['cookie']) as HeadersInit;

//   const fetchUserInfo = () =>
//     useAsyncData('userinfo', () => {
//       const headers = getHeaders();
//       return $fetch<UserInfo>('/api/user', { headers });
//     });

//   // const fetchUserGroups = (userId: string) =>
//   //   useAsyncData(`user:${userId}:groups`, () => {
//   //     const headers = getHeaders();
//   //     return $fetch<Group[]>(`/api/user/${userId}/groups`, {
//   //       headers,
//   //     });
//   //   });

//   // const canUserViewGroups = (user: UserInfo) =>
//   //   user.resource_access?.account?.roles?.includes('view-groups') ?? false;

//   // const getUserInfo = () => {
//   //   if (store.userInfo) return store.userInfo;

//   //   return useAsyncData('userInfo', async () => {
//   //     const data = await fetchUserInfo();
//   //     store.userInfo = data;
//   //     return data;
//   //   });
//   // };

//   // const getUserGroups = async () => {
//   //   const userId = store.userId;
//   //   if (!userId) {
//   //     console.error('no user id');
//   //     return;
//   //   }

//   //   return useAsyncData(`user:${userId}:groups`, async () => {
//   //     const data = await fetchUserGroups(userId);
//   //     return data;
//   //   });
//   // };

//   return { fetchUserInfo };
// };
