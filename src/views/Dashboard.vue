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
      <Suspense>
        <template #default>
          <ProgressOverviewCards />
        </template>
        <template #fallback>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              v-for="i in 4"
              :key="i"
              class="bg-card rounded-lg p-6 animate-pulse"
            >
              <div class="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div class="h-8 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        </template>
      </Suspense>

      <!-- Charts section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Completion chart -->
        <Suspense>
          <template #default>
            <CompletionChart />
          </template>
          <template #fallback>
            <div class="bg-card rounded-lg p-6">
              <div class="h-4 bg-muted rounded w-1/3 mb-4"></div>
              <div class="h-64 bg-muted rounded animate-pulse"></div>
            </div>
          </template>
        </Suspense>

        <!-- Streak widget -->
        <Suspense>
          <template #default>
            <StreakWidget />
          </template>
          <template #fallback>
            <div class="bg-card rounded-lg p-6">
              <div class="h-4 bg-muted rounded w-1/3 mb-4"></div>
              <div class="h-64 bg-muted rounded animate-pulse"></div>
            </div>
          </template>
        </Suspense>
      </div>

      <!-- Achievements Widget -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Suspense>
          <template #default>
            <BadgeWidget />
          </template>
          <template #fallback>
            <div class="bg-card rounded-lg p-6">
              <div class="h-4 bg-muted rounded w-1/3 mb-4"></div>
              <div class="h-32 bg-muted rounded animate-pulse"></div>
            </div>
          </template>
        </Suspense>

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
        <Suspense>
          <template #default>
            <HabitAnalytics />
          </template>
          <template #fallback>
            <div class="bg-card rounded-lg p-6">
              <div class="h-4 bg-muted rounded w-1/3 mb-4"></div>
              <div class="h-96 bg-muted rounded animate-pulse"></div>
            </div>
          </template>
        </Suspense>
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
import { ref, computed, onMounted, defineAsyncComponent } from 'vue';
import { useAnalyticsStore } from '../store/analytics';
import { useHabitsStore } from '../store/habits';
import { CheckCircleIcon } from '@heroicons/vue/24/outline';

// Lazy load components
const CompletionChart = defineAsyncComponent(
  () => import('../components/analytics/CompletionChart.vue')
);
const StreakWidget = defineAsyncComponent(
  () => import('../components/analytics/StreakWidget.vue')
);
const HabitAnalytics = defineAsyncComponent(
  () => import('../components/analytics/HabitAnalytics.vue')
);
const ProgressOverviewCards = defineAsyncComponent(
  () => import('../components/analytics/ProgressOverviewCards.vue')
);
const BadgeWidget = defineAsyncComponent(
  () => import('../components/achievements/BadgeWidget.vue')
);

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
