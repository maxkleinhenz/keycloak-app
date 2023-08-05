<template>
  <div class="grid grid-cols-1 mx-auto max-w-5xl p-5 gap-4">
    <AppPageTitle class :headline="pageHeader" tagline="Mein Profil" :enable-edit="true" v-model:edit="editMode">
    </AppPageTitle>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AppInputField label="Benutzername" class="md:col-span-2">
        <AppInlineEditableField label="Benutzername" :model-value="user?.preferred_username" />
      </AppInputField>

      <AppInputField label="Vorname">
        <AppInlineEditableField label="Vorname" :model-value="user?.given_name" :edit-mode="editMode" />
      </AppInputField>
      <AppInputField label="Nachname">
        <AppInlineEditableField label="Nachname" :model-value="user?.family_name" :edit-mode="editMode" />
      </AppInputField>

      <AppInputField label="E-Mail-Adresse">
        <AppInlineEditableField label="E-Mail-Adresse" :model-value="user?.email" />
      </AppInputField>
      <AppInputField label="E-Mail-Adresse bestätigt">
        <InputSwitch :model-value="user?.email_verified" class="scale-90" disabled />
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
import { RouteLocationNormalizedLoaded } from '.nuxt/vue-router';
import { computedAsync } from '@vueuse/core';
import { Group } from 'types/groups.model';

const { getUserInfo, getUserGroup, canViewGroups } = useKeycloakState()
const user = await getUserInfo()

const editMode = ref(false);

const groups = computedAsync(async () => {
  if (canViewGroups.value) {
    return (await getUserGroup()).value
  }
  else if (user.value?.group_membership) {
    return user.value.group_membership.map((g) => {
      return { id: "0", name: g } as Group;
    });
  }
  return undefined;
});

const pageHeader = computed(() => {
  if (user.value?.given_name && user.value?.family_name)
    return `${user.value?.given_name} ${user.value?.family_name}`;
  return user.value?.preferred_username ?? '-';
});

definePageMeta({
  key: "userinfo"
});
</script>
