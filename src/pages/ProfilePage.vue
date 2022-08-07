<template>
  <div>
    <h1 v-if="myProfile">My Profile</h1>
    <h1 v-if="!myProfile">Profile</h1>
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
          <q-field borderless label="Username" stack-label>
            <template v-slot:control>
              <div class="text-content full-width no-outline" tabindex="0">
                {{ user?.username ?? '-' }}
              </div>
            </template>
          </q-field>
        </div>
        <div class="row items-center">
          <div class="col-12 col-sm-6">
            <q-field borderless label="First Name" stack-label>
              <template v-slot:control>
                <div class="text-content full-width no-outline" tabindex="0">
                  {{ user?.firstName ?? '-' }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-12 col-sm-6">
            <q-field borderless label="Last Name" stack-label>
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
                  label="E-Mail verified"
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
        <q-tab name="groups" icon="groups" label="Groups" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="selectedTab" animated>
        <q-tab-panel name="groups">
          <GroupList :groups="groups"></GroupList>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script setup lang="ts">
import { KeycloakGroup } from 'src/models/KeycloakGroup';
import { KeycloakUser } from 'src/models/KeycloakUser';
import { useKeyCloakStore } from 'src/stores/keycloak-store';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import GroupList from '../components/GroupList.vue';

const route = useRoute();
const keycloakStore = useKeyCloakStore();
const user = ref<KeycloakUser>();
const groups = ref<KeycloakGroup[]>();

const myProfile = computed(
  () =>
    !route.params.username ||
    keycloakStore.profile?.preferred_username === route.params.username
);
const selectedTab = ref('groups');
onMounted(async () => {
  await reload();
});

watch(
  () => route.params.username,
  () => {
    reload();
  }
);

const reload = async () => {
  await keycloakStore.loadAllUsers();

  if (route.params.username) {
    user.value = keycloakStore.getUserByUsername(
      route.params.username as string | undefined
    );
  } else {
    await keycloakStore.loadProfile();
    user.value = keycloakStore.getUserByUsername(
      keycloakStore.profile?.preferred_username
    );
  }
  groups.value = await keycloakStore.loadUserGroups(user.value?.id);
  console.log('user', user.value);
};
</script>
