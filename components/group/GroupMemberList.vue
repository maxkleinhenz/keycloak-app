<template>
  <div>
    <Listbox :options="members" class="w-full border-none !shadow-none">
      <template #option="slotProps">
        <GroupMemberListItem :member="slotProps.option" :navigable="true" />
      </template>
      <template #empty>
        <p>Keine Mitglieder</p>
      </template>
    </Listbox>
  </div>
</template>

<script setup lang="ts">
import { computedAsync } from '@vueuse/core';

const props = defineProps<{
  groupId: string;
  navigable?: boolean;
}>();

const { fetchGroupMembers } = useKeycloakApi();
const members = computedAsync(async () => {
  const { data: members } = await fetchGroupMembers(props.groupId);
  if (members.value) return members.value
  return undefined;
});
</script>
