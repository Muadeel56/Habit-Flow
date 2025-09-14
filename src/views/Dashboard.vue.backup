<template>
  <div class="space-y-8">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
      <p class="mt-2 text-gray-600">Track your habit progress and insights</p>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
      ></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-600 mb-4">{{ error }}</div>
      <button
        @click="loadData"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Retry
      </button>
    </div>

    <!-- Dashboard content -->
    <div v-else class="space-y-8">
      <!-- Stats cards -->
      <!-- Progress Overview Cards -->
      <ProgressOverviewCards />

      <!-- Charts section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Completion chart -->
        <CompletionChart />

        <!-- Streak widget -->
        <StreakWidget />
      </div>

      <!-- Achievements Widget -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <BadgeWidget />

        <!-- Placeholder for future widget -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Coming Soon</h3>
          <p class="text-gray-600">More analytics features coming soon!</p>
        </div>
      </div>

      <!-- Detailed analytics -->
      <div class="grid grid-cols-1 gap-8">
        <HabitAnalytics />
      </div>

      <!-- Recent activity -->
      <div class="bg-white rounded-lg shadow-md">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">Recent Activity</h2>
        </div>
        <div class="p-6">
          <div v-if="recentCompletions.length === 0" class="text-center py-8">
            <p class="text-gray-500">No recent activity</p>
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="completion in recentCompletions"
              :key="completion.id"
              class="flex items-center"
            >
              <div class="flex-shrink-0">
                <div
                  class="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center"
                >
                  <svg
                    class="h-4 w-4 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm text-gray-900">
                  Completed "{{ getHabitTitle(completion.habit_id) }}"
                </p>
                <p class="text-xs text-gray-500">
                  {{ formatRelativeTime(completion.completed_at) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAnalyticsStore } from '../store/analytics';
import { useHabitsStore } from '../store/habits';
import CompletionChart from '../components/analytics/CompletionChart.vue';
import StreakWidget from '../components/analytics/StreakWidget.vue';
import HabitAnalytics from '../components/analytics/HabitAnalytics.vue';
import ProgressOverviewCards from '../components/analytics/ProgressOverviewCards.vue';
import BadgeWidget from '../components/achievements/BadgeWidget.vue';

const analyticsStore = useAnalyticsStore();
const habitsStore = useHabitsStore();

const loading = ref(false);
const error = ref<string | null>(null);

const recentCompletions = computed(() => {
  return habitsStore.habitCompletions
    .slice(0, 5) // Show last 5 completions
    .sort(
      (a, b) =>
        new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
    );
});

const getHabitTitle = (habitId: string): string => {
  const habit = habitsStore.habits.find(h => h.id === habitId);
  return habit?.title || 'Unknown Habit';
};

const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;

  return date.toLocaleDateString();
};

const loadData = async () => {
  try {
    loading.value = true;
    error.value = null;

    await analyticsStore.initializeAnalytics();
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : 'Failed to load dashboard data';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadData();
});
</script>
