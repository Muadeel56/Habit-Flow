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
      <h3 class="mt-2 text-sm font-medium text-gray-900">No habits yet</h3>
      <p class="mt-1 text-sm text-gray-500">
        Get started by creating your first habit.
      </p>
    </div>

    <!-- Habits Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="habit in habits"
        :key="habit.id"
        class="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
      >
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">{{ habit.title }}</h3>
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
        </div>

        <!-- Description -->
        <p v-if="habit.description" class="text-gray-600 mb-4">
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
              class="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
              :disabled="loading"
            >
              Delete
            </button>
          </div>
        </div>

        <!-- Created Date -->
        <div class="mt-4 pt-4 border-t border-gray-100">
          <p class="text-xs text-gray-500">
            Created {{ formatDate(habit.created_at) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div
      v-if="error"
      class="mt-4 bg-red-50 border border-red-200 rounded-md p-3"
    >
      <p class="text-sm text-red-600">{{ error }}</p>
      <button
        @click="clearError"
        class="mt-2 text-sm text-red-600 hover:text-red-700 underline"
      >
        Dismiss
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useHabitsStore, type Habit } from '@/store/habits';

interface Emits {
  (e: 'edit', habit: Habit): void;
}

const emit = defineEmits<Emits>();

const habitsStore = useHabitsStore();

const habits = computed(() => habitsStore.habits);
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

const handleEdit = (habit: Habit) => {
  emit('edit', habit);
};

const handleToggleStatus = async (habit: Habit) => {
  const result = await habitsStore.toggleHabitStatus(habit.id);
  if (!result.success) {
    console.error('Failed to toggle habit status:', result.error);
  }
};

const handleDelete = async (habit: Habit) => {
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
</script>
