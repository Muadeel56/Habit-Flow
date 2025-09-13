import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './auth';
import { useProfileStore } from './profile';
import { useHabitsStore } from './habits';

export interface NotificationPermission {
  granted: boolean;
  denied: boolean;
  default: boolean;
}

export interface ScheduledNotification {
  id: string;
  habitId: string;
  habitTitle: string;
  scheduledTime: Date;
  type: 'reminder' | 'streak' | 'milestone';
  message: string;
}

export interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  soundEnabled: boolean;
  reminderTime: string;
  reminderDays: number[];
  quietHoursStart: string;
  quietHoursEnd: string;
  timezone: string;
}

export const useNotificationsStore = defineStore('notifications', () => {
  const authStore = useAuthStore();
  const profileStore = useProfileStore();
  const habitsStore = useHabitsStore();

  const permission = ref<NotificationPermission>({
    granted: false,
    denied: false,
    default: true,
  });
  const loading = ref(false);
  const error = ref<string | null>(null);
  const scheduledNotifications = ref<ScheduledNotification[]>([]);
  const serviceWorkerRegistration = ref<ServiceWorkerRegistration | null>(null);

  // Computed properties
  const canSendNotifications = computed(() => permission.value.granted);
  const notificationSettings = computed((): NotificationSettings | null => {
    if (!profileStore.profile) return null;
    return {
      pushEnabled: profileStore.profile.push_notifications,
      emailEnabled: profileStore.profile.email_notifications,
      soundEnabled: profileStore.profile.notification_sound,
      reminderTime: profileStore.profile.reminder_time,
      reminderDays: profileStore.profile.reminder_days,
      quietHoursStart: profileStore.profile.quiet_hours_start,
      quietHoursEnd: profileStore.profile.quiet_hours_end,
      timezone: profileStore.profile.timezone,
    };
  });

  // Check if current time is within quiet hours
  const isQuietHours = computed(() => {
    if (!notificationSettings.value) return false;

    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 8); // HH:MM:SS format
    const { quietHoursStart, quietHoursEnd } = notificationSettings.value;

    // Handle overnight quiet hours (e.g., 22:00 to 08:00)
    if (quietHoursStart > quietHoursEnd) {
      return currentTime >= quietHoursStart || currentTime <= quietHoursEnd;
    }
    // Handle same-day quiet hours (e.g., 12:00 to 14:00)
    return currentTime >= quietHoursStart && currentTime <= quietHoursEnd;
  });

  // Initialize notification permission status
  const initializePermissions = async () => {
    if (!('Notification' in window)) {
      error.value = 'This browser does not support notifications';
      return { success: false, error: 'Notifications not supported' };
    }

    const currentPermission = Notification.permission;
    permission.value = {
      granted: currentPermission === 'granted',
      denied: currentPermission === 'denied',
      default: currentPermission === 'default',
    };

    return { success: true };
  };

  // Request notification permission
  const requestPermission = async () => {
    if (!('Notification' in window)) {
      error.value = 'This browser does not support notifications';
      return { success: false, error: 'Notifications not supported' };
    }

    try {
      loading.value = true;
      const result = await Notification.requestPermission();

      permission.value = {
        granted: result === 'granted',
        denied: result === 'denied',
        default: result === 'default',
      };

      if (result === 'granted') {
        await registerServiceWorker();
        return { success: true };
      } else {
        error.value = 'Notification permission denied';
        return { success: false, error: 'Permission denied' };
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to request permission';
      error.value = errorMessage;
      return { success: false, error: errorMessage };
    } finally {
      loading.value = false;
    }
  };

  // Register service worker for push notifications
  const registerServiceWorker = async () => {
    if (!('serviceWorker' in navigator)) {
      error.value = 'Service workers not supported';
      return { success: false, error: 'Service workers not supported' };
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      serviceWorkerRegistration.value = registration;
      return { success: true, registration };
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to register service worker';
      error.value = errorMessage;
      return { success: false, error: errorMessage };
    }
  };

  // Send immediate notification
  const sendNotification = async (
    title: string,
    options?: NotificationOptions
  ) => {
    if (!canSendNotifications.value) {
      return { success: false, error: 'Notifications not permitted' };
    }

    if (isQuietHours.value) {
      console.log('Notification suppressed due to quiet hours');
      return { success: false, error: 'Quiet hours active' };
    }

    try {
      const notification = new Notification(title, {
        icon: '/vite.svg',
        badge: '/vite.svg',
        tag: 'habit-reminder',
        requireInteraction: false,
        ...options,
      });

      // Play sound if enabled
      if (notificationSettings.value?.soundEnabled) {
        // You can add a notification sound here
        // const audio = new Audio('/notification-sound.mp3');
        // audio.play().catch(() => {}); // Ignore errors
      }

      return { success: true, notification };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to send notification';
      error.value = errorMessage;
      return { success: false, error: errorMessage };
    }
  };

  // Schedule habit reminders
  const scheduleHabitReminders = () => {
    if (!notificationSettings.value || !habitsStore.habits.length) {
      return;
    }

    // Clear existing scheduled notifications
    clearScheduledNotifications();

    const { reminderTime, reminderDays } = notificationSettings.value;
    const [hours, minutes] = reminderTime.split(':').map(Number);

    habitsStore.habits
      .filter(habit => habit.is_active)
      .forEach(habit => {
        reminderDays.forEach(dayOfWeek => {
          const scheduledTime = new Date();

          // Set to the next occurrence of this day and time
          const currentDay = scheduledTime.getDay();
          const targetDay = dayOfWeek === 7 ? 0 : dayOfWeek; // Convert Sunday from 7 to 0

          let daysUntilTarget = (targetDay - currentDay + 7) % 7;
          if (
            daysUntilTarget === 0 &&
            scheduledTime.getHours() * 60 + scheduledTime.getMinutes() >=
              hours * 60 + minutes
          ) {
            daysUntilTarget = 7; // Schedule for next week if time has passed today
          }

          scheduledTime.setDate(scheduledTime.getDate() + daysUntilTarget);
          scheduledTime.setHours(hours, minutes, 0, 0);

          const timeUntilNotification = scheduledTime.getTime() - Date.now();

          if (timeUntilNotification > 0) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const timeoutId = setTimeout(() => {
              sendNotification(`Time for ${habit.title}!`, {
                body:
                  habit.description ||
                  "Don't forget to complete your habit today.",
                tag: `habit-${habit.id}`,
                data: { habitId: habit.id, type: 'reminder' },
              });
            }, timeUntilNotification);

            scheduledNotifications.value.push({
              id: `${habit.id}-${dayOfWeek}`,
              habitId: habit.id,
              habitTitle: habit.title,
              scheduledTime,
              type: 'reminder',
              message: `Time for ${habit.title}!`,
            });
          }
        });
      });
  };

  // Clear all scheduled notifications
  const clearScheduledNotifications = () => {
    scheduledNotifications.value = [];
    // Note: In a real implementation, you'd store timeout IDs and clear them
  };

  // Send streak milestone notifications
  const sendStreakNotification = async (
    habitTitle: string,
    streakCount: number
  ) => {
    const milestones = [3, 7, 14, 30, 60, 100];

    if (milestones.includes(streakCount)) {
      // Send browser notification
      await sendNotification(`🔥 ${streakCount}-day streak!`, {
        body: `Amazing! You've maintained ${habitTitle} for ${streakCount} days in a row!`,
        tag: `streak-${streakCount}`,
        data: { type: 'streak', streakCount, habitTitle },
      });

      // Send email notification if enabled
      if (notificationSettings.value?.emailEnabled) {
        await sendEmailNotification({
          type: 'streak',
          habitTitle,
          streakCount,
          subject: `🔥 ${streakCount}-day streak with ${habitTitle}!`,
        });
      }
    }
  };

  // Send email notification via Supabase Edge Function
  const sendEmailNotification = async (emailData: {
    type: 'reminder' | 'streak' | 'weekly_report';
    habitTitle: string;
    habitDescription?: string;
    streakCount?: number;
    subject: string;
  }) => {
    if (!authStore.user || !profileStore.profile) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const { data, error: functionError } = await supabase.functions.invoke(
        'send-email-notification',
        {
          body: {
            to: profileStore.profile.email,
            subject: emailData.subject,
            habitTitle: emailData.habitTitle,
            habitDescription: emailData.habitDescription,
            type: emailData.type,
            streakCount: emailData.streakCount,
            userName: profileStore.fullName || profileStore.profile.first_name,
          },
        }
      );

      if (functionError) {
        console.error('Email notification error:', functionError);
        return { success: false, error: functionError.message };
      }

      return { success: true, data };
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to send email notification';
      console.error('Email notification error:', errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Send habit reminder email
  const sendHabitReminderEmail = async (
    habitTitle: string,
    habitDescription?: string
  ) => {
    if (!notificationSettings.value?.emailEnabled) {
      return { success: false, error: 'Email notifications disabled' };
    }

    return await sendEmailNotification({
      type: 'reminder',
      habitTitle,
      habitDescription,
      subject: `⏰ Time for ${habitTitle}!`,
    });
  };

  // Update notification settings (wrapper for profile updates)
  const updateNotificationSettings = async (
    settings: Partial<NotificationSettings>
  ) => {
    const profileUpdates: Record<string, unknown> = {};

    if (settings.pushEnabled !== undefined)
      profileUpdates.push_notifications = settings.pushEnabled;
    if (settings.emailEnabled !== undefined)
      profileUpdates.email_notifications = settings.emailEnabled;
    if (settings.soundEnabled !== undefined)
      profileUpdates.notification_sound = settings.soundEnabled;
    if (settings.reminderTime !== undefined)
      profileUpdates.reminder_time = settings.reminderTime;
    if (settings.reminderDays !== undefined)
      profileUpdates.reminder_days = settings.reminderDays;
    if (settings.quietHoursStart !== undefined)
      profileUpdates.quiet_hours_start = settings.quietHoursStart;
    if (settings.quietHoursEnd !== undefined)
      profileUpdates.quiet_hours_end = settings.quietHoursEnd;
    if (settings.timezone !== undefined)
      profileUpdates.timezone = settings.timezone;

    const result = await profileStore.updateProfile(profileUpdates);

    if (result.success) {
      // Reschedule notifications with new settings
      scheduleHabitReminders();
    }

    return result;
  };

  // Test notification
  const sendTestNotification = async () => {
    return await sendNotification('Test Notification', {
      body: 'Your notifications are working correctly!',
      tag: 'test-notification',
    });
  };

  // Clear error
  const clearError = () => {
    error.value = null;
  };

  return {
    // State
    permission,
    loading,
    error,
    scheduledNotifications,
    serviceWorkerRegistration,

    // Computed
    canSendNotifications,
    notificationSettings,
    isQuietHours,

    // Actions
    initializePermissions,
    requestPermission,
    registerServiceWorker,
    sendNotification,
    scheduleHabitReminders,
    clearScheduledNotifications,
    sendStreakNotification,
    updateNotificationSettings,
    sendTestNotification,
    sendEmailNotification,
    sendHabitReminderEmail,
    clearError,
  };
});
