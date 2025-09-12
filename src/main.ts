import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { pinia } from './store';
import router from './router';

const app = createApp(App);

// Install Pinia
app.use(pinia);

// Install Router
app.use(router);

app.mount('#app');
