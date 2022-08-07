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
          <q-btn flat stretch :label="profile?.preferred_username">
            <q-menu>
              <q-list style="min-width: 100px">
                <q-item
                  clickable
                  v-close-popup
                  @click="router.push({ name: 'profile' })"
                >
                  <q-item-section avatar>
                    <q-icon name="person" />
                  </q-item-section>
                  <q-item-section>My Profile</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-close-popup @click="logout">
                  <q-item-section avatar>
                    <q-icon name="logout" />
                  </q-item-section>
                  <q-item-section>Logout</q-item-section>
                </q-item>
              </q-list>
            </q-menu></q-btn
          >
        </template>
      </q-toolbar>
    </q-header>

    <q-page-container class="page-container q-px-md">
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
