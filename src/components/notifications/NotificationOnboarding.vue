<template>
  <div v-if="shouldShowOnboarding" class="notification-onboarding">
    <!-- Overlay -->
    <div
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
      <div
        class="onboarding-modal bg-card rounded-xl shadow-2xl max-w-md w-full mx-auto"
      >
        <!-- Header -->
        <div class="modal-header p-6 text-center border-b border-border">
          <div class="mb-4">
            <div
              class="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center"
            >
              <BellIcon class="h-8 w-8 text-primary" />
            </div>
          </div>
          <h3 class="text-xl font-semibold text-card-foreground">
            Enable Habit Reminders
          </h3>
          <p class="text-sm text-muted-foreground mt-2">
            Never miss a habit with timely notifications
          </p>
        </div>

        <!-- Content -->
        <div class="modal-content p-6">
          <div class="space-y-4">
            <!-- Benefits List -->
            <div class="benefits-list">
              <div class="flex items-start space-x-3 mb-3">
                <CheckCircleIcon
                  class="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0"
                />
                <div>
                  <p class="text-sm font-medium text-card-foreground">
                    Daily Reminders
                  </p>
                  <p class="text-xs text-muted-foreground">
                    Get notified at your preferred time
                  </p>
                </div>
              </div>

              <div class="flex items-start space-x-3 mb-3">
                <CheckCircleIcon
                  class="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0"
                />
                <div>
                  <p class="text-sm font-medium text-card-foreground">
                    Streak Celebrations
                  </p>
                  <p class="text-xs text-muted-foreground">
                    Celebrate your achievements
                  </p>
                </div>
              </div>

              <div class="flex items-start space-x-3 mb-3">
                <CheckCircleIcon
                  class="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0"
                />
                <div>
                  <p class="text-sm font-medium text-card-foreground">
                    Complete from Notifications
                  </p>
                  <p class="text-xs text-muted-foreground">
                    Mark habits complete without opening the app
                  </p>
                </div>
              </div>

              <div class="flex items-start space-x-3">
                <CheckCircleIcon
                  class="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0"
                />
                <div>
                  <p class="text-sm font-medium text-card-foreground">
                    Quiet Hours
                  </p>
                  <p class="text-xs text-muted-foreground">
                    Respect your sleep and focus time
                  </p>
                </div>
              </div>
            </div>

            <!-- Permission Status -->
            <div
              v-if="notificationsStore.permission.denied"
              class="permission-denied bg-red-50 border border-red-200 rounded-lg p-4"
            >
              <div class="flex items-center">
                <ExclamationTriangleIcon class="h-5 w-5 text-red-500 mr-3" />
                <div>
                  <p class="text-sm font-medium text-red-800">
                    Notifications Blocked
                  </p>
                  <p class="text-xs text-red-700 mt-1">
                    Please enable notifications in your browser settings
                  </p>
                </div>
              </div>
              <div class="mt-3">
                <button
                  @click="showBrowserInstructions"
                  class="text-xs text-red-700 underline hover:no-underline"
                >
                  Show me how →
                </button>
              </div>
            </div>

            <!-- Browser Instructions (shown when notifications are blocked) -->
            <div
              v-if="showInstructions"
              class="browser-instructions bg-muted rounded-lg p-4"
            >
              <h4 class="text-sm font-medium text-card-foreground mb-2">
                Enable Notifications in {{ browserName }}:
              </h4>
              <ol
                class="text-xs text-muted-foreground space-y-1 list-decimal list-inside"
              >
                <li
                  v-for="instruction in browserInstructions"
                  :key="instruction"
                >
                  {{ instruction }}
                </li>
              </ol>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="modal-actions p-6 border-t border-border">
          <div class="flex space-x-3">
            <button
              v-if="!notificationsStore.permission.denied"
              @click="enableNotifications"
              :disabled="notificationsStore.loading"
              class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {{
                notificationsStore.loading
                  ? 'Requesting...'
                  : 'Enable Notifications'
              }}
            </button>

            <button
              v-else
              @click="refreshPermission"
              class="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Check Again
            </button>

            <button
              @click="skipOnboarding"
              class="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              Maybe Later
            </button>
          </div>

          <div class="mt-3 text-center">
            <label
              class="flex items-center justify-center space-x-2 text-xs text-muted-foreground"
            >
              <input
                type="checkbox"
                v-model="dontShowAgain"
                class="h-3 w-3 text-blue-600 rounded focus:ring-blue-500"
              />
              <span>Don't show this again</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useNotificationsStore } from '@/store/notifications';
import {
  BellIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/vue/24/outline';

const notificationsStore = useNotificationsStore();

const showInstructions = ref(false);
const dontShowAgain = ref(false);

// Check if onboarding should be shown
const shouldShowOnboarding = computed(() => {
  // Don't show if user has already dismissed it
  if (
    typeof window !== 'undefined' &&
    window.localStorage.getItem('notification-onboarding-dismissed') === 'true'
  ) {
    return false;
  }

  // Don't show if notifications are already granted
  if (notificationsStore.permission.granted) {
    return false;
  }

  // Show for default permission state or if explicitly requested
  return (
    notificationsStore.permission.default ||
    notificationsStore.permission.denied
  );
});

// Detect browser for instructions
const browserName = computed(() => {
  if (typeof window === 'undefined') return 'your browser';
  const userAgent = window.navigator.userAgent;
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  return 'your browser';
});

const browserInstructions = computed(() => {
  const browser = browserName.value;

  switch (browser) {
    case 'Chrome':
      return [
        'Click the lock icon in the address bar',
        'Click "Notifications"',
        'Select "Allow"',
        'Refresh this page',
      ];
    case 'Firefox':
      return [
        'Click the shield icon in the address bar',
        'Click "Turn off Blocking"',
        'Allow notifications when prompted',
        'Refresh this page',
      ];
    case 'Safari':
      return [
        'Go to Safari > Preferences > Websites',
        'Click "Notifications" on the left',
        'Find this website and select "Allow"',
        'Refresh this page',
      ];
    case 'Edge':
      return [
        'Click the lock icon in the address bar',
        'Click "Permissions for this site"',
        'Set Notifications to "Allow"',
        'Refresh this page',
      ];
    default:
      return [
        'Look for a notification icon in your address bar',
        'Click it and select "Allow"',
        'Refresh this page if needed',
      ];
  }
});

// Methods
const enableNotifications = async () => {
  const result = await notificationsStore.requestPermission();

  if (result.success) {
    // Schedule initial reminders
    notificationsStore.scheduleHabitReminders();

    // Show success and close onboarding
    await notificationsStore.sendNotification('Notifications Enabled! 🎉', {
      body: "You'll now receive habit reminders at your scheduled times.",
      tag: 'onboarding-success',
    });

    skipOnboarding();
  }
};

const refreshPermission = async () => {
  await notificationsStore.initializePermissions();
  showInstructions.value = false;

  if (notificationsStore.permission.granted) {
    skipOnboarding();
  }
};

const showBrowserInstructions = () => {
  showInstructions.value = true;
};

const skipOnboarding = () => {
  if (dontShowAgain.value && typeof window !== 'undefined') {
    window.localStorage.setItem('notification-onboarding-dismissed', 'true');
  }

  // Emit close event or handle dismissal
  // In a real app, you might use a modal store or emit to parent
  console.log('Onboarding dismissed');
};

// Auto-dismiss if permissions are granted
const checkPermissionChange = () => {
  if (notificationsStore.permission.granted && shouldShowOnboarding.value) {
    skipOnboarding();
  }
};

onMounted(() => {
  notificationsStore.initializePermissions();

  // Watch for permission changes
  if (typeof window !== 'undefined') {
    setInterval(checkPermissionChange, 1000);
  }
});
</script>

<style scoped>
.onboarding-modal {
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.benefits-list {
  @apply space-y-3;
}

.permission-denied {
  @apply animate-pulse;
}

.browser-instructions {
  @apply border border-border;
}

.modal-actions {
  @apply bg-muted;
}
</style>
