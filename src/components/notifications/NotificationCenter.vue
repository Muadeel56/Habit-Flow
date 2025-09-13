<template>
  <div class="notification-center">
    <div class="center-header">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        Notification Center
      </h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
        Manage your scheduled reminders and notifications
      </p>
    </div>

    <!-- Permission Status Banner -->
    <div
      v-if="!notificationsStore.permission.granted"
      class="permission-banner mb-6"
    >
      <div
        class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4"
      >
        <div class="flex items-center">
          <ExclamationTriangleIcon
            class="h-5 w-5 text-yellow-600 dark:text-yellow-400"
          />
          <div class="ml-3">
            <h4
              class="text-sm font-medium text-yellow-800 dark:text-yellow-200"
            >
              Notifications Not Enabled
            </h4>
            <p class="text-sm text-yellow-700 dark:text-yellow-300">
              Enable browser notifications to receive habit reminders
            </p>
          </div>
          <button
            @click="requestPermission"
            :disabled="notificationsStore.loading"
            class="ml-auto px-3 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 transition-colors text-sm"
          >
            Enable
          </button>
        </div>
      </div>
    </div>

    <!-- Notification Stats -->
    <div class="stats-grid mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div
        class="stat-card bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-center">
          <BellIcon class="h-8 w-8 text-blue-500" />
          <div class="ml-3">
            <p class="text-sm text-gray-600 dark:text-gray-400">Scheduled</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ notificationsStore.scheduledNotifications.length }}
            </p>
          </div>
        </div>
      </div>

      <div
        class="stat-card bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-center">
          <ClockIcon class="h-8 w-8 text-green-500" />
          <div class="ml-3">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Next Reminder
            </p>
            <p class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ nextReminderTime }}
            </p>
          </div>
        </div>
      </div>

      <div
        class="stat-card bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-center">
          <component
            :is="statusIcon"
            class="h-8 w-8"
            :class="statusIconColor"
          />
          <div class="ml-3">
            <p class="text-sm text-gray-600 dark:text-gray-400">Status</p>
            <p class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ notificationStatus }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Scheduled Notifications List -->
    <div class="scheduled-notifications">
      <div class="flex items-center justify-between mb-4">
        <h4 class="text-md font-medium text-gray-900 dark:text-white">
          Scheduled Reminders
        </h4>
        <div class="flex space-x-2">
          <button
            @click="refreshReminders"
            :disabled="notificationsStore.loading"
            class="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
          >
            <ArrowPathIcon class="h-4 w-4 inline mr-1" />
            Refresh
          </button>
          <button
            @click="clearAllNotifications"
            :disabled="
              notificationsStore.loading ||
              !notificationsStore.scheduledNotifications.length
            "
            class="px-3 py-2 text-sm bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-900/40 disabled:opacity-50 transition-colors"
          >
            <XMarkIcon class="h-4 w-4 inline mr-1" />
            Clear All
          </button>
        </div>
      </div>

      <div
        v-if="notificationsStore.scheduledNotifications.length === 0"
        class="empty-state"
      >
        <div
          class="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600"
        >
          <BellSlashIcon class="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-600 dark:text-gray-400">
            No scheduled notifications
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-500 mt-1">
            Notifications will appear here when you have active habits with
            reminders enabled
          </p>
        </div>
      </div>

      <div v-else class="notification-list space-y-3">
        <div
          v-for="notification in sortedNotifications"
          :key="notification.id"
          class="notification-item bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-3">
                <component
                  :is="getNotificationIcon(notification.type)"
                  class="h-5 w-5 text-blue-500"
                />
                <div>
                  <h5 class="font-medium text-gray-900 dark:text-white">
                    {{ notification.habitTitle }}
                  </h5>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ notification.message }}
                  </p>
                </div>
              </div>
              <div
                class="mt-2 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400"
              >
                <span class="flex items-center">
                  <CalendarIcon class="h-4 w-4 mr-1" />
                  {{ formatScheduledTime(notification.scheduledTime) }}
                </span>
                <span class="flex items-center">
                  <TagIcon class="h-4 w-4 mr-1" />
                  {{ notification.type }}
                </span>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span
                class="px-2 py-1 text-xs font-medium rounded-full"
                :class="getStatusBadgeClass(notification)"
              >
                {{ getTimeUntilNotification(notification.scheduledTime) }}
              </span>
              <button
                @click="cancelNotification(notification)"
                class="p-1 text-gray-400 hover:text-red-500 transition-colors"
                title="Cancel notification"
              >
                <XMarkIcon class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">
        Quick Actions
      </h4>
      <div class="flex flex-wrap gap-2">
        <button
          @click="sendTestNotification"
          :disabled="
            !notificationsStore.canSendNotifications ||
            notificationsStore.loading
          "
          class="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          Send Test Notification
        </button>
        <button
          @click="rescheduleAll"
          :disabled="notificationsStore.loading"
          class="px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          Reschedule All
        </button>
        <router-link
          to="/profile"
          class="px-3 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          Notification Settings
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useNotificationsStore } from '@/store/notifications';
import {
  BellIcon,
  BellSlashIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  ArrowPathIcon,
  CalendarIcon,
  TagIcon,
  FireIcon,
  TrophyIcon,
} from '@heroicons/vue/24/outline';

const notificationsStore = useNotificationsStore();

// Computed properties
const sortedNotifications = computed(() => {
  return [...notificationsStore.scheduledNotifications].sort(
    (a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime()
  );
});

const nextReminderTime = computed(() => {
  const next = sortedNotifications.value[0];
  if (!next) return 'None scheduled';

  const now = new Date();
  const timeDiff = next.scheduledTime.getTime() - now.getTime();

  if (timeDiff <= 0) return 'Overdue';
  if (timeDiff < 60 * 1000) return 'Less than 1 minute';
  if (timeDiff < 60 * 60 * 1000)
    return `${Math.floor(timeDiff / (60 * 1000))} minutes`;
  if (timeDiff < 24 * 60 * 60 * 1000)
    return `${Math.floor(timeDiff / (60 * 60 * 1000))} hours`;
  return `${Math.floor(timeDiff / (24 * 60 * 60 * 1000))} days`;
});

const notificationStatus = computed(() => {
  if (!notificationsStore.permission.granted) return 'Disabled';
  if (notificationsStore.isQuietHours) return 'Quiet Hours';
  if (notificationsStore.scheduledNotifications.length === 0)
    return 'No Reminders';
  return 'Active';
});

const statusIcon = computed(() => {
  if (!notificationsStore.permission.granted) return BellSlashIcon;
  if (notificationsStore.isQuietHours) return ClockIcon;
  return BellIcon;
});

const statusIconColor = computed(() => {
  if (!notificationsStore.permission.granted) return 'text-red-500';
  if (notificationsStore.isQuietHours) return 'text-yellow-500';
  return 'text-green-500';
});

// Methods
const requestPermission = async () => {
  await notificationsStore.requestPermission();
};

const refreshReminders = () => {
  notificationsStore.scheduleHabitReminders();
};

const clearAllNotifications = () => {
  notificationsStore.clearScheduledNotifications();
};

const sendTestNotification = () => {
  notificationsStore.sendTestNotification();
};

const rescheduleAll = () => {
  notificationsStore.scheduleHabitReminders();
};

const cancelNotification = (notification: Record<string, unknown>) => {
  // In a real implementation, you'd remove the specific notification
  console.log('Canceling notification:', notification.id);
};

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'reminder':
      return BellIcon;
    case 'streak':
      return FireIcon;
    case 'milestone':
      return TrophyIcon;
    default:
      return BellIcon;
  }
};

const formatScheduledTime = (scheduledTime: Date) => {
  return scheduledTime.toLocaleString();
};

const getTimeUntilNotification = (scheduledTime: Date) => {
  const now = new Date();
  const timeDiff = scheduledTime.getTime() - now.getTime();

  if (timeDiff <= 0) return 'Overdue';
  if (timeDiff < 60 * 1000) return '< 1m';
  if (timeDiff < 60 * 60 * 1000)
    return `${Math.floor(timeDiff / (60 * 1000))}m`;
  if (timeDiff < 24 * 60 * 60 * 1000)
    return `${Math.floor(timeDiff / (60 * 60 * 1000))}h`;
  return `${Math.floor(timeDiff / (24 * 60 * 60 * 1000))}d`;
};

const getStatusBadgeClass = (notification: Record<string, unknown>) => {
  const now = new Date();
  const timeDiff = notification.scheduledTime.getTime() - now.getTime();

  if (timeDiff <= 0) {
    return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
  } else if (timeDiff < 60 * 60 * 1000) {
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
  } else {
    return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
  }
};

// Initialize on mount
onMounted(() => {
  notificationsStore.initializePermissions();
});
</script>

<style scoped>
.center-header {
  @apply mb-6 pb-4 border-b border-gray-200 dark:border-gray-700;
}

.stat-card {
  @apply hover:shadow-md transition-shadow;
}

.notification-item {
  @apply hover:shadow-sm;
}

.empty-state {
  @apply my-8;
}

.quick-actions {
  @apply border border-gray-200 dark:border-gray-700;
}
</style>
