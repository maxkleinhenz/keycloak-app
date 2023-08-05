<template>
  <component :is="listItem" class="flex w-full" intent="default" :to="profileLink(member.id)">
    <div class="flex-1 text-left">
      {{ memberName }}
    </div>
    <div v-if="navigable">
      <AppIcon name="ic:baseline-chevron-right"
        class="hover:bg-gray-200 hover:ring-gray-600 hover:ring-1 hover:ring-offset-1 rounded-full" />
    </div>
  </component>
</template>

<script setup lang="ts">
import { GroupMember } from 'types/group-member.model';

const props = defineProps<{
  member: GroupMember;
  navigable?: boolean;
}>();

const listItem = computed(() => {
  if (props.navigable) return resolveComponent('AppButton');
  return 'p';
});

const memberName = computed(() => {
  if (props.member.firstName && props.member.lastName) return `${props.member.firstName} ${props.member.lastName}`;
  return props.member.username ?? '-'
});

const profileLink = computed(() => (userId: string) => props.navigable ? "/profil/" + userId : undefined);
</script>

<style scoped></style>