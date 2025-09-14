<template>
  <div id="app">
    <!-- Show layout only for authenticated users -->
    <AppLayout v-if="authStore.isAuthenticated">
      <router-view />
    </AppLayout>

    <!-- Show auth pages without layout -->
    <router-view v-else />
  </div>
</template>

<script setup lang="ts">
import AppLayout from './components/layout/AppLayout.vue';
import { useAuthStore } from './store/auth';

const authStore = useAuthStore();
</script>
