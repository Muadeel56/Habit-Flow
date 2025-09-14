/* eslint-env serviceworker */
// Service Worker for Habit Flow Notifications
const CACHE_NAME = 'habit-flow-v1';
const urlsToCache = [
  '/',
  '/vite.svg',
  // Add other static assets as needed
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Handle push events (for server-sent push notifications)
self.addEventListener('push', event => {
  console.log('Push event received:', event);

  let notificationData = {};

  if (event.data) {
    try {
      notificationData = event.data.json();
    } catch {
      notificationData = {
        title: 'Habit Reminder',
        body: event.data.text() || 'Time to complete your habit!',
      };
    }
  }

  const options = {
    body: notificationData.body || "Don't forget to complete your habit today!",
    icon: '/vite.svg',
    badge: '/vite.svg',
    tag: notificationData.tag || 'habit-reminder',
    data: notificationData.data || {},
    requireInteraction: false,
    actions: [
      {
        action: 'mark-complete',
        title: 'Mark Complete',
        icon: '/vite.svg',
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/vite.svg',
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(
      notificationData.title || 'Habit Reminder',
      options
    )
  );
});

// Handle notification click events
self.addEventListener('notificationclick', event => {
  console.log('Notification clicked:', event);

  event.notification.close();

  const action = event.action;
  const data = event.notification.data || {};

  if (action === 'mark-complete' && data.habitId) {
    // Handle marking habit as complete
    event.waitUntil(handleHabitCompletion(data.habitId));
  } else if (action === 'dismiss') {
    // Just close the notification (already done above)
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(clientList => {
        // Try to focus existing window
        for (const client of clientList) {
          if (client.url === self.location.origin && 'focus' in client) {
            return client.focus();
          }
        }

        // Open new window if no existing window found
        if (clients.openWindow) {
          const targetUrl = data.habitId
            ? `${self.location.origin}/habits?highlight=${data.habitId}`
            : self.location.origin;
          return clients.openWindow(targetUrl);
        }
      })
    );
  }
});

// Handle habit completion from notification action
async function handleHabitCompletion(habitId) {
  try {
    // Send message to all clients to handle habit completion
    const clientList = await clients.matchAll({ type: 'window' });

    clientList.forEach(client => {
      client.postMessage({
        type: 'COMPLETE_HABIT',
        habitId: habitId,
        source: 'notification',
      });
    });

    // Show success notification
    await self.registration.showNotification('Habit Completed! 🎉', {
      body: 'Great job! Your habit has been marked as complete.',
      icon: '/vite.svg',
      tag: 'habit-completed',
      requireInteraction: false,
    });
  } catch (error) {
    console.error('Error completing habit from notification:', error);

    // Show error notification
    await self.registration.showNotification('Error', {
      body: 'Could not complete habit. Please open the app.',
      icon: '/vite.svg',
      tag: 'habit-error',
    });
  }
}

// Handle background sync (for offline functionality)
self.addEventListener('sync', event => {
  console.log('Background sync event:', event.tag);

  if (event.tag === 'habit-completion-sync') {
    event.waitUntil(syncHabitCompletions());
  }
});

// Sync pending habit completions when back online
async function syncHabitCompletions() {
  try {
    // This would sync any pending habit completions stored in IndexedDB
    // For now, we'll just log it
    console.log('Syncing pending habit completions...');
  } catch (error) {
    console.error('Error syncing habit completions:', error);
  }
}

// Handle fetch events (for offline functionality)
self.addEventListener('fetch', event => {
  // Only handle GET requests for now
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other unsupported schemes
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      // Return cached version if available
      if (response) {
        return response;
      }

      // Otherwise fetch from network
      return fetch(event.request)
        .then(response => {
          // Don't cache non-successful responses or non-basic types
          if (
            !response ||
            response.status !== 200 ||
            response.type !== 'basic'
          ) {
            return response;
          }

          // Skip caching for chrome-extension requests
          if (event.request.url.startsWith('chrome-extension')) {
            return response;
          }

          // Clone the response for caching
          const responseToCache = response.clone();

          caches
            .open(CACHE_NAME)
            .then(cache => {
              try {
                cache.put(event.request, responseToCache);
              } catch (error) {
                console.warn(
                  'Failed to cache request:',
                  event.request.url,
                  error
                );
              }
            })
            .catch(error => {
              console.warn('Cache operation failed:', error);
            });

          return response;
        })
        .catch(error => {
          console.warn('Fetch failed:', event.request.url, error);
          // Return a fallback or just let it fail gracefully
          throw error;
        });
    })
  );
});
