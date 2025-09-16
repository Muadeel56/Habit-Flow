<template>
  <div class="space-y-8">
    <!-- Consistent Page Header -->
    <PageHeader
      title="Profile"
      description="Manage your account settings and preferences"
    >
      <template #actions>
        <!-- User Avatar Preview -->
        <div
          class="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-4 text-white shadow-lg"
        >
          <div class="text-center">
            <div class="text-2xl font-bold">{{ getInitials() }}</div>
            <div class="text-sm text-purple-100">Your Avatar</div>
          </div>
        </div>
      </template>
    </PageHeader>

    <!-- Loading State -->
    <div v-if="profileStore.loading" class="max-w-4xl">
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8"
      >
        <div class="animate-pulse">
          <div class="flex items-center mb-8">
            <div
              class="h-20 w-20 bg-gray-200 dark:bg-gray-600 rounded-2xl"
            ></div>
            <div class="ml-6">
              <div
                class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-32 mb-2"
              ></div>
              <div class="h-3 bg-gray-200 dark:bg-gray-600 rounded w-24"></div>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="h-12 bg-gray-200 dark:bg-gray-600 rounded-xl"></div>
            <div class="h-12 bg-gray-200 dark:bg-gray-600 rounded-xl"></div>
            <div class="h-12 bg-gray-200 dark:bg-gray-600 rounded-xl"></div>
            <div class="h-12 bg-gray-200 dark:bg-gray-600 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="profileStore.error" class="max-w-4xl">
      <div
        class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6"
      >
        <div class="flex">
          <div class="flex-shrink-0">
            <svg
              class="h-6 w-6 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-4 flex-1">
            <h3 class="text-lg font-semibold text-red-800 dark:text-red-200">
              Error loading profile
            </h3>
            <p class="text-red-700 dark:text-red-300 mt-1">
              {{ profileStore.error }}
            </p>
            <button
              @click="profileStore.loadProfile"
              class="mt-4 bg-red-100 dark:bg-red-900/30 px-4 py-2 rounded-lg text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Profile Content -->
    <div v-else class="max-w-4xl space-y-8">
      <!-- Profile Information Card -->
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8"
      >
        <div class="flex items-center mb-8">
          <div
            class="h-20 w-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg"
          >
            {{ getInitials() }}
          </div>
          <div class="ml-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ profileStore.profile?.full_name || 'User' }}
            </h2>
            <p class="text-gray-600 dark:text-gray-400">
              {{ profileStore.profile?.email || 'No email provided' }}
            </p>
            <div class="flex items-center mt-2">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
              >
                <svg
                  class="w-3 h-3 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
                Active
              </span>
            </div>
          </div>
        </div>

        <form @submit.prevent="updateProfile" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                for="full_name"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Full Name
              </label>
              <input
                id="full_name"
                v-model="profileForm.full_name"
                type="text"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label
                for="email"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                v-model="profileForm.email"
                type="email"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                for="timezone"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Timezone
              </label>
              <select
                id="timezone"
                v-model="profileForm.timezone"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Europe/London">London</option>
                <option value="Europe/Paris">Paris</option>
                <option value="Asia/Tokyo">Tokyo</option>
                <option value="Asia/Shanghai">Shanghai</option>
                <option value="Australia/Sydney">Sydney</option>
              </select>
            </div>
            <div>
              <label
                for="preferred_language"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Language
              </label>
              <select
                id="preferred_language"
                v-model="profileForm.preferred_language"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="it">Italian</option>
                <option value="pt">Portuguese</option>
                <option value="ru">Russian</option>
                <option value="ja">Japanese</option>
                <option value="ko">Korean</option>
                <option value="zh">Chinese</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end">
            <button
              type="submit"
              :disabled="profileStore.loading"
              class="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-3 rounded-xl hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              {{ profileStore.loading ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Notification Preferences -->
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8"
      >
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">
              Notification Preferences
            </h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm">
              Customize how you receive notifications
            </p>
          </div>
          <div
            class="h-8 w-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center"
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
                d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L12.828 7H4.828z"
              />
            </svg>
          </div>
        </div>
        <NotificationSettings />
      </div>

      <!-- Account Actions -->
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8"
      >
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">
              Account Actions
            </h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm">
              Manage your account settings
            </p>
          </div>
          <div
            class="h-8 w-8 bg-gradient-to-r from-red-400 to-pink-500 rounded-lg flex items-center justify-center"
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
        </div>

        <div class="space-y-4">
          <div
            class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
          >
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white">
                Export Data
              </h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Download your habit data
              </p>
            </div>
            <button
              class="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
            >
              Export
            </button>
          </div>

          <div
            class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
          >
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white">
                Delete Account
              </h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Permanently delete your account
              </p>
            </div>
            <button
              class="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-4 py-2 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { useProfileStore } from '@/store/profile';
import PageHeader from '@/components/layout/PageHeader.vue';
import NotificationSettings from '@/components/profile/NotificationSettings.vue';

const profileStore = useProfileStore();

const profileForm = reactive({
  full_name: '',
  email: '',
  timezone: 'UTC',
  preferred_language: 'en',
});

const getInitials = () => {
  const name =
    profileForm.full_name || profileStore.profile?.full_name || 'User';
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const updateProfile = async () => {
  try {
    await profileStore.updateProfile(profileForm);
  } catch (error) {
    console.error('Failed to update profile:', error);
  }
};

onMounted(() => {
  profileStore.loadProfile();
  if (profileStore.profile) {
    Object.assign(profileForm, {
      full_name: profileStore.profile.full_name || '',
      email: profileStore.profile.email || '',
      timezone: profileStore.profile.timezone || 'UTC',
      preferred_language: profileStore.profile.preferred_language || 'en',
    });
  }
});
</script>
