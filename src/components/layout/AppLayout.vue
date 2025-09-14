<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <AppHeader @toggle-sidebar="toggleSidebar" />

    <div class="flex">
      <!-- Sidebar -->
      <AppSidebar :is-open="sidebarOpen" @close="closeSidebar" />

      <!-- Main content -->
      <main class="flex-1 lg:ml-0">
        <div class="py-6">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <slot />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AppHeader from './AppHeader.vue';
import AppSidebar from './AppSidebar.vue';

const sidebarOpen = ref(false);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const closeSidebar = () => {
  sidebarOpen.value = false;
};
</script>
