<template>
  <div class="grid grid-cols-1 mx-auto max-w-5xl p-5 gap-4">
    <AppPageTitle
      class
      :headline="pageHeader"
      tagline="Profil"
      :enable-edit="true"
      v-model:edit="editMode"
    >
    </AppPageTitle>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AppInputField label="Benutzername" class="md:col-span-2">
        <AppInlineEditableField
          label="Benutzername"
          :model-value="profile?.preferred_username"
          :edit-mode="false"
        />
      </AppInputField>

      <AppInputField label="Vorname">
        <AppInlineEditableField
          label="Vorname"
          :model-value="profile?.given_name"
          :edit-mode="editMode"
        />
      </AppInputField>
      <AppInputField label="Nachname">
        <AppInlineEditableField
          label="Nachname"
          :model-value="profile?.family_name"
          :edit-mode="editMode"
        />
      </AppInputField>

      <AppInputField label="E-Mail-Adresse">
        <AppInlineEditableField
          label="E-Mail-Adresse"
          :model-value="profile?.email"
          :edit-mode="false"
        />
      </AppInputField>
      <AppInputField label="E-Mail-Adresse bestätigt">
        <InputSwitch
          :model-value="profile?.email_verified"
          class="scale-90"
          disabled
        />
      </AppInputField>
    </div>

    <div>
      <TabView>
        <TabPanel header="Gruppen">
          <GroupList :groups="groups" :navigable="canUserViewGroups" />
        </TabPanel>
        <TabPanel header="Gruppen2">
          <GroupList :navigable="true" />
        </TabPanel>
      </TabView>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

const editMode = ref(false);

const store = useKeycloakStore();
const { canUserViewGroups } = storeToRefs(store);
const { data: profile } = await store.getUserInfo();

const groups = computed(() => {
  if (profile.value?.group_membership) {
    return profile.value.group_membership.map((g) => {
      return { name: g };
    });
  }
  return undefined;
});

const pageHeader = computed(() => {
  if (profile.value?.given_name && profile.value?.family_name)
    return `${profile.value?.given_name} ${profile.value?.family_name}`;
  return profile.value?.preferred_username ?? '-';
});
</script>
