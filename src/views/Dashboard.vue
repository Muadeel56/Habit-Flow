<template>
  <div class="space-y-8">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
      <p class="mt-2 text-muted-foreground">
        Track your habit progress and insights
      </p>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"
      ></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-destructive mb-4">{{ error }}</div>
      <button
        @click="loadData"
        class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
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
        <div class="bg-card rounded-lg shadow-sm border border-border p-6">
          <h3 class="text-lg font-semibold text-card-foreground mb-4">
            Coming Soon
          </h3>
          <p class="text-muted-foreground">
            More analytics features coming soon!
          </p>
        </div>
      </div>

      <!-- Detailed analytics -->
      <div class="grid grid-cols-1 gap-8">
        <HabitAnalytics />
      </div>

      <!-- Recent activity -->
      <div class="bg-card rounded-lg shadow-md">
        <div class="px-6 py-4 border-b border-border">
          <h2 class="text-lg font-medium text-card-foreground">
            Recent Activity
          </h2>
        </div>
        <div class="p-6">
          <div v-if="recentCompletions.length === 0" class="text-center py-8">
            <p class="text-muted-foreground">No recent activity</p>
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="completion in recentCompletions"
              :key="completion.id"
              class="flex items-center"
            >
              <div class="flex-shrink-0">
                <div
                  class="h-8 w-8 bg-secondary/10 rounded-full flex items-center justify-center"
                >
                  <CheckCircleIcon class="h-4 w-4 text-secondary" />
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm text-card-foreground">
                  Completed "{{ getHabitTitle(completion.habit_id) }}"
                </p>
                <p class="text-xs text-muted-foreground">
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
import { CheckCircleIcon } from '@heroicons/vue/24/outline';

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
