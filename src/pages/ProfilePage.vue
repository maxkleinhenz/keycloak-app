<template>
  <q-page>
    <PageTitle
      :headline="pageHeader"
      :tagline="myProfile ? 'Mein Profil' : 'Profil'"
    ></PageTitle>
    <div class="row q-gutter-md items-center">
      <div class="col-12 col-md-auto">
        <div class="text-center">
          <q-avatar size="150px">
            <img src="https://cdn.quasar.dev/img/avatar.png" />
          </q-avatar>
        </div>
      </div>
      <div class="col-12 col-sm">
        <div class="row items-center">
          <div class="col-12">
            <q-field borderless label="Benutzername" stack-label>
              <template v-slot:control>
                <div class="text-content full-width no-outline" tabindex="0">
                  {{ user?.username ?? '-' }}
                </div>
              </template>
            </q-field>
          </div>
        </div>
        <div class="row items-center">
          <div class="col-12 col-sm-6">
            <q-field borderless label="Vorname" stack-label>
              <template v-slot:control>
                <div class="text-content full-width no-outline" tabindex="0">
                  {{ user?.firstName ?? '-' }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-12 col-sm-6">
            <q-field borderless label="Nachname" stack-label>
              <template v-slot:control>
                <div class="text-content full-width no-outline" tabindex="0">
                  {{ user?.lastName ?? '-' }}
                </div>
              </template>
            </q-field>
          </div>
        </div>
        <div class="row items-center">
          <div class="col-12 col-sm-6">
            <q-field borderless label="E-Mail" stack-label>
              <template v-slot:control>
                <div class="text-content full-width no-outline" tabindex="0">
                  {{ user?.email ?? '-' }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-12 col-sm-6">
            <q-field borderless label="" stack-label>
              <template v-slot:control>
                <q-checkbox
                  label="E-Mail bestätigt"
                  :model-value="user?.emailVerified ?? false"
                />
              </template>
            </q-field>
          </div>
        </div>
      </div>
    </div>
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
        <q-tab name="groups" icon="groups" label="Gruppen" />
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

const route = useRoute();
const keycloakStore = useKeyCloakStore();
const user = ref<KeycloakUser>();
const groups = ref<KeycloakGroup[]>();

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
</script>
