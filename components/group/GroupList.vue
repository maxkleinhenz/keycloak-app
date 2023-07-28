<template>
  <div>
    <Listbox :options="groups" class="w-full border-none !shadow-none">
      <template #option="slotProps">
        <component :is="listItem" :class="itemClasses" intent="default">
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
import { twMerge } from 'tailwind-merge';

const props = defineProps<{
  groups?: { name: string }[];
  navigable?: boolean;
}>();

const listItem = computed(() => {
  if (props.navigable) return resolveComponent('AppButton');
  return 'p';
});

const itemClasses = computed(() => {
  let classes = 'flex w-full';
  if (!props.navigable) {
    classes += ' px-4 py-2 sm:py-3 sm:px-5';
  }
  return twMerge(classes);
});
</script>
