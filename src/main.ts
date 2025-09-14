import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { pinia } from './store';
import router from './router';
import { useHabitsStore, useNotificationsStore, useThemeStore } from './store';

const app = createApp(App);

// Install Pinia
app.use(pinia);

// Initialize theme immediately after Pinia is installed
// This ensures theme is applied before any components render
const themeStore = useThemeStore();
themeStore.initTheme();

// Install Router
app.use(router);

// Initialize notifications and set up service worker message handling
const initializeNotifications = async () => {
  const notificationsStore = useNotificationsStore();
  const habitsStore = useHabitsStore();

  await notificationsStore.initializePermissions();

  // Handle service worker messages for habit completion from notifications
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', async event => {
      if (event.data && event.data.type === 'COMPLETE_HABIT') {
        const { habitId } = event.data;

        try {
          // Mark habit as completed
          const result = await habitsStore.markHabitCompleted(habitId);

          if (result.success) {
            console.log('Habit completed from notification:', habitId);

            // Show success notification
            await notificationsStore.sendNotification('Habit Completed! 🎉', {
              body: 'Great job! Your habit has been marked as complete.',
              tag: 'habit-completed-success',
            });
          } else {
            console.error(
              'Failed to complete habit from notification:',
              result.error
            );
          }
        } catch (error) {
          console.error('Error completing habit from notification:', error);
        }
      }
    });
  }
};

// Initialize notifications after a short delay to ensure stores are ready
setTimeout(initializeNotifications, 1000);

app.mount('#app');
