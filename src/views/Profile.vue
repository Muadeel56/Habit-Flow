<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-foreground">Profile</h1>
      <p class="mt-2 text-muted-foreground">
        Manage your account settings and preferences
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="profileStore.loading" class="max-w-2xl">
      <div class="bg-card rounded-lg shadow p-6">
        <div class="animate-pulse">
          <div class="flex items-center mb-6">
            <div class="h-16 w-16 bg-gray-300 rounded-full"></div>
            <div class="ml-4">
              <div class="h-4 bg-gray-300 rounded w-24"></div>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="h-10 bg-gray-300 rounded"></div>
            <div class="h-10 bg-gray-300 rounded"></div>
            <div class="h-10 bg-gray-300 rounded"></div>
            <div class="h-10 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="profileStore.error" class="max-w-2xl">
      <div
        class="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6"
      >
        <div class="flex">
          <div class="flex-shrink-0">
            <svg
              class="h-5 w-5 text-destructive"
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
          <div class="ml-3">
            <h3 class="text-sm font-medium text-destructive">
              Error loading profile
            </h3>
            <div class="mt-2 text-sm text-destructive/80">
              {{ profileStore.error }}
            </div>
            <div class="mt-3">
              <button
                @click="loadProfile"
                class="bg-destructive/10 text-destructive px-3 py-1 rounded text-sm hover:bg-destructive/20 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Profile Content -->
    <div v-else-if="profileStore.profile" class="max-w-2xl">
      <!-- Success Message -->
      <div
        v-if="showSuccessMessage"
        class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
      >
        <div class="flex">
          <div class="flex-shrink-0">
            <svg
              class="h-5 w-5 text-green-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-green-800">
              Profile updated successfully!
            </p>
          </div>
        </div>
      </div>

      <!-- Profile information -->
      <div class="bg-card rounded-lg shadow mb-6">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-foreground">
            Profile Information
          </h2>
        </div>
        <div class="p-6">
          <form @submit.prevent="saveProfile">
            <div class="flex items-center mb-6">
              <div class="relative">
                <div
                  v-if="profileStore.profile.avatar_url"
                  class="h-16 w-16 rounded-full overflow-hidden"
                >
                  <img
                    :src="profileStore.profile.avatar_url"
                    :alt="profileStore.fullName || 'User avatar'"
                    class="h-full w-full object-cover"
                  />
                </div>
                <div
                  v-else
                  class="h-16 w-16 bg-gray-300 rounded-full flex items-center justify-center"
                >
                  <span class="text-muted-foreground font-medium text-xl">
                    {{ getInitials() }}
                  </span>
                </div>
                <input
                  ref="avatarInput"
                  type="file"
                  accept="image/*"
                  @change="handleAvatarChange"
                  class="hidden"
                />
              </div>
              <div class="ml-4">
                <button
                  type="button"
                  @click="triggerAvatarUpload"
                  :disabled="profileStore.saving"
                  class="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ profileStore.saving ? 'Uploading...' : 'Change Photo' }}
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  v-model="formData.first_name"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  v-model="formData.last_name"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your last name"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  :value="profileStore.profile.email"
                  type="email"
                  disabled
                  class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p class="text-xs text-gray-500 mt-1">
                  Email cannot be changed
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  v-model="formData.phone"
                  type="tel"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div class="mt-6">
              <button
                type="submit"
                :disabled="profileStore.saving || !hasChanges"
                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ profileStore.saving ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Preferences -->
      <div class="bg-card rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-foreground">Preferences</h2>
        </div>
        <div class="p-6">
          <form @submit.prevent="savePreferences">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-medium text-foreground">
                    Weekly Reports
                  </h3>
                  <p class="text-sm text-gray-500">
                    Receive weekly progress summaries
                  </p>
                </div>
                <input
                  v-model="formData.weekly_reports"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>
            </div>

            <div class="mt-6">
              <button
                type="submit"
                :disabled="profileStore.saving || !hasPreferenceChanges"
                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ profileStore.saving ? 'Saving...' : 'Save Preferences' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Notification Settings -->
      <div class="bg-card rounded-lg shadow">
        <div class="p-6">
          <Suspense>
            <template #default>
              <NotificationSettings />
            </template>
            <template #fallback>
              <div class="space-y-4">
                <div class="h-6 bg-muted rounded w-1/3 animate-pulse"></div>
                <div class="space-y-2">
                  <div class="h-4 bg-muted rounded w-full animate-pulse"></div>
                  <div class="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                </div>
              </div>
            </template>
          </Suspense>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  computed,
  onMounted,
  watch,
  defineAsyncComponent,
} from 'vue';
import { useProfileStore } from '../store/profile';

// Lazy load component
const NotificationSettings = defineAsyncComponent(
  () => import('../components/profile/NotificationSettings.vue')
);

const profileStore = useProfileStore();
const showSuccessMessage = ref(false);
const avatarInput = ref<{ click: () => void } | null>(null);

// Form data
const formData = reactive({
  first_name: '',
  last_name: '',
  phone: '',
  email_notifications: true,
  daily_reminders: true,
  weekly_reports: false,
});

// Computed properties
const hasChanges = computed(() => {
  if (!profileStore.profile) return false;

  return (
    formData.first_name !== (profileStore.profile.first_name || '') ||
    formData.last_name !== (profileStore.profile.last_name || '') ||
    formData.phone !== (profileStore.profile.phone || '')
  );
});

const hasPreferenceChanges = computed(() => {
  if (!profileStore.profile) return false;

  return (
    formData.email_notifications !== profileStore.profile.email_notifications ||
    formData.daily_reminders !== profileStore.profile.daily_reminders ||
    formData.weekly_reports !== profileStore.profile.weekly_reports
  );
});

// Methods
const loadProfile = async () => {
  const result = await profileStore.fetchProfile();
  if (result.success && profileStore.profile) {
    updateFormData();
  }
};

const updateFormData = () => {
  if (profileStore.profile) {
    formData.first_name = profileStore.profile.first_name || '';
    formData.last_name = profileStore.profile.last_name || '';
    formData.phone = profileStore.profile.phone || '';
    formData.email_notifications = profileStore.profile.email_notifications;
    formData.daily_reminders = profileStore.profile.daily_reminders;
    formData.weekly_reports = profileStore.profile.weekly_reports;
  }
};

const triggerAvatarUpload = () => {
  if (avatarInput.value && typeof avatarInput.value.click === 'function') {
    avatarInput.value.click();
  }
};

const saveProfile = async () => {
  const updates = {
    first_name: formData.first_name || null,
    last_name: formData.last_name || null,
    phone: formData.phone || null,
  };

  const result = await profileStore.updateProfile(updates);
  if (result.success) {
    showSuccessMessage.value = true;
    window.setTimeout(() => {
      showSuccessMessage.value = false;
    }, 3000);
  }
};

const savePreferences = async () => {
  const updates = {
    email_notifications: formData.email_notifications,
    daily_reminders: formData.daily_reminders,
    weekly_reports: formData.weekly_reports,
  };

  const result = await profileStore.updateProfile(updates);
  if (result.success) {
    showSuccessMessage.value = true;
    window.setTimeout(() => {
      showSuccessMessage.value = false;
    }, 3000);
  }
};

const handleAvatarChange = async (event: Event) => {
  const input = event.target as {
    files?: { [key: number]: { size: number; type: string; name: string } };
  };
  const file = input.files?.[0];

  if (file) {
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      window.alert('File size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      window.alert('Please select an image file');
      return;
    }

    const result = await profileStore.uploadAvatar(file);
    if (result.success) {
      showSuccessMessage.value = true;
      window.setTimeout(() => {
        showSuccessMessage.value = false;
      }, 3000);
    }
  }
};

const getInitials = () => {
  if (!profileStore.profile) return 'U';

  const firstName = profileStore.profile.first_name || '';
  const lastName = profileStore.profile.last_name || '';

  if (firstName && lastName) {
    return (firstName[0] + lastName[0]).toUpperCase();
  } else if (firstName) {
    return firstName[0].toUpperCase();
  } else if (profileStore.profile.email) {
    return profileStore.profile.email[0].toUpperCase();
  }

  return 'U';
};

// Lifecycle hooks
onMounted(() => {
  loadProfile();
});

// Watch for profile changes and update form data
watch(
  () => profileStore.profile,
  newProfile => {
    if (newProfile) {
      updateFormData();
    }
  },
  { immediate: true }
);
</script>
