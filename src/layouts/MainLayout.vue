<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar class="wrap">
        <q-toolbar-title>Gruppenverwaltung</q-toolbar-title>
        <q-btn
          v-if="!isLoggedIn"
          class="col-auto"
          stretch
          flat
          :label="quasar.screen.gt.xs ? 'Login' : ''"
          icon="login"
          @click="login"
        />
        <template v-if="isLoggedIn">
          <q-btn
            flat
            stretch
            :label="quasar.screen.gt.xs ? profile?.username : ''"
            icon="o_account_circle"
            title="Mein Profil"
          >
            <q-menu>
              <q-list style="min-width: 100px">
                <q-item
                  clickable
                  v-close-popup
                  @click="router.push({ name: 'profile' })"
                >
                  <q-item-section avatar>
                    <q-icon name="o_person" />
                  </q-item-section>
                  <q-item-section>Mein Profil</q-item-section>
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
import { useKeyCloakStore } from 'src/stores/keycloak-store';
import { useRouteUtils } from 'src/use/useRouteUtils';
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { keyclockConfig } from 'src/use/keyclock.config';
import { useQuasar } from 'quasar';

const quasar = useQuasar();
const router = useRouter();
const keycloakStore = useKeyCloakStore();
const { getAbsoluteUrlFromRoute } = useRouteUtils();

const isLoggedIn = computed(() => keycloakStore.isAuthenticated);
const profile = computed(() => keycloakStore.profile);

onMounted(() => {
  if (isLoggedIn.value) keycloakStore.loadProfile();
});

const login = async () => {
  if (!isLoggedIn.value) {
    await keycloakStore.loginKeycloak(
      getAbsoluteUrlFromRoute(router, { name: 'profile' })
    );
  }
  router.push({ name: 'profile' });
};

const logout = async () => {
  await keycloakStore.logout(
    `${keyclockConfig.url}/realms/${keyclockConfig.realm}/protocol/openid-connect/logout/logout-confirm`
  );
};
</script>

<style lang="scss">
.page-container {
  max-width: 1024px;
  margin-inline: auto;
}
</style>
