import type { Router } from 'vue-router';
import { useAuthStore } from '@/store/auth';

export function setupAuthGuards(router: Router) {
  // Guard for protected routes
  router.beforeEach(async (to, _from, next) => {
    const authStore = useAuthStore();

    // Wait for auth initialization to complete
    if (!authStore.initialized) {
      try {
        await authStore.initAuth();
        // Give a small delay to ensure Supabase session is fully loaded
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error('Auth initialization failed:', error);
        // If auth fails, allow navigation to continue
      }
    }

    // Check if route requires authentication
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

    if (requiresAuth && !authStore.isAuthenticated) {
      // Redirect to login if not authenticated
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      });
    } else if (
      (to.path === '/login' || to.path === '/signup') &&
      authStore.isAuthenticated
    ) {
      // Redirect to dashboard if already authenticated and trying to access auth pages
      next('/dashboard');
    } else {
      next();
    }
  });
}
