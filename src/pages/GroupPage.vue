<template>
  <q-page>
    <PageTitle :headline="group?.name ?? ''" tagline="Group"></PageTitle>
    <div class="row">
      <div class="col-12 col-sm-6">
        <q-field borderless label="Name" stack-label>
          <template v-slot:control>
            <div class="text-content full-width no-outline" tabindex="0">
              {{ group?.name ?? '-' }}
            </div>
          </template>
        </q-field>
      </div>
      <div class="col-12 col-sm-6">
        <q-field borderless label="Path" stack-label>
          <template v-slot:control>
            <div class="text-content full-width no-outline" tabindex="0">
              {{ group?.path ?? '-' }}
            </div>
          </template>
        </q-field>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <q-field borderless label="Id" stack-label>
          <template v-slot:control>
            <div class="text-content full-width no-outline" tabindex="0">
              {{ group?.id ?? '-' }}
            </div>
          </template>
        </q-field>
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
        <q-tab name="members" icon="group" label="members" />
        <q-tab name="subgroups" icon="account_tree" label="subgroups" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="selectedTab" animated>
        <q-tab-panel name="members">
          <GroupMemberList
            :members="members"
            :group="group"
            @remove-user-from-group="removeUserFromGroup"
          ></GroupMemberList>
        </q-tab-panel>
        <q-tab-panel name="subgroups">
          <GroupList :groups="group?.subGroups"></GroupList>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { KeycloakGroupMember } from 'src/models/KeycloackGroupMember';
import { KeycloakGroup } from 'src/models/KeycloakGroup';
import { useKeyCloakStore } from 'src/stores/keycloak-store';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import GroupMemberList from 'src/components/GroupMemberList.vue';
import GroupList from 'src/components/GroupList.vue';
import PageTitle from 'src/components/PageTitle.vue';

const route = useRoute();
const keycloakStore = useKeyCloakStore();
const group = ref<KeycloakGroup>();
const members = ref<KeycloakGroupMember[]>();
const selectedTab = ref('members');

watch(
  () => route.params.path,
  () => {
    reload();
  }
);

onMounted(async () => {
  reload();
});

const reload = async () => {
  if (keycloakStore.groups?.length ?? 0 === 0) {
    await keycloakStore.loadAllGroups();
  }

  if (route.params.path) {
    const path = route.params.path;
    group.value = keycloakStore.getGroupByPath(path as string);
    members.value = await keycloakStore.loadGroupMember(group.value?.id ?? '');
  }
};

const removeUserFromGroup = async (userid: string) => {
  if (group.value) {
    await keycloakStore.RemoveUserFromGroup(group.value.id, userid);
    await reload();
  }
};
</script>
