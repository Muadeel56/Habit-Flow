<template>
  <div>
    <div class="mb-8">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Habits</h1>
          <p class="mt-2 text-gray-600">
            Manage your daily habits and track your progress
          </p>
        </div>
        <button
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Habit
        </button>
      </div>
    </div>

    <!-- Habits grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Morning Exercise</h3>
          <span
            class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
            >Active</span
          >
        </div>
        <p class="text-gray-600 mb-4">
          30 minutes of cardio or strength training
        </p>
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-500">7 day streak</span>
          <button class="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Mark Complete
          </button>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">
            Read for 30 minutes
          </h3>
          <span
            class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
            >Active</span
          >
        </div>
        <p class="text-gray-600 mb-4">Daily reading to expand knowledge</p>
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-500">3 day streak</span>
          <button class="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Mark Complete
          </button>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Meditation</h3>
          <span
            class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full"
            >Paused</span
          >
        </div>
        <p class="text-gray-600 mb-4">10 minutes of mindfulness practice</p>
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-500">0 day streak</span>
          <button class="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Resume
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Habits component logic will go here
</script>
