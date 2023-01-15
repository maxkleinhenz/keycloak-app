<template>
  <div v-if="loading">
    <q-spinner color="primary" size="2em" /> Gruppen werden geladen
  </div>
  <template v-else>
    <div v-if="!groups?.length ?? 0"><q-icon name="close" color="primary" size="2em" /> Keine Gruppen zugewiesen</div>
    <template v-else>
      <q-list v-if="clickable">
        <q-item v-for="group in groups" :key="group.id" clickable v-ripple :title="group.path + ' anzeigen'" :to="{
          name: 'groups',
          params: { groupId: group.id },
        }">
          <q-item-section>{{ group.path }}</q-item-section>
          <q-item-section side>
            <q-btn size="12px" flat dense round icon="chevron_right" />
          </q-item-section>
        </q-item>
      </q-list>

      <q-list v-if="!clickable">
        <q-item v-for="group in groups" :key="group.id">
          <q-item-section>{{ group.path }}</q-item-section>
        </q-item>
      </q-list>
    </template>
  </template>

</template>

<script setup lang="ts">
import { KeycloakGroup } from 'src/models/KeycloakGroup';
import { useKeyCloakStore } from 'src/stores/keycloak-store';
import { ref, toRefs, watch } from 'vue';

export interface Props {
  userId?: string,
  clickable?: boolean
}
const props = defineProps<Props>()

const keycloakStore = useKeyCloakStore();
const groups = ref<KeycloakGroup[] | undefined>([]);
const loading = ref(false);

const { userId, clickable } = toRefs(props);
watch([userId, clickable], async ([userId, clickable]) => {
  try {
    loading.value = true;
    if (userId && clickable) {
      groups.value = await keycloakStore.loadUserGroups(userId.toString());
    }
    else {
      groups.value = keycloakStore.userInfo?.group_membership.map((g) => <KeycloakGroup>{ id: g, name: g, path: g, subGroups: [] })
    }
  }
  finally {
    loading.value = false;
  }
});

</script>

<style scoped>

</style>
