<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900">Habit Performance</h3>
      <select
        v-model="selectedHabitId"
        class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Select a habit</option>
        <option v-for="habit in activeHabits" :key="habit.id" :value="habit.id">
          {{ habit.title }}
        </option>
      </select>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
      ></div>
    </div>

    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-600">{{ error }}</p>
    </div>

    <div v-else-if="!selectedHabitId" class="text-center py-12">
      <p class="text-gray-500">Select a habit to view its analytics</p>
    </div>

    <div v-else-if="habitAnalytics" class="space-y-6">
      <!-- Habit overview stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="text-center p-4 bg-blue-50 rounded-lg">
          <div class="text-2xl font-bold text-blue-600">
            {{ habitAnalytics.streak?.current_streak || 0 }}
          </div>
          <div class="text-sm text-gray-600">Current Streak</div>
        </div>
        <div class="text-center p-4 bg-green-50 rounded-lg">
          <div class="text-2xl font-bold text-green-600">
            {{ habitAnalytics.streak?.best_streak || 0 }}
          </div>
          <div class="text-sm text-gray-600">Best Streak</div>
        </div>
        <div class="text-center p-4 bg-purple-50 rounded-lg">
          <div class="text-2xl font-bold text-purple-600">
            {{ habitAnalytics.totalCompletions }}
          </div>
          <div class="text-sm text-gray-600">Total Completions</div>
        </div>
        <div class="text-center p-4 bg-orange-50 rounded-lg">
          <div class="text-2xl font-bold text-orange-600">
            {{ Math.round(habitAnalytics.completionRate) }}%
          </div>
          <div class="text-sm text-gray-600">Completion Rate</div>
        </div>
      </div>

      <!-- Weekly progress chart -->
      <div>
        <h4 class="text-md font-medium text-gray-900 mb-4">Weekly Progress</h4>
        <div class="space-y-3">
          <div
            v-for="week in habitAnalytics.weeklyCompletions"
            :key="week.week"
            class="flex items-center justify-between"
          >
            <span class="text-sm text-gray-600 w-24">{{ week.week }}</span>
            <div class="flex-1 mx-4">
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="h-2 rounded-full transition-all duration-300"
                  :class="getProgressColor(week.percentage)"
                  :style="{ width: `${Math.min(week.percentage, 100)}%` }"
                ></div>
              </div>
            </div>
            <span class="text-sm text-gray-900 w-16 text-right">
              {{ week.completions }}/{{ week.total }} ({{
                Math.round(week.percentage)
              }}%)
            </span>
          </div>
        </div>
      </div>

      <!-- Monthly progress chart -->
      <div>
        <h4 class="text-md font-medium text-gray-900 mb-4">Monthly Progress</h4>
        <div class="space-y-3">
          <div
            v-for="month in habitAnalytics.monthlyCompletions"
            :key="month.month"
            class="flex items-center justify-between"
          >
            <span class="text-sm text-gray-600 w-24">{{ month.month }}</span>
            <div class="flex-1 mx-4">
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="h-2 rounded-full transition-all duration-300"
                  :class="getProgressColor(month.percentage)"
                  :style="{ width: `${Math.min(month.percentage, 100)}%` }"
                ></div>
              </div>
            </div>
            <span class="text-sm text-gray-900 w-16 text-right">
              {{ month.completions }}/{{ month.total }} ({{
                Math.round(month.percentage)
              }}%)
            </span>
          </div>
        </div>
      </div>

      <!-- Habit details -->
      <div class="pt-4 border-t border-gray-200">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-gray-600">Frequency:</span>
            <span class="ml-2 capitalize font-medium">{{
              habitAnalytics.habit.frequency
            }}</span>
          </div>
          <div>
            <span class="text-gray-600">Created:</span>
            <span class="ml-2 font-medium">{{
              formatDate(habitAnalytics.habit.created_at)
            }}</span>
          </div>
          <div v-if="habitAnalytics.streak?.last_completed_date">
            <span class="text-gray-600">Last Completed:</span>
            <span class="ml-2 font-medium">{{
              formatDate(habitAnalytics.streak.last_completed_date)
            }}</span>
          </div>
          <div>
            <span class="text-gray-600">Status:</span>
            <span
              class="ml-2 px-2 py-1 text-xs rounded-full"
              :class="
                habitAnalytics.habit.is_active
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
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
  if (percentage >= 90) return 'bg-green-500';
  if (percentage >= 75) return 'bg-blue-500';
  if (percentage >= 50) return 'bg-yellow-500';
  if (percentage >= 25) return 'bg-orange-500';
  return 'bg-red-500';
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
