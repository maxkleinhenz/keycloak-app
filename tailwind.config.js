/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        juso: {
          beere: 'rgb(var(--juso-beere) / <alpha-value>)',
          'hell-lila': 'rgb(var(--juso-hell-lila) / <alpha-value>)',
          rosa: 'rgb(var(--juso-rosa) / <alpha-value>)',
          rot: 'rgb(var(--juso-rot) / <alpha-value>)',
          orange: 'rgb(var(--juso-orange) / <alpha-value>)',
          creme: 'rgb(var(--juso-creme) / <alpha-value>)',
          traube: 'rgb(var(--juso-traube) / <alpha-value>)',
        },
      },
    },
  },
  plugins: [],
};
