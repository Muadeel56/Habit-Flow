<template>
  <header
    class="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 backdrop-blur-sm bg-white/95 dark:bg-gray-900/95"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Mobile menu button and logo -->
        <div class="flex items-center">
          <button
            @click="$emit('toggle-sidebar')"
            class="lg:hidden p-2 rounded-xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all duration-200"
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

          <!-- Page title for mobile -->
          <div class="lg:hidden ml-4">
            <h1 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ pageTitle }}
            </h1>
          </div>
        </div>

        <!-- Desktop breadcrumb -->
        <div class="hidden lg:flex items-center space-x-2 text-sm">
          <span class="text-gray-500 dark:text-gray-400">Habit Flow</span>
          <svg
            class="h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
          <span class="text-gray-900 dark:text-white font-medium">{{
            pageTitle
          }}</span>
        </div>

        <!-- Right side actions -->
        <div class="flex items-center space-x-4">
          <!-- Notifications -->
          <button
            class="relative p-2 rounded-xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
          >
            <svg
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 17h5l-5 5v-5zM9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <!-- Notification badge -->
            <span
              class="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center"
            >
              <span class="text-xs text-white font-medium">3</span>
            </span>
          </button>

          <!-- Theme Toggle -->
          <ThemeToggle />

          <!-- User menu -->
          <div class="relative" ref="userMenuRef">
            <button
              @click="toggleUserMenu"
              class="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              aria-label="User menu"
            >
              <div
                class="h-8 w-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm"
              >
                <span class="text-white font-medium text-sm">{{
                  userInitial
                }}</span>
              </div>
              <div class="hidden sm:block text-left">
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ userEmail }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Online</p>
              </div>
              <svg
                class="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <!-- Dropdown menu -->
            <div
              v-if="isUserMenuOpen"
              class="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg py-2 z-50 border border-gray-200 dark:border-gray-700 backdrop-blur-sm"
            >
              <!-- User info -->
              <div
                class="px-4 py-3 border-b border-gray-200 dark:border-gray-700"
              >
                <div class="flex items-center space-x-3">
                  <div
                    class="h-10 w-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center"
                  >
                    <span class="text-white font-medium">{{
                      userInitial
                    }}</span>
                  </div>
                  <div>
                    <p
                      class="text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      {{ userEmail }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      Premium member
                    </p>
                  </div>
                </div>
              </div>

              <!-- Menu items -->
              <div class="py-2">
                <router-link
                  to="/profile"
                  class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  @click="isUserMenuOpen = false"
                >
                  <svg
                    class="h-4 w-4 mr-3"
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
                  Profile Settings
                </router-link>

                <button
                  class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg
                    class="h-4 w-4 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Preferences
                </button>
              </div>

              <!-- Sign out -->
              <div class="border-t border-gray-200 dark:border-gray-700 pt-2">
                <button
                  @click="handleLogout"
                  class="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <svg
                    class="h-4 w-4 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import ThemeToggle from '@/components/theme/ThemeToggle.vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const isUserMenuOpen = ref(false);
const userMenuRef = ref<HTMLElement>();

const userEmail = computed(() => {
  return authStore.user?.email || 'User';
});

const userInitial = computed(() => {
  return authStore.user?.email?.charAt(0).toUpperCase() || 'U';
});

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/habits': 'Habits',
    '/achievements': 'Achievements',
    '/profile': 'Profile',
  };
  return titles[route.path] || 'Habit Flow';
});

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value;
};

const handleLogout = async () => {
  await authStore.signOut();
  router.push('/login');
  isUserMenuOpen.value = false;
};

const handleClickOutside = (event: Event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    isUserMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

defineEmits<{
  'toggle-sidebar': [];
}>();
</script>
