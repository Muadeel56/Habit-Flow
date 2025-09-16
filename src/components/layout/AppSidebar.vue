<template>
  <div>
    <!-- Mobile sidebar overlay -->
    <div
      v-if="isOpen"
      class="fixed inset-0 z-40 lg:hidden"
      @click="$emit('close')"
    >
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>
    </div>

    <!-- Sidebar -->
    <div
      :class="[
        'fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-900 shadow-2xl transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r border-gray-200 dark:border-gray-700',
        isOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <div class="flex flex-col h-full">
        <!-- Sidebar header -->
        <div
          class="flex items-center justify-between h-20 px-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-500 to-indigo-600"
        >
          <div class="flex items-center">
            <div
              class="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg"
            >
              <svg
                class="h-7 w-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <div class="ml-4">
              <h2 class="text-xl font-bold text-white">Habit Flow</h2>
              <p class="text-blue-100 text-sm">Track your progress</p>
            </div>
          </div>
          <button
            @click="$emit('close')"
            class="lg:hidden p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200"
            aria-label="Close sidebar"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- User Profile Section -->
        <div class="px-6 py-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center space-x-4">
            <div
              class="h-14 w-14 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <span class="text-white font-bold text-lg">{{
                userInitial
              }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p
                class="text-sm font-semibold text-gray-900 dark:text-white truncate"
              >
                {{ userEmail }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Active member
              </p>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-4 py-6 space-y-2">
          <!-- Main Navigation -->
          <div class="mb-8">
            <h3
              class="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3"
            >
              Main
            </h3>

            <router-link
              to="/dashboard"
              class="group flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
              active-class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
              @click="$emit('close')"
            >
              <div
                class="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 group-hover:bg-white/20 transition-all duration-200"
                :class="{ 'bg-white/20': $route.path === '/dashboard' }"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"
                  />
                </svg>
              </div>
              <div class="ml-4">
                <p class="font-medium">Dashboard</p>
                <p class="text-xs opacity-75">Overview & insights</p>
              </div>
            </router-link>

            <router-link
              to="/habits"
              class="group flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
              active-class="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
              @click="$emit('close')"
            >
              <div
                class="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 group-hover:bg-white/20 transition-all duration-200"
                :class="{ 'bg-white/20': $route.path === '/habits' }"
              >
                <svg
                  class="w-5 h-5"
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
                <p class="font-medium">Habits</p>
                <p class="text-xs opacity-75">Manage your habits</p>
              </div>
            </router-link>

            <router-link
              to="/achievements"
              class="group flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
              active-class="bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg"
              @click="$emit('close')"
            >
              <div
                class="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 group-hover:bg-white/20 transition-all duration-200"
                :class="{ 'bg-white/20': $route.path === '/achievements' }"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
              </div>
              <div class="ml-4">
                <p class="font-medium">Achievements</p>
                <p class="text-xs opacity-75">Your progress & badges</p>
              </div>
            </router-link>
          </div>

          <!-- Account Section -->
          <div>
            <h3
              class="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3"
            >
              Account
            </h3>

            <router-link
              to="/profile"
              class="group flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
              active-class="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
              @click="$emit('close')"
            >
              <div
                class="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 group-hover:bg-white/20 transition-all duration-200"
                :class="{ 'bg-white/20': $route.path === '/profile' }"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div class="ml-4">
                <p class="font-medium">Profile</p>
                <p class="text-xs opacity-75">Settings & preferences</p>
              </div>
            </router-link>
          </div>
        </nav>

        <!-- Sidebar footer -->
        <div class="p-6 border-t border-gray-200 dark:border-gray-700">
          <div
            class="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4"
          >
            <div class="flex items-center space-x-3">
              <div
                class="h-10 w-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center"
              >
                <svg
                  class="h-5 w-5 text-white"
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
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-gray-900 dark:text-white">
                  Keep going!
                </p>
                <p class="text-xs text-gray-600 dark:text-gray-400">
                  You're doing great
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
import { computed } from 'vue';
import { useAuthStore } from '@/store/auth';

defineProps<{
  isOpen: boolean;
}>();

defineEmits<{
  close: [];
}>();

const authStore = useAuthStore();

const userEmail = computed(() => {
  return authStore.user?.email || 'User';
});

const userInitial = computed(() => {
  return authStore.user?.email?.charAt(0).toUpperCase() || 'U';
});
</script>
