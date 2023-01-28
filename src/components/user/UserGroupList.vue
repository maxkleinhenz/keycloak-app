
<template>
  <GroupList :loading="loading" :clickable="clickable" :groups="groups"></GroupList>
</template>

<script setup lang="ts">
import { KeycloakGroup } from 'src/models/KeycloakGroup';
import { useKeyCloakStore } from 'src/stores/keycloak-store';
import { ref, toRefs, watch } from 'vue';
import GroupList from '../group/GroupList.vue';

export interface Props {
  userId?: string,
  clickable?: boolean
}
const props = defineProps<Props>()

const keycloakStore = useKeyCloakStore();
const groups = ref<KeycloakGroup[] | undefined>(undefined);
const loading = ref(true);

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
}, { immediate: true });

</script>