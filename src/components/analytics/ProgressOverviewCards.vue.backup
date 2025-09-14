<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <!-- Total Habits Card -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex items-center">
        <div class="p-2 bg-indigo-100 rounded-lg">
          <svg
            class="w-6 h-6 text-indigo-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600">Total Habits</p>
          <p class="text-2xl font-semibold text-gray-900">
            {{ totalHabits }}
          </p>
          <p class="text-xs text-gray-500 mt-1">
            {{ activeHabits }} active, {{ inactiveHabits }} inactive
          </p>
        </div>
      </div>
    </div>

    <!-- Overall Completion Rate Card -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex items-center">
        <div class="p-2 bg-emerald-100 rounded-lg">
          <svg
            class="w-6 h-6 text-emerald-600"
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
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600">Completion Rate</p>
          <p class="text-2xl font-semibold text-gray-900">
            {{ Math.round(overallCompletionRate) }}%
          </p>
          <p class="text-xs text-gray-500 mt-1">Overall performance</p>
        </div>
      </div>
    </div>

    <!-- Active Habits Card -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex items-center">
        <div class="p-2 bg-blue-100 rounded-lg">
          <svg
            class="w-6 h-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600">Active Habits</p>
          <p class="text-2xl font-semibold text-gray-900">
            {{ activeHabits }}
          </p>
          <p class="text-xs text-gray-500 mt-1">Currently tracking</p>
        </div>
      </div>
    </div>

    <!-- Today's Progress Card -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex items-center">
        <div class="p-2 bg-orange-100 rounded-lg">
          <svg
            class="w-6 h-6 text-orange-600"
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
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600">Today's Progress</p>
          <p class="text-2xl font-semibold text-gray-900">
            {{ todayCompletions }}
          </p>
          <p class="text-xs text-gray-500 mt-1">
            {{ Math.round(todayCompletionRate) }}% completed today
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useHabitsStore } from '../../store/habits';

const habitsStore = useHabitsStore();

// Calculate total habits
const totalHabits = computed(() => habitsStore.habits.length);

// Calculate active habits
const activeHabits = computed(() => habitsStore.activeHabits.length);

// Calculate inactive habits
const inactiveHabits = computed(() => habitsStore.inactiveHabits.length);

// Calculate today's completions
const todayCompletions = computed(() => {
  const today = new Date().toISOString().split('T')[0];
  return habitsStore.habitCompletions.filter(
    completion => completion.completed_date === today
  ).length;
});

// Calculate today's completion rate
const todayCompletionRate = computed(() => {
  const activeHabitsCount = activeHabits.value;
  const todayCompletionsCount = todayCompletions.value;

  if (activeHabitsCount === 0) return 0;
  return (todayCompletionsCount / activeHabitsCount) * 100;
});

// Calculate overall completion rate
const overallCompletionRate = computed(() => {
  const allHabits = habitsStore.habits;
  if (allHabits.length === 0) return 0;

  let totalExpectedCompletions = 0;
  let totalActualCompletions = 0;

  allHabits.forEach(habit => {
    const habitCompletions = habitsStore.habitCompletions.filter(
      completion => completion.habit_id === habit.id
    );

    // Calculate expected completions based on habit creation date and frequency
    const habitCreatedDate = new Date(habit.created_at);
    const daysSinceCreation = Math.ceil(
      (Date.now() - habitCreatedDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    let expectedCompletions = 0;
    switch (habit.frequency) {
      case 'daily':
        expectedCompletions = daysSinceCreation;
        break;
      case 'weekly':
        expectedCompletions = Math.ceil(daysSinceCreation / 7);
        break;
      case 'monthly':
        expectedCompletions = Math.ceil(daysSinceCreation / 30);
        break;
    }

    totalExpectedCompletions += expectedCompletions;
    totalActualCompletions += habitCompletions.length;
  });

  if (totalExpectedCompletions === 0) return 0;
  return (totalActualCompletions / totalExpectedCompletions) * 100;
});
</script>
