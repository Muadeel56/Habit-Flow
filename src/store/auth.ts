import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const session = ref<Session | null>(null);
  const loading = ref(false);
  const initialized = ref(false);
  const error = ref<string | null>(null);

  // User is authenticated if they have a valid user, regardless of initialization status
  const isAuthenticated = computed(() => !!user.value);

  // Initialize auth state
  const initAuth = async () => {
    if (initialized.value) {
      return; // Already initialized
    }

    try {
      loading.value = true;
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      if (currentSession) {
        session.value = currentSession;
        user.value = currentSession.user;

        // Schedule notifications for authenticated user
        await scheduleNotifications();
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, newSession) => {
        session.value = newSession;
        user.value = newSession?.user ?? null;

        // Schedule notifications when user signs in
        if (newSession?.user && event === 'SIGNED_IN') {
          await scheduleNotifications();
        }
      });

      initialized.value = true;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Failed to initialize auth';
      initialized.value = true; // Mark as initialized even if failed
    } finally {
      loading.value = false;
    }
  };

  // Helper function to schedule notifications
  const scheduleNotifications = async () => {
    try {
      // Dynamically import to avoid circular dependencies
      const { useNotificationsStore } = await import('./notifications');
      const notificationsStore = useNotificationsStore();
      notificationsStore.scheduleHabitReminders();
    } catch (error) {
      console.warn('Failed to schedule notifications:', error);
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string) => {
    try {
      loading.value = true;
      error.value = null;

      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        error.value = authError.message;
        return { success: false, error: authError.message };
      }

      return { success: true, data };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Sign up failed';
      error.value = errorMessage;
      return { success: false, error: errorMessage };
    } finally {
      loading.value = false;
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      loading.value = true;
      error.value = null;

      const { data, error: authError } = await supabase.auth.signInWithPassword(
        {
          email,
          password,
        }
      );

      if (authError) {
        error.value = authError.message;
        return { success: false, error: authError.message };
      }

      session.value = data.session;
      user.value = data.user;
      return { success: true, data };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Sign in failed';
      error.value = errorMessage;
      return { success: false, error: errorMessage };
    } finally {
      loading.value = false;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      loading.value = true;
      error.value = null;

      const { error: authError } = await supabase.auth.signOut();

      if (authError) {
        error.value = authError.message;
        return { success: false, error: authError.message };
      }

      session.value = null;
      user.value = null;
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Sign out failed';
      error.value = errorMessage;
      return { success: false, error: errorMessage };
    } finally {
      loading.value = false;
    }
  };

  // Clear error
  const clearError = () => {
    error.value = null;
  };

  return {
    user,
    session,
    loading,
    initialized,
    error,
    isAuthenticated,
    initAuth,
    signUp,
    signIn,
    signOut,
    clearError,
  };
});
