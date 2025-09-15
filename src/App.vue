<template>
  <div id="app">
    <!-- Show layout only for authenticated users -->
    <Suspense v-if="authStore.isAuthenticated">
      <template #default>
        <AppLayout>
          <router-view />
        </AppLayout>
      </template>
      <template #fallback>
        <div class="flex items-center justify-center min-h-screen">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
          ></div>
        </div>
      </template>
    </Suspense>

    <!-- Show auth pages without layout -->
    <router-view v-else />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { useAuthStore } from './store/auth';

// Lazy load the layout component
const AppLayout = defineAsyncComponent(
  () => import('./components/layout/AppLayout.vue')
);

const authStore = useAuthStore();
</script>
