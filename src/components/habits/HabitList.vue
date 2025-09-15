<template>
  <div>
    <!-- Loading State -->
    <div
      v-if="loading && habits.length === 0"
      class="flex justify-center items-center py-12"
    >
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
      ></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="habits.length === 0" class="text-center py-12">
      <svg
        class="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        ></path>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-card-foreground">
        No habits yet
      </h3>
      <p class="mt-1 text-sm text-muted-foreground">
        Get started by creating your first habit.
      </p>
    </div>

    <!-- Habits Grid -->
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      data-cy="habit-list"
    >
      <div
        v-for="habit in habitsWithStreaks"
        :key="habit.id"
        class="bg-card rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        :class="{ 'ring-2 ring-green-200': habit.is_completed_today }"
      >
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-card-foreground">
            {{ habit.title }}
          </h3>
          <div class="flex items-center space-x-2">
            <span
              :class="[
                'px-2 py-1 text-xs rounded-full',
                habit.is_active
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800',
              ]"
            >
              {{ habit.is_active ? 'Active' : 'Inactive' }}
            </span>
            <span
              v-if="habit.is_completed_today"
              class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800"
            >
              ✓ Done
            </span>
          </div>
        </div>

        <!-- Description -->
        <p v-if="habit.description" class="text-muted-foreground mb-4">
          {{ habit.description }}
        </p>

        <!-- Frequency Badge -->
        <div class="mb-4">
          <span
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
          >
            {{ formatFrequency(habit.frequency) }}
          </span>
        </div>

        <!-- Streak Information -->
        <div v-if="habit.streak" class="mb-4 p-3 bg-muted rounded-lg">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="text-center">
                <div class="text-lg font-bold text-orange-600">
                  {{ habit.streak.current_streak }}
                </div>
                <div class="text-xs text-muted-foreground">Current</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-bold text-primary">
                  {{ habit.streak.best_streak }}
                </div>
                <div class="text-xs text-muted-foreground">Best</div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm font-medium text-foreground">Streak</div>
              <div class="text-xs text-muted-foreground">
                {{ formatLastCompleted(habit.streak.last_completed_date) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Completion Toggle -->
        <div v-if="habit.is_active" class="mb-4">
          <button
            @click="handleToggleCompletion(habit)"
            :disabled="loading"
            :class="[
              'w-full py-2 px-4 rounded-lg font-medium transition-colors',
              habit.is_completed_today
                ? 'bg-green-100 text-green-800 hover:bg-green-200 border border-green-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300',
            ]"
          >
            <div class="flex items-center justify-center space-x-2">
              <svg
                v-if="habit.is_completed_today"
                class="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
              <svg
                v-else
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4"
                />
              </svg>
              <span>
                {{
                  habit.is_completed_today ? 'Completed Today' : 'Mark as Done'
                }}
              </span>
            </div>
          </button>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-between">
          <div class="flex space-x-2">
            <button
              @click="handleEdit(habit)"
              class="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
              :disabled="loading"
            >
              Edit
            </button>
            <button
              @click="handleToggleStatus(habit)"
              class="text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
              :disabled="loading"
            >
              {{ habit.is_active ? 'Pause' : 'Resume' }}
            </button>
            <button
              @click="handleDelete(habit)"
              class="text-destructive hover:text-destructive/80 text-sm font-medium transition-colors"
              :disabled="loading"
            >
              Delete
            </button>
          </div>
        </div>

        <!-- Created Date -->
        <div class="mt-4 pt-4 border-t border-gray-100">
          <p class="text-xs text-muted-foreground">
            Created {{ formatDate(habit.created_at) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div
      v-if="error"
      class="mt-4 bg-destructive/10 border border-destructive/20 rounded-md p-3"
    >
      <p class="text-sm text-destructive">{{ error }}</p>
      <button
        @click="clearError"
        class="mt-2 text-sm text-destructive hover:text-destructive/80 underline"
      >
        Dismiss
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useHabitsStore, type HabitWithStreak } from '@/store/habits';

interface Emits {
  (e: 'edit', habit: HabitWithStreak): void;
}

const emit = defineEmits<Emits>();

const habitsStore = useHabitsStore();

const habits = computed(() => habitsStore.habits);
const habitsWithStreaks = computed(() => habitsStore.filteredAndSortedHabits);
const loading = computed(() => habitsStore.loading);
const error = computed(() => habitsStore.error);

const formatFrequency = (frequency: string) => {
  const frequencyMap = {
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
  };
  return frequencyMap[frequency as keyof typeof frequencyMap] || frequency;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatLastCompleted = (dateString?: string) => {
  if (!dateString) return 'Never';

  const date = new Date(dateString);
  const today = new Date();
  const diffTime = today.getTime() - date.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

const handleEdit = (habit: HabitWithStreak) => {
  emit('edit', habit);
};

const handleToggleStatus = async (habit: HabitWithStreak) => {
  const result = await habitsStore.toggleHabitStatus(habit.id);
  if (!result.success) {
    console.error('Failed to toggle habit status:', result.error);
  }
};

const handleToggleCompletion = async (habit: HabitWithStreak) => {
  if (habit.is_completed_today) {
    const result = await habitsStore.unmarkHabitCompleted(habit.id);
    if (!result.success) {
      console.error('Failed to unmark habit as completed:', result.error);
    }
  } else {
    const result = await habitsStore.markHabitCompleted(habit.id);
    if (!result.success) {
      console.error('Failed to mark habit as completed:', result.error);
    }
  }
};

const handleDelete = async (habit: HabitWithStreak) => {
  if (
    window.confirm(
      `Are you sure you want to delete "${habit.title}"? This action cannot be undone.`
    )
  ) {
    const result = await habitsStore.deleteHabit(habit.id);
    if (!result.success) {
      console.error('Failed to delete habit:', result.error);
    }
  }
};

const clearError = () => {
  habitsStore.clearError();
};

// Initialize data when component mounts
onMounted(async () => {
  await habitsStore.initializeData();
});
</script>
