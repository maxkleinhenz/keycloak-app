/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue}'],
  theme: {
    extend: {},
    screens: {
      xs: { min: '0px', max: '599.99px' },
      sm: { min: '600px', max: '1023.99px' },
      md: { min: '1024px', max: '1439.99px' },
      lg: { min: '1440px', max: '1919.99px' },
      xl: { min: '1920px' },
    },
  },
  plugins: [],
  prefix: 'tw-',
  corePlugins: {
    preflight: false,
  },
};
