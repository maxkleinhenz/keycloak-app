// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: [
    '~/assets/css/main.css',
    'primevue/resources/themes/tailwind-light/theme.css',
    'primevue/resources/primevue.css',
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  build: {
    transpile: ['primevue'],
  },
  modules: ['nuxt-icon'],
});
