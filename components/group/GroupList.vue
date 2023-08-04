<template>
  <div>
    <Listbox :options="groups" class="w-full border-none !shadow-none">
      <template #option="slotProps">
        <component :is="listItem" class="flex w-full" intent="default" :to="groupLink(slotProps.option.id)">
          <div class="flex-1 text-left">
            {{ slotProps.option.name }}
          </div>
          <div v-if="navigable">
            <AppIcon name="ic:baseline-chevron-right"
              class="hover:bg-gray-200 hover:ring-gray-600 hover:ring-1 hover:ring-offset-1 rounded-full" />
          </div>
        </component>
      </template>
      <template #empty>
        <p>Keine Gruppen</p>
      </template>
    </Listbox>
  </div>
</template>

<script setup lang="ts">
import { Group } from 'types/groups.model';

const props = defineProps<{
  groups?: Group[];
  navigable?: boolean;
}>();

const listItem = computed(() => {
  if (props.navigable) return resolveComponent('AppButton');
  return 'p';
});

const groupLink = computed(() => (groupId: string) => props.navigable ? "/gruppe/" + groupId : undefined);
</script>
