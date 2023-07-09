<template>
  <div class="flex flex-col h-full items-center justify-center gap-2">
    <p class="text-center">Warte einen kurzen Moment, du wirst automatisch angemeldet.<br>Wenn es ist klappt, klicke auf
      Login.</p>
    <AppButton intent="primary" shape="pill" @click="signIn('keycloak', { callbackUrl: '/profil' })">
      <AppIcon name="ic:baseline-lock-person" /> Login mit Rote.Tools
    </AppButton>
  </div>
</template>


<script setup lang="ts">

const { status, signIn } = useAuth();

if (status.value !== 'authenticated') {
  signIn("keycloak", { callbackUrl: "/profil" })
}
else {
  navigateTo("/profil");
}

definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/',
  }
})

</script>

