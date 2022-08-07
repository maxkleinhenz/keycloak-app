<template>
  <div class="column q-mt-lg">
    <p v-if="props.tagline" class="col text-uppercase text-grey-8 q-mb-xs">
      {{ props.tagline }}
    </p>
    <h1 class="col q-mt-none q-mb-xl">{{ props.headline ?? '-' }}</h1>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  headline: {
    type: String,
    required: true,
  },
  tagline: {
    type: String,
    required: false,
  },
});
</script>

<style lang="scss" scoped></style>
