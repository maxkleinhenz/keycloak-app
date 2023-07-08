<script lang="ts" setup></script>

<template>
  <div class="flex flex-col h-screen">
    <div class="bg-juso-rot p-3 flex flex-row items-center shadow-lg">
      <AppButton to="/" intent="link" shape="default" class="text-white">Gruppenverwaltung</AppButton>
      <div class="flex justify-end flex-1">
        <AppButton intent="tertiary" shape="pill" class="text-white">
          <AppIcon name="ic:baseline-account-circle" /> <span class="hidden sm:inline">Login</span>
        </AppButton>
      </div>
    </div>
    <div class=" flex-1">
      <slot />
    </div>

  </div>
</template>

<style scoped></style>