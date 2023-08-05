<template>
  <div class="grid grid-cols-1 mx-auto max-w-5xl p-5 gap-4">
    <!-- <pre>{{ route.params }}</pre> -->

    <AppPageTitle class :headline="pageHeader" tagline="Profil" :enable-edit="true" v-model:edit="editMode">
    </AppPageTitle>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AppInputField label="Benutzername" class="md:col-span-2">
        <AppInlineEditableField label="Benutzername" :model-value="user?.username" />
      </AppInputField>

      <AppInputField label="Vorname">
        <AppInlineEditableField label="Vorname" :model-value="user?.firstName" :edit-mode="editMode" />
      </AppInputField>
      <AppInputField label="Nachname">
        <AppInlineEditableField label="Nachname" :model-value="user?.lastName" :edit-mode="editMode" />
      </AppInputField>

      <AppInputField label="E-Mail-Adresse">
        <AppInlineEditableField label="E-Mail-Adresse" :model-value="user?.email" />
      </AppInputField>
      <AppInputField label="E-Mail-Adresse bestätigt">
        <InputSwitch :model-value="user?.emailVerified" class="scale-90" disabled />
      </AppInputField>
    </div>

    <div>
      <TabView>
        <TabPanel header="Gruppen">
          <GroupList :groups="groups" :navigable="canViewGroups" />
        </TabPanel>
        <TabPanel header="Gruppen2">
          <GroupList :navigable="true" />
        </TabPanel>
      </TabView>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouteLocation, RouteLocationNormalized, RouteLocationNormalizedLoaded, RouteRecordRedirectOption } from '.nuxt/vue-router';
import { computedAsync } from '@vueuse/core';
import { Group } from 'types/groups.model';
import { User } from 'types/user.model';

// const user = ref<User | null>();

// onMounted(async () => {
console.log("onActivated")
const route = useRoute();
const profileId = route.params.profileId.toString();
console.log("profileIdaaaa", profileId);

const { getUserInfo, getUserGroup, canViewGroups } = useKeycloakState()
const { fetchUser } = useKeycloakApi()
//const user = await getUserInfo()

const userInfo = await getUserInfo();
const { data: profile } = await fetchUser(profileId)
const user = computedAsync(() => profile.value);

watchEffect(() => console.log("userInfo", userInfo.value))
watchEffect(() => console.log("profile", profile.value))


// })



// const user = computedAsync(async () => {
//   const userInfo = await getUserInfo();
//   if (profileId === userInfo.value?.sub) {
//     return userInfo.value
//   }

//   const { data } = await fetchUser(profileId)
//   return data.value
// })

// const { fetchUser } = useKeycloakApi()
// const { data: user } = await fetchUser(profileId)

console.log("user", user.value)

const editMode = ref(false);

const groups = computedAsync(async () => {
  // if (canViewGroups.value) {
  //   const groups = await getUserGroup();
  //   return groups.value
  // }
  // else if (user.value?.group_membership) {
  //   return user.value.group_membership.map((g) => {
  //     return { id: "0", name: g } as Group;
  //   });
  // }
  return undefined;
});

const pageHeader = computed(() => {
  if (user.value?.firstName && user.value?.lastName)
    return `${user.value?.firstName} ${user.value?.lastName}`;
  return user.value?.username ?? '-';
});

definePageMeta({
  key: (route: RouteLocationNormalizedLoaded) => {
    console.log("key", route.params)
    return route.params.profileId.toString();
  },
  middleware: async (to: RouteLocationNormalized) => {
    return "/profil";
    // const profileId = to.params.profileId.toString();
    // const { getUserInfo } = useKeycloakState()
    // const userInfo = await getUserInfo()
    // const myProfile = computed(() => !profileId || userInfo.value?.sub === profileId)

    // console.log("profileId", profileId, myProfile.value)

    // if (myProfile.value) {
    //   console.log("to profile")
    //   return "/profil";
    // }
    // else {
    //   console.log("to true")
    //   return true
    // }
  },
});

// definePageMeta({
//   middleware: async (to: RouteLocationNormalized) => {
//     const profileId = to.params.profileId.toString();
//     const { getUserInfo } = useKeycloakState()
//     const userInfo = await getUserInfo()
//     const myProfile = computed(() => !profileId || userInfo.value?.sub === profileId)

//     console.log("profileId", profileId, myProfile.value)

//     if (myProfile.value) {
//       console.log("to profile")
//       return "/profil";
//     }
//     else {
//       console.log("to true")
//       return true;
//     }
//   },
// });
</script>
