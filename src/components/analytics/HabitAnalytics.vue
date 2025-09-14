<template>
  <div class="bg-card rounded-lg shadow-md p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-foreground">Habit Performance</h3>
      <select
        v-model="selectedHabitId"
        class="px-3 py-2 border border-input rounded-md text-sm bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring"
        :disabled="activeHabits.length === 0"
      >
        <option value="">
          {{
            activeHabits.length === 0 ? 'No habits available' : 'Select a habit'
          }}
        </option>
        <option v-for="habit in activeHabits" :key="habit.id" :value="habit.id">
          {{ habit.title }}
        </option>
      </select>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
      ></div>
    </div>

    <div v-else-if="error" class="text-center py-12">
      <p class="text-destructive">{{ error }}</p>
    </div>

    <!-- No habits state -->
    <div v-else-if="activeHabits.length === 0" class="text-center py-12">
      <div class="mb-4">
        <svg
          class="mx-auto h-12 w-12 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-foreground mb-2">No Habits Yet</h3>
      <p class="text-muted-foreground mb-4">
        Create your first habit to start tracking your progress and view
        detailed analytics.
      </p>
      <router-link
        to="/habits"
        class="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        <svg
          class="w-4 h-4 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        Create Your First Habit
      </router-link>
    </div>

    <!-- No habit selected state -->
    <div v-else-if="!selectedHabitId" class="text-center py-12">
      <div class="mb-4">
        <svg
          class="mx-auto h-12 w-12 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-foreground mb-2">Select a Habit</h3>
      <p class="text-muted-foreground">
        Choose a habit from the dropdown above to view detailed analytics and
        progress tracking.
      </p>
    </div>

    <!-- No data state -->
    <div v-else-if="!habitAnalytics" class="text-center py-12">
      <div class="mb-4">
        <svg
          class="mx-auto h-12 w-12 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-foreground mb-2">No Data Yet</h3>
      <p class="text-muted-foreground">
        Start completing this habit to see your progress and analytics here.
      </p>
    </div>

    <!-- Analytics data display -->
    <div v-else-if="habitAnalytics" class="space-y-6">
      <!-- Habit overview stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="text-center p-4 bg-primary/10 rounded-lg">
          <div class="text-2xl font-bold text-primary">
            {{ habitAnalytics.streak?.current_streak || 0 }}
          </div>
          <div class="text-sm text-muted-foreground">Current Streak</div>
        </div>
        <div class="text-center p-4 bg-secondary/10 rounded-lg">
          <div class="text-2xl font-bold text-secondary">
            {{ habitAnalytics.streak?.best_streak || 0 }}
          </div>
          <div class="text-sm text-muted-foreground">Best Streak</div>
        </div>
        <div class="text-center p-4 bg-accent/10 rounded-lg">
          <div class="text-2xl font-bold text-accent-foreground">
            {{ habitAnalytics.totalCompletions }}
          </div>
          <div class="text-sm text-muted-foreground">Total Completions</div>
        </div>
        <div class="text-center p-4 bg-muted/10 rounded-lg">
          <div class="text-2xl font-bold text-primary">
            {{ Math.round(habitAnalytics.completionRate) }}%
          </div>
          <div class="text-sm text-muted-foreground">Completion Rate</div>
        </div>
      </div>

      <!-- Weekly progress chart -->
      <div v-if="habitAnalytics.weeklyCompletions.length > 0">
        <h4 class="text-md font-medium text-foreground mb-4">
          Weekly Progress
        </h4>
        <div class="space-y-3">
          <div
            v-for="week in habitAnalytics.weeklyCompletions"
            :key="week.week"
            class="flex items-center justify-between"
          >
            <span class="text-sm text-muted-foreground w-24">{{
              week.week
            }}</span>
            <div class="flex-1 mx-4">
              <div class="w-full bg-muted rounded-full h-2">
                <div
                  class="h-2 rounded-full transition-all duration-300"
                  :class="getProgressColor(week.percentage)"
                  :style="{ width: `${Math.min(week.percentage, 100)}%` }"
                ></div>
              </div>
            </div>
            <span class="text-sm text-foreground w-16 text-right">
              {{ week.completions }}/{{ week.total }} ({{
                Math.round(week.percentage)
              }}%)
            </span>
          </div>
        </div>
      </div>

      <!-- Monthly progress chart -->
      <div v-if="habitAnalytics.monthlyCompletions.length > 0">
        <h4 class="text-md font-medium text-foreground mb-4">
          Monthly Progress
        </h4>
        <div class="space-y-3">
          <div
            v-for="month in habitAnalytics.monthlyCompletions"
            :key="month.month"
            class="flex items-center justify-between"
          >
            <span class="text-sm text-muted-foreground w-24">{{
              month.month
            }}</span>
            <div class="flex-1 mx-4">
              <div class="w-full bg-muted rounded-full h-2">
                <div
                  class="h-2 rounded-full transition-all duration-300"
                  :class="getProgressColor(month.percentage)"
                  :style="{ width: `${Math.min(month.percentage, 100)}%` }"
                ></div>
              </div>
            </div>
            <span class="text-sm text-foreground w-16 text-right">
              {{ month.completions }}/{{ month.total }} ({{
                Math.round(month.percentage)
              }}%)
            </span>
          </div>
        </div>
      </div>

      <!-- Habit details -->
      <div class="pt-4 border-t border-border">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-muted-foreground">Frequency:</span>
            <span class="ml-2 capitalize font-medium text-foreground">{{
              habitAnalytics.habit.frequency
            }}</span>
          </div>
          <div>
            <span class="text-muted-foreground">Created:</span>
            <span class="ml-2 font-medium text-foreground">{{
              formatDate(habitAnalytics.habit.created_at)
            }}</span>
          </div>
          <div v-if="habitAnalytics.streak?.last_completed_date">
            <span class="text-muted-foreground">Last Completed:</span>
            <span class="ml-2 font-medium text-foreground">{{
              formatDate(habitAnalytics.streak.last_completed_date)
            }}</span>
          </div>
          <div>
            <span class="text-muted-foreground">Status:</span>
            <span
              class="ml-2 px-2 py-1 text-xs rounded-full"
              :class="
                habitAnalytics.habit.is_active
                  ? 'bg-secondary/10 text-secondary'
                  : 'bg-muted/10 text-muted-foreground'
              "
            >
              {{ habitAnalytics.habit.is_active ? 'Active' : 'Inactive' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useAnalyticsStore, type HabitAnalytics } from '../../store/analytics';
import { useHabitsStore } from '../../store/habits';

const analyticsStore = useAnalyticsStore();
const habitsStore = useHabitsStore();

const selectedHabitId = ref<string>('');
const loading = ref(false);
const error = ref<string | null>(null);

const activeHabits = computed(() => habitsStore.activeHabits);

const habitAnalytics = computed((): HabitAnalytics | null => {
  if (!selectedHabitId.value) return null;
  return analyticsStore.getHabitAnalytics(selectedHabitId.value);
});

const getProgressColor = (percentage: number): string => {
  if (percentage >= 90) return 'bg-secondary';
  if (percentage >= 75) return 'bg-primary';
  if (percentage >= 50) return 'bg-yellow-500';
  if (percentage >= 25) return 'bg-orange-500';
  return 'bg-destructive';
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const loadData = async () => {
  try {
    loading.value = true;
    error.value = null;

    await analyticsStore.initializeAnalytics();
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : 'Failed to load habit analytics';
  } finally {
    loading.value = false;
  }
};

// Auto-select first habit if available
watch(
  activeHabits,
  habits => {
    if (habits.length > 0 && !selectedHabitId.value) {
      selectedHabitId.value = habits[0].id;
    }
  },
  { immediate: true }
);

onMounted(() => {
  loadData();
});
</script>
