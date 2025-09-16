<template>
  <div class="space-y-8">
    <!-- Consistent Page Header -->
    <PageHeader
      title="Achievements"
      description="Celebrate your milestones and progress"
    >
      <template #actions>
        <button
          @click="refreshAchievements"
          :disabled="loading"
          class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-xl hover:from-yellow-600 hover:to-orange-700 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <svg
            v-if="loading"
            class="animate-spin w-4 h-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {{ loading ? 'Refreshing...' : 'Refresh' }}
        </button>
      </template>
    </PageHeader>

    <!-- Achievements Content -->
    <Suspense>
      <template #default>
        <AchievementsDisplay />
      </template>
      <template #fallback>
        <div class="space-y-6">
          <div
            class="h-8 bg-gray-200 dark:bg-gray-600 rounded w-1/3 animate-pulse"
          ></div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="i in 6"
              :key="i"
              class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse"
            >
              <div
                class="h-12 w-12 bg-gray-200 dark:bg-gray-600 rounded-full mb-4"
              ></div>
              <div
                class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"
              ></div>
              <div
                class="h-3 bg-gray-200 dark:bg-gray-600 rounded w-full"
              ></div>
            </div>
          </div>
        </div>
      </template>
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue';
import PageHeader from '@/components/layout/PageHeader.vue';

// Lazy load component
const AchievementsDisplay = defineAsyncComponent(
  () => import('../components/achievements/AchievementsDisplay.vue')
);

// Mock loading and refresh function for now
const loading = ref(false);

const refreshAchievements = async () => {
  loading.value = true;
  // Simulate refresh
  setTimeout(() => {
    loading.value = false;
  }, 1000);
};
</script>
