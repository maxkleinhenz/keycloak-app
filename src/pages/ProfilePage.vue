<template>
  <q-page>
    <q-form @submit="onSubmit" ref="userformRef">
      <PageTitle :headline="pageHeader" :tagline="myProfile ? 'Mein Profil' : 'Profil'" :enable-edit="myProfile"
        :edit-mode="editMode" @edit="editMode = true" @cancel="editMode = false" @save="userformRef?.submit()">
      </PageTitle>

      <UserProfile v-model="editUser" :edit-mode="editMode"></UserProfile>
    </q-form>

    <div class="q-mt-xl">
      <q-tabs v-model="selectedTab" dense class="text-grey" active-color="primary" indicator-color="primary"
        align="left" inline-label>
        <q-tab name="groups" icon="groups" :label="myProfile ? 'Meine Gruppen' : 'Gruppen'" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="selectedTab" animated>
        <q-tab-panel name="groups">
          <GroupList :userId="user.id" :clickable="keycloakStore.canQueryGroups"></GroupList>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useKeyCloakStore } from 'src/stores/keycloak-store';
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import GroupList from '../components/GroupList.vue';
import PageTitle from 'src/components/common/PageTitle.vue';
import UserProfile from 'src/components/UserProfile.vue';
import { KeycloakProfile } from 'keycloak-js';
import { QForm } from 'quasar';

const route = useRoute();
const keycloakStore = useKeyCloakStore();
const user = ref<KeycloakProfile>({} as KeycloakProfile);
const store = useKeyCloakStore();

const userformRef = ref<null | QForm>(null);

const editMode = ref(false);
const editUser = ref<KeycloakProfile>({} as KeycloakProfile);
let editAbortController: AbortController | undefined = undefined;

const pageHeader = computed(() => {
  if (user.value?.firstName && user.value.lastName)
    return `${user.value.firstName} ${user.value.lastName}`;
  return user.value?.username ?? '-';
});
const myProfile = computed(
  () =>
    !route.params.userId || keycloakStore.profile?.id === route.params.userId
);
const selectedTab = ref('groups');

const reload = async () => {
  if (myProfile.value) {
    await keycloakStore.loadProfile();
    user.value = keycloakStore.profile ?? {};
  } else {
    user.value = await keycloakStore.getUser(route.params.userId as string);
  }
  editUser.value = { ...user.value } as KeycloakProfile;
};

watch(
  () => route.params.userId,
  () => {
    reload();
  }, { immediate: true }
);

const onSubmit = async () => {
  if (!user.value?.id || !editMode.value)
    return;

  editAbortController?.abort();
  editAbortController = new AbortController();

  if (myProfile.value) {
    await store.updateProfile(editAbortController.signal, editUser.value)
    await reload();
  }
  else {
    user.value = await store.updateUser(user.value.id, editUser.value);
  }
  editMode.value = false;
};
</script>
