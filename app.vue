<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>


<script setup lang="ts">
useHead({
  titleTemplate: (title) => {
    const page = title ? `${title} - ` : ""
    return `${page}Gruppenverwaltung`
  },
});
</script>
