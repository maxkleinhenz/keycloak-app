import { defineNuxtPlugin } from '#app';
import PrimeVue from 'primevue/config';
import InputText from 'primevue/inputtext';
import InputSwitch from 'primevue/inputswitch';
import Checkbox from 'primevue/checkbox';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue, { ripple: true });
  nuxtApp.vueApp.component('InputText', InputText);
  nuxtApp.vueApp.component('InputSwitch', InputSwitch);
  nuxtApp.vueApp.component('Checkbox', Checkbox);
  //other components that you need
});
