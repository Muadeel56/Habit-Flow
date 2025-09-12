import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { pinia } from './store';
import router from './router';
import { useAuthStore } from './store/auth';

const app = createApp(App);

// Install Pinia
app.use(pinia);

// Install Router
app.use(router);

// Initialize auth store
const authStore = useAuthStore();
authStore.initAuth();

app.mount('#app');
