<template>
  <div class="flex flex-col gap-1">
    <label :for="label" class="text-gray-500 text-sm">{{ label }}</label>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
}>()

</script>