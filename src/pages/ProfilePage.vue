<template>
  <q-page>
    <q-form @submit="onSubmit">
      <PageTitle
        :headline="pageHeader"
        :tagline="myProfile ? 'Mein Profil' : 'Profil'"
        :show-edit-button="myProfile"
        @on-edit-click="setEditMode(true)"
        @on-edit-cancel-click="setEditMode(false)"
      ></PageTitle>

      <UserProfile
        :user="editUser ?? user"
        :edit-mode="!!editUser"
      ></UserProfile>
    </q-form>

    <div class="q-mt-xl">
      <q-tabs
        v-model="selectedTab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="left"
        inline-label
      >
        <q-tab
          name="groups"
          icon="groups"
          :label="myProfile ? 'Meine Gruppen' : 'Gruppen'"
        />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="selectedTab" animated>
        <q-tab-panel name="groups">
          <GroupList :groups="groups"></GroupList>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { KeycloakGroup } from 'src/models/KeycloakGroup';
import { KeycloakUser } from 'src/models/KeycloakUser';
import { useKeyCloakStore } from 'src/stores/keycloak-store';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import GroupList from '../components/GroupList.vue';
import PageTitle from 'src/components/PageTitle.vue';
import UserProfile from 'src/components/UserProfile.vue';

const route = useRoute();
const keycloakStore = useKeyCloakStore();
const user = ref<KeycloakUser>();
const groups = ref<KeycloakGroup[]>();
const store = useKeyCloakStore();

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

onMounted(async () => {
  await reload();
});

watch(
  () => route.params.userId,
  () => {
    reload();
  }
);

const reload = async () => {
  if (route.params.userId) {
    user.value = await keycloakStore.getUser(route.params.userId as string);
  } else {
    await keycloakStore.loadProfile();
    user.value = keycloakStore.profile;
  }
  groups.value = await keycloakStore.loadUserGroups(user.value?.id);
};

const editUser = ref<KeycloakUser | undefined>(undefined);
const setEditMode = (mode: boolean) => {
  if (mode) editUser.value = { ...user.value } as KeycloakUser;
  else editUser.value = undefined;
};

const onSubmit = async () => {
  if (user.value?.id && editUser.value) {
    user.value = await store.updateUser(user.value.id, editUser.value);
  }
  setEditMode(false);
};
</script>
