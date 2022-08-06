<template>
  <h1>{{ route.params.path }}</h1>
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
      <q-tab name="members" icon="group" label="members" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="selectedTab" animated>
      <q-tab-panel name="members">
        <GroupMemberList :members="members"></GroupMemberList>
      </q-tab-panel>
    </q-tab-panels>
  </div>
  <!-- <div class="q-pt-lg">
    <h2>Member</h2>
    <q-list v-if="members">
      <q-item v-for="member in members" :key="member.id" clickable v-ripple>
        <q-item-section>
          <q-item-label
            >{{ member.firstName }} {{ member.lastName }}</q-item-label
          >
          <q-item-label caption lines="1">{{ member.username }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div> -->
</template>

<script setup lang="ts">
import { KeycloakGroupMember } from 'src/models/KeycloackGroupMember';
import { KeycloakGroup } from 'src/models/KeycloakGroup';
import { useKeyCloakStore } from 'src/stores/keycloak-store';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import GroupMemberList from 'src/components/GroupMemberList.vue';

const route = useRoute();
const keycloakStore = useKeyCloakStore();
const group = ref<KeycloakGroup>();
const members = ref<KeycloakGroupMember[]>();
const selectedTab = ref('members');

watch(
  () => route.params.path,
  (path) => {
    group.value = keycloakStore.getGroupByPath(path as string);
    keycloakStore.loadGroupMember(group.value?.id ?? '');
  }
);

onMounted(async () => {
  if (keycloakStore.groups?.length ?? 0 === 0) {
    await keycloakStore.loadAllGroups();
  }

  group.value = keycloakStore.getGroupByPath(route.params.path as string);
  members.value = await keycloakStore.loadGroupMember(group.value?.id ?? '');
});
</script>

<style scoped></style>
