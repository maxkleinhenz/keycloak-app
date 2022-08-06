<template>
  <div v-if="!(profile?.groups ?? false)">no groups</div>
  <q-list v-if="profile?.groups">
    <q-item
      v-for="group in profile?.groups"
      :key="group"
      :to="{
        name: 'group',
        params: { path: group },
      }"
      clickable
      v-ripple
    >
      <q-item-section>{{ group }}</q-item-section>
      <q-item-section side>
        <q-icon name="chevron_right" color="black" />
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import { useKeyCloakStore } from 'src/stores/keycloak-store';
import { computed } from 'vue';

const keycloakStore = useKeyCloakStore();
const profile = computed(() => keycloakStore.profile);
</script>

<style scoped></style>
