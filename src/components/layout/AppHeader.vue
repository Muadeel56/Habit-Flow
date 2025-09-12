<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Mobile menu button -->
        <div class="flex items-center">
          <button
            @click="$emit('toggle-sidebar')"
            class="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            aria-label="Toggle sidebar"
          >
            <svg
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <!-- Logo and app name -->
          <div class="flex items-center ml-2 lg:ml-0">
            <div class="flex-shrink-0">
              <div
                class="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center"
              >
                <span class="text-white font-bold text-sm">HF</span>
              </div>
            </div>
            <h1
              class="ml-3 text-xl font-semibold text-gray-900 hidden sm:block"
            >
              Habit Flow
            </h1>
          </div>
        </div>

        <!-- Desktop navigation -->
        <nav class="hidden lg:flex space-x-8">
          <router-link
            to="/dashboard"
            class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            active-class="text-blue-600 bg-blue-50"
          >
            Dashboard
          </router-link>
          <router-link
            to="/habits"
            class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            active-class="text-blue-600 bg-blue-50"
          >
            Habits
          </router-link>
          <router-link
            to="/profile"
            class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            active-class="text-blue-600 bg-blue-50"
          >
            Profile
          </router-link>
        </nav>

        <!-- User menu -->
        <div class="flex items-center">
          <div class="relative">
            <button
              class="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="User menu"
            >
              <div
                class="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center"
              >
                <span class="text-gray-600 font-medium text-sm">U</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
defineEmits<{
  'toggle-sidebar': [];
}>();
</script>
