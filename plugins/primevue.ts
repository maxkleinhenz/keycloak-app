import { defineNuxtPlugin } from '#app';
import PrimeVue from 'primevue/config';
import InputText from 'primevue/inputtext';
import InputSwitch from 'primevue/inputswitch';
import Checkbox from 'primevue/checkbox';
import Menu from 'primevue/menu';
import TabPanel from 'primevue/tabpanel';
import TabView from 'primevue/tabview';
import Listbox from 'primevue/listbox';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue, { ripple: true });
  nuxtApp.vueApp.component('InputText', InputText);
  nuxtApp.vueApp.component('InputSwitch', InputSwitch);
  nuxtApp.vueApp.component('Checkbox', Checkbox);
  nuxtApp.vueApp.component('Menu', Menu);
  nuxtApp.vueApp.component('TabView', TabView);
  nuxtApp.vueApp.component('TabPanel', TabPanel);
  nuxtApp.vueApp.component('Listbox', Listbox);
});
