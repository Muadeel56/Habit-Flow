<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Habit Streaks</h3>
      <div class="flex items-center space-x-2">
        <button
          @click="viewMode = 'current'"
          :class="[
            'px-3 py-1 text-sm rounded-md transition-colors',
            viewMode === 'current'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-500 hover:text-gray-700',
          ]"
        >
          Current
        </button>
        <button
          @click="viewMode = 'best'"
          :class="[
            'px-3 py-1 text-sm rounded-md transition-colors',
            viewMode === 'best'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-500 hover:text-gray-700',
          ]"
        >
          Best
        </button>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-8">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
      ></div>
    </div>

    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-600">{{ error }}</p>
    </div>

    <div v-else-if="streakData.length === 0" class="text-center py-8">
      <p class="text-gray-500">No habit streaks available</p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="streak in streakData"
        :key="streak.habit.id"
        class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
      >
        <div class="flex-1">
          <h4 class="font-medium text-gray-900">{{ streak.habit.title }}</h4>
          <p class="text-sm text-gray-500 capitalize">
            {{ streak.habit.frequency }}
          </p>
        </div>

        <div class="flex items-center space-x-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">
              {{
                viewMode === 'current'
                  ? streak.currentStreak
                  : streak.bestStreak
              }}
            </div>
            <div class="text-xs text-gray-500">
              {{ viewMode === 'current' ? 'Current' : 'Best' }}
            </div>
          </div>

          <div class="flex items-center">
            <div
              class="w-12 h-12 rounded-full flex items-center justify-center"
              :class="
                getStreakColor(
                  viewMode === 'current'
                    ? streak.currentStreak
                    : streak.bestStreak
                )
              "
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary stats -->
    <div
      v-if="!loading && !error && streakData.length > 0"
      class="mt-6 pt-4 border-t border-gray-200"
    >
      <div class="grid grid-cols-2 gap-4">
        <div class="text-center">
          <div class="text-xl font-bold text-gray-900">{{ averageStreak }}</div>
          <div class="text-sm text-gray-500">
            Average {{ viewMode === 'current' ? 'Current' : 'Best' }}
          </div>
        </div>
        <div class="text-center">
          <div class="text-xl font-bold text-gray-900">{{ totalHabits }}</div>
          <div class="text-sm text-gray-500">Total Habits</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useHabitsStore } from '../../store/habits';

interface StreakData {
  habit: {
    id: string;
    title: string;
    frequency: string;
  };
  currentStreak: number;
  bestStreak: number;
}

const habitsStore = useHabitsStore();
const viewMode = ref<'current' | 'best'>('current');
const loading = ref(false);
const error = ref<string | null>(null);

const streakData = computed((): StreakData[] => {
  return habitsStore.habitsWithStreaks
    .filter(habit => habit.is_active)
    .map(habit => ({
      habit: {
        id: habit.id,
        title: habit.title,
        frequency: habit.frequency,
      },
      currentStreak: habit.streak?.current_streak || 0,
      bestStreak: habit.streak?.best_streak || 0,
    }))
    .sort((a, b) => {
      const aValue =
        viewMode.value === 'current' ? a.currentStreak : a.bestStreak;
      const bValue =
        viewMode.value === 'current' ? b.currentStreak : b.bestStreak;
      return bValue - aValue; // Sort descending
    });
});

const averageStreak = computed(() => {
  if (streakData.value.length === 0) return 0;

  const total = streakData.value.reduce((sum, streak) => {
    return (
      sum +
      (viewMode.value === 'current' ? streak.currentStreak : streak.bestStreak)
    );
  }, 0);

  return Math.round(total / streakData.value.length);
});

const totalHabits = computed(() => streakData.value.length);

const getStreakColor = (streak: number): string => {
  if (streak >= 30) return 'bg-purple-100 text-purple-600';
  if (streak >= 14) return 'bg-green-100 text-green-600';
  if (streak >= 7) return 'bg-blue-100 text-blue-600';
  if (streak >= 3) return 'bg-yellow-100 text-yellow-600';
  return 'bg-gray-100 text-gray-600';
};

const loadData = async () => {
  try {
    loading.value = true;
    error.value = null;

    await Promise.all([
      habitsStore.fetchHabits(),
      habitsStore.fetchHabitStreaks(),
    ]);
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : 'Failed to load streak data';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadData();
});
</script>
