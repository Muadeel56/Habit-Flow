import type { Router } from 'vue-router';
import { useAuthStore } from '@/store/auth';

export function setupAuthGuards(router: Router) {
  // Guard for protected routes
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();

    // Initialize auth if not already done
    if (!authStore.user && !authStore.loading) {
      await authStore.initAuth();
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
