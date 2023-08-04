// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  build: {
    transpile: ['primevue'],
  },
  modules: ['@sidebase/nuxt-auth', 'nuxt-icon', '@pinia/nuxt'],
  runtimeConfig: {
    public: {
      AUTH_ISSUER: process.env.AUTH_ISSUER,
      KEYCLOAK_ADMIN_API: process.env.KEYCLOAK_ADMIN_API,
    },
  },
  typescript: {
    strict: true,
  },
  imports: {
    dirs: ['stores'],
  },
  sourcemap: {
    server: true,
    client: true,
  },
});
