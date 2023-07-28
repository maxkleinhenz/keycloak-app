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
    public: { AUTH_ISSUER: process.env.AUTH_ISSUER },
  },
  typescript: {
    strict: true,
  },
  imports: {
    dirs: ['stores'],
  },
});
