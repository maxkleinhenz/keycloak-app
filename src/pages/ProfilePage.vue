<template>
  <div>
    <h1>My Profile</h1>
    <div class="row q-gutter-md items-center">
      <div class="col-12 col-md-auto">
        <div class="text-center">
          <q-avatar size="150px">
            <img src="https://cdn.quasar.dev/img/avatar.png" />
          </q-avatar>
        </div>
      </div>
      <div class="col-12 col-sm">
        <q-field borderless label="Username" stack-label>
          <template v-slot:control>
            <div class="self-center full-width no-outline" tabindex="0">
              {{ profile?.preferred_username }}
            </div>
          </template>
        </q-field>
        <div class="row">
          <div class="col-12 col-sm-6">
            <q-field borderless label="First Name" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ profile?.given_name }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-12 col-sm-6">
            <q-field borderless label="Last Name" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ profile?.family_name }}
                </div>
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
          <GroupList></GroupList>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useKeyCloakStore } from 'src/stores/keycloak-store';
import { computed, onMounted, ref } from 'vue';
import GroupList from '../components/GroupList.vue';

const keycloakStore = useKeyCloakStore();

const profile = computed(() => keycloakStore.profile);
const selectedTab = ref('groups');
onMounted(async () => {
  await keycloakStore.loadProfile();
});
</script>

<style scoped></style>
