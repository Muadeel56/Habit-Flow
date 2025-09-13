<template>
  <div class="notification-settings">
    <div class="mb-6 pb-4 border-b border-gray-200">
      <h3 class="text-lg font-semibold text-gray-900">Notification Settings</h3>
      <p class="text-sm text-gray-600 mt-1">
        Manage how and when you receive reminders for your habits
      </p>
    </div>

    <!-- Permission Status -->
    <div class="mb-6 p-4 rounded-lg" :class="permissionStatusClass">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <component :is="permissionIcon" class="h-5 w-5" />
          <div>
            <p class="font-medium">{{ permissionStatusText }}</p>
            <p class="text-sm opacity-80">{{ permissionStatusDescription }}</p>
          </div>
        </div>
        <button
          v-if="!notificationsStore.permission.granted"
          @click="requestNotificationPermission"
          :disabled="notificationsStore.loading"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ notificationsStore.loading ? 'Requesting...' : 'Enable' }}
        </button>
      </div>
    </div>

    <div class="space-y-6">
      <!-- Push Notifications Toggle -->
      <div class="p-4 bg-white rounded-lg border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <label class="text-sm font-medium text-gray-900">
              Browser Notifications
            </label>
            <p class="text-xs text-gray-600 mt-1">
              Receive push notifications in your browser
            </p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              v-model="localSettings.pushEnabled"
              @change="updateSetting('pushEnabled', $event.target.checked)"
              class="sr-only peer"
              :disabled="!notificationsStore.permission.granted"
            />
            <div
              class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
            ></div>
          </label>
        </div>
      </div>

      <!-- Email Notifications Toggle -->
      <div class="p-4 bg-white rounded-lg border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <label class="text-sm font-medium text-gray-900">
              Email Notifications
            </label>
            <p class="text-xs text-gray-600 mt-1">
              Receive habit reminders via email
            </p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              v-model="localSettings.emailEnabled"
              @change="updateSetting('emailEnabled', $event.target.checked)"
              class="sr-only peer"
            />
            <div
              class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
            ></div>
          </label>
        </div>
      </div>

      <!-- Reminder Time -->
      <div class="p-4 bg-white rounded-lg border border-gray-200">
        <label class="text-sm font-medium text-gray-900 mb-2 block">
          Daily Reminder Time
        </label>
        <p class="text-xs text-gray-600 mb-3">
          When should we remind you about your habits?
        </p>
        <input
          type="time"
          v-model="localSettings.reminderTime"
          @change="updateSetting('reminderTime', $event.target.value)"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <!-- Test Notification -->
      <div class="p-4 bg-white rounded-lg border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <label class="text-sm font-medium text-gray-900">
              Test Notifications
            </label>
            <p class="text-xs text-gray-600 mt-1">
              Send a test notification to verify your settings
            </p>
          </div>
          <button
            @click="sendTestNotification"
            :disabled="
              !notificationsStore.canSendNotifications ||
              notificationsStore.loading
            "
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send Test
          </button>
        </div>
      </div>
    </div>

    <!-- Error Display -->
    <div
      v-if="notificationsStore.error"
      class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
    >
      <div class="flex items-center space-x-2">
        <ExclamationTriangleIcon class="h-5 w-5 text-red-500" />
        <p class="text-sm text-red-700">
          {{ notificationsStore.error }}
        </p>
        <button
          @click="notificationsStore.clearError"
          class="ml-auto text-red-500 hover:text-red-700"
        >
          <XMarkIcon class="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useNotificationsStore } from '@/store/notifications';
import {
  ExclamationTriangleIcon,
  XMarkIcon,
  BellIcon,
  BellSlashIcon,
  ExclamationCircleIcon,
} from '@heroicons/vue/24/outline';

const notificationsStore = useNotificationsStore();
const showSuccessMessage = ref(false);

// Local settings state
const localSettings = ref({
  pushEnabled: false,
  emailEnabled: false,
  reminderTime: '09:00',
});

// Computed properties for permission status
const permissionStatusClass = computed(() => {
  if (notificationsStore.permission.granted) {
    return 'bg-green-50 border border-green-200 text-green-800';
  } else if (notificationsStore.permission.denied) {
    return 'bg-red-50 border border-red-200 text-red-800';
  } else {
    return 'bg-yellow-50 border border-yellow-200 text-yellow-800';
  }
});

const permissionIcon = computed(() => {
  if (notificationsStore.permission.granted) {
    return BellIcon;
  } else if (notificationsStore.permission.denied) {
    return BellSlashIcon;
  } else {
    return ExclamationCircleIcon;
  }
});

const permissionStatusText = computed(() => {
  if (notificationsStore.permission.granted) {
    return 'Notifications Enabled';
  } else if (notificationsStore.permission.denied) {
    return 'Notifications Blocked';
  } else {
    return 'Notifications Not Enabled';
  }
});

const permissionStatusDescription = computed(() => {
  if (notificationsStore.permission.granted) {
    return 'You will receive browser notifications for habit reminders';
  } else if (notificationsStore.permission.denied) {
    return 'Please enable notifications in your browser settings';
  } else {
    return 'Click "Enable" to allow browser notifications';
  }
});

// Initialize local settings from store
watch(
  () => notificationsStore.notificationSettings,
  settings => {
    if (settings) {
      localSettings.value = {
        pushEnabled: settings.pushEnabled,
        emailEnabled: settings.emailEnabled,
        reminderTime: settings.reminderTime.slice(0, 5), // Remove seconds for time input
      };
    }
  },
  { immediate: true }
);

// Request notification permission
const requestNotificationPermission = async () => {
  const result = await notificationsStore.requestPermission();
  if (result.success) {
    showSuccessMessage.value = true;

    setTimeout(() => {
      showSuccessMessage.value = false;
    }, 3000);
  }
};

// Update individual setting
const updateSetting = async (key: string, value: unknown) => {
  const settings: Record<string, unknown> = { [key]: value };

  // Add seconds back for time fields
  if (key === 'reminderTime') {
    settings[key] = value + ':00';
  }

  const result = await notificationsStore.updateNotificationSettings(settings);
  if (result.success) {
    showSuccessMessage.value = true;

    setTimeout(() => {
      showSuccessMessage.value = false;
    }, 3000);
  }
};

// Send test notification
const sendTestNotification = async () => {
  const result = await notificationsStore.sendTestNotification();
  if (result.success) {
    showSuccessMessage.value = true;

    setTimeout(() => {
      showSuccessMessage.value = false;
    }, 3000);
  }
};

// Initialize on mount
onMounted(async () => {
  await notificationsStore.initializePermissions();
});
</script>
