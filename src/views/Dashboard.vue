<template>
  <div class="space-y-8">
    <!-- Consistent Page Header -->
    <PageHeader
      title="Dashboard"
      description="Track your daily progress and stay motivated"
    >
      <template #actions>
        <!-- Welcome Progress Card -->
        <div
          class="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 text-white shadow-lg"
        >
          <div class="text-center">
            <div class="text-2xl font-bold">{{ todayProgress }}%</div>
            <div class="text-sm text-blue-100">Today's Progress</div>
          </div>
        </div>
      </template>
    </PageHeader>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="flex flex-col items-center space-y-4">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"
        ></div>
        <p class="text-gray-600 dark:text-gray-400">
          Loading your dashboard...
        </p>
      </div>
    </div>

    <!-- Error state -->
    <div
      v-else-if="error"
      class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6"
    >
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <svg
            class="h-6 w-6 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div class="ml-4 flex-1">
          <h3 class="text-lg font-semibold text-red-800 dark:text-red-200">
            Error loading dashboard
          </h3>
          <p class="text-red-700 dark:text-red-300 mt-1">{{ error }}</p>
          <button
            @click="loadData"
            class="mt-4 bg-red-100 dark:bg-red-900/30 px-4 py-2 rounded-lg text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    </div>

    <!-- Dashboard content -->
    <div v-else class="space-y-8">
      <!-- Stats cards -->
      <ProgressOverviewCards />

      <!-- Charts section -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <!-- Completion chart -->
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                Completion Trends
              </h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm">
                Your progress over time
              </p>
            </div>
            <div class="flex space-x-2">
              <button
                class="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg"
              >
                Week
              </button>
              <button
                class="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg"
              >
                Month
              </button>
              <button
                class="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg"
              >
                3M
              </button>
            </div>
          </div>
          <CompletionChart />
        </div>

        <!-- Streak widget -->
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                Habit Streaks
              </h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm">
                Your consistency streaks
              </p>
            </div>
            <div
              class="h-8 w-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center"
            >
              <svg
                class="h-5 w-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
            </div>
          </div>
          <StreakWidget />
        </div>
      </div>

      <!-- Bottom section -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <!-- Achievements Widget -->
        <div class="xl:col-span-1">
          <div
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                  Achievements
                </h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm">
                  Your recent badges
                </p>
              </div>
              <router-link
                to="/achievements"
                class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
              >
                View All
              </router-link>
            </div>
            <BadgeWidget />
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="xl:col-span-2">
          <div
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div
              class="px-6 py-4 border-b border-gray-200 dark:border-gray-700"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                    Recent Activity
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400 text-sm">
                    Your latest completions
                  </p>
                </div>
                <div
                  class="h-8 w-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center"
                >
                  <svg
                    class="h-5 w-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div class="p-6">
              <div
                v-if="recentCompletions.length === 0"
                class="text-center py-8"
              >
                <div
                  class="h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4"
                >
                  <svg
                    class="h-8 w-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p class="text-gray-600 dark:text-gray-400">
                  No recent activity
                </p>
                <p class="text-gray-500 dark:text-gray-500 text-sm mt-1">
                  Complete some habits to see your progress here
                </p>
              </div>
              <div v-else class="space-y-4">
                <div
                  v-for="completion in recentCompletions"
                  :key="completion.id"
                  class="flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div class="flex-shrink-0">
                    <div
                      class="h-10 w-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center"
                    >
                      <svg
                        class="h-5 w-5 text-white"
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
                  <div class="ml-4 flex-1">
                    <p
                      class="text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Completed "{{ getHabitTitle(completion.habit_id) }}"
                    </p>
                    <p class="text-xs text-gray-600 dark:text-gray-400">
                      {{ formatRelativeTime(completion.completed_at) }}
                    </p>
                  </div>
                  <div class="text-green-600 dark:text-green-400">
                    <svg
                      class="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed analytics -->
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">
              Detailed Analytics
            </h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm">
              Comprehensive habit insights
            </p>
          </div>
        </div>
        <HabitAnalytics />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAnalyticsStore } from '../store/analytics';
import { useHabitsStore } from '../store/habits';
import PageHeader from '../components/layout/PageHeader.vue';
import CompletionChart from '../components/analytics/CompletionChart.vue';
import StreakWidget from '../components/analytics/StreakWidget.vue';
import HabitAnalytics from '../components/analytics/HabitAnalytics.vue';
import ProgressOverviewCards from '../components/analytics/ProgressOverviewCards.vue';
import BadgeWidget from '../components/achievements/BadgeWidget.vue';

const analyticsStore = useAnalyticsStore();
const habitsStore = useHabitsStore();

const loading = ref(false);
const error = ref<string | null>(null);

const todayProgress = computed(() => {
  // Calculate today's progress percentage
  const today = new Date().toDateString();
  const todayCompletions = habitsStore.habitCompletions.filter(
    completion => new Date(completion.completed_at).toDateString() === today
  );
  const totalHabits = habitsStore.habits.length;
  return totalHabits > 0
    ? Math.round((todayCompletions.length / totalHabits) * 100)
    : 0;
});

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
