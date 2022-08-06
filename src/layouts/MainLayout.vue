<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar class="wrap">
        <q-toolbar-title>Keycloak Manager</q-toolbar-title>
        <q-btn
          v-if="!isLoggedIn"
          class="col-auto"
          stretch
          flat
          label="Login"
          icon="login"
          @click="login"
        />
        <template v-if="isLoggedIn">
          <q-btn
            flat
            stretch
            :label="profile?.preferred_username ?? '<empty>'"
            @click="router.push({ name: 'profile' })"
          />
          <q-btn stretch flat label="Logout" icon="logout" @click="logout" />
        </template>
      </q-toolbar>
    </q-header>

    <q-page-container class="page-container q-px-xl">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { kc } from 'src/boot/keycloak';
import { useKeyCloakStore } from 'src/stores/keycloak-store';
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const keycloakStore = useKeyCloakStore();

const isLoggedIn = computed(() => kc.authenticated ?? false);
const profile = computed(() => keycloakStore.profile);

onMounted(() => {
  if (isLoggedIn.value) keycloakStore.loadProfile();
});

const login = async () => {
  await keycloakStore.login();
  await router.push({
    name: 'profile',
  });
};

const logout = async () => {
  await kc.logout({ redirectUri: '/' });
};
</script>

<style lang="scss">
.page-container {
  max-width: 1024px;
  margin-inline: auto;
}
</style>
