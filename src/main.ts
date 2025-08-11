import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router/index.ts'

import PrimeVue from 'primevue/config';
//import 'primevue/resources/themes/saga-blue/theme.css'; 
//import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import InputText from 'primevue/inputtext'
import Password from 'primevue/password';
import Button from 'primevue/button';

import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast';


const app = createApp(App);  
const pinia = createPinia();  
app.use(pinia);
app.use(PrimeVue);
app.use(router);
app.use(ToastService);
app.component('InputText', InputText);
app.component('Password', Password);
app.component('Button', Button);
app.component('Toast', Toast);
app.mount('#app');
