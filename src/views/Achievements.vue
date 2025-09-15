<template>
  <div class="achievements-page">
    <Suspense>
      <template #default>
        <AchievementsDisplay />
      </template>
      <template #fallback>
        <div class="space-y-6">
          <div class="h-8 bg-muted rounded w-1/3 animate-pulse"></div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="i in 6"
              :key="i"
              class="bg-card rounded-lg p-6 animate-pulse"
            >
              <div class="h-12 w-12 bg-muted rounded-full mb-4"></div>
              <div class="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div class="h-3 bg-muted rounded w-full"></div>
            </div>
          </div>
        </div>
      </template>
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

// Lazy load component
const AchievementsDisplay = defineAsyncComponent(
  () => import('../components/achievements/AchievementsDisplay.vue')
);
</script>
