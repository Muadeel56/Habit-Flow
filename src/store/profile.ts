import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './auth';

export interface UserProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  email_notifications: boolean;
  daily_reminders: boolean;
  weekly_reports: boolean;
  // New notification preferences
  push_notifications: boolean;
  reminder_time: string; // TIME stored as string in HH:MM:SS format
  reminder_days: number[]; // Array of day numbers (1=Monday, 7=Sunday)
  notification_sound: boolean;
  quiet_hours_start: string; // TIME stored as string
  quiet_hours_end: string; // TIME stored as string
  timezone: string;
  created_at: string;
  updated_at: string;
}

export const useProfileStore = defineStore('profile', () => {
  const authStore = useAuthStore();

  const profile = ref<UserProfile | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const saving = ref(false);

  const isProfileLoaded = computed(() => !!profile.value);
  const fullName = computed(() => {
    if (!profile.value) return '';
    const { first_name, last_name } = profile.value;
    return [first_name, last_name].filter(Boolean).join(' ');
  });

  // Fetch user profile from database
  const fetchProfile = async () => {
    if (!authStore.user) {
      error.value = 'User not authenticated';
      return { success: false, error: 'User not authenticated' };
    }

    try {
      loading.value = true;
      error.value = null;

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authStore.user.id)
        .single();

      if (fetchError) {
        // If profile doesn't exist, create a default one
        if (fetchError.code === 'PGRST116') {
          return await createDefaultProfile();
        }
        error.value = fetchError.message;
        return { success: false, error: fetchError.message };
      }

      profile.value = data;
      return { success: true, data };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch profile';
      error.value = errorMessage;
      return { success: false, error: errorMessage };
    } finally {
      loading.value = false;
    }
  };

  // Create default profile for new user
  const createDefaultProfile = async () => {
    if (!authStore.user) {
      error.value = 'User not authenticated';
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const defaultProfile: Partial<UserProfile> = {
        id: authStore.user.id,
        email: authStore.user.email || '',
        first_name: null,
        last_name: null,
        phone: null,
        avatar_url: null,
        email_notifications: true,
        daily_reminders: true,
        weekly_reports: false,
        // New notification preferences defaults
        push_notifications: true,
        reminder_time: '09:00:00',
        reminder_days: [1, 2, 3, 4, 5, 6, 7], // All days of the week
        notification_sound: true,
        quiet_hours_start: '22:00:00',
        quiet_hours_end: '08:00:00',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      };

      const { data, error: createError } = await supabase
        .from('profiles')
        .insert(defaultProfile)
        .select()
        .single();

      if (createError) {
        error.value = createError.message;
        return { success: false, error: createError.message };
      }

      profile.value = data;
      return { success: true, data };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create profile';
      error.value = errorMessage;
      return { success: false, error: errorMessage };
    }
  };

  // Update user profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!authStore.user || !profile.value) {
      error.value = 'User not authenticated or profile not loaded';
      return {
        success: false,
        error: 'User not authenticated or profile not loaded',
      };
    }

    try {
      saving.value = true;
      error.value = null;

      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', authStore.user.id)
        .select()
        .single();

      if (updateError) {
        error.value = updateError.message;
        return { success: false, error: updateError.message };
      }

      profile.value = data;
      return { success: true, data };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update profile';
      error.value = errorMessage;
      return { success: false, error: errorMessage };
    } finally {
      saving.value = false;
    }
  };

  // Upload avatar
  const uploadAvatar = async (file: File) => {
    if (!authStore.user) {
      error.value = 'User not authenticated';
      return { success: false, error: 'User not authenticated' };
    }

    try {
      saving.value = true;
      error.value = null;

      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${authStore.user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        error.value = uploadError.message;
        return { success: false, error: uploadError.message };
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(filePath);

      // Update profile with new avatar URL
      const result = await updateProfile({ avatar_url: publicUrl });

      if (result.success) {
        return { success: true, data: { avatar_url: publicUrl } };
      } else {
        return result;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to upload avatar';
      error.value = errorMessage;
      return { success: false, error: errorMessage };
    } finally {
      saving.value = false;
    }
  };

  // Clear error
  const clearError = () => {
    error.value = null;
  };

  // Reset profile state
  const resetProfile = () => {
    profile.value = null;
    loading.value = false;
    error.value = null;
    saving.value = false;
  };

  return {
    profile,
    loading,
    error,
    saving,
    isProfileLoaded,
    fullName,
    fetchProfile,
    updateProfile,
    uploadAvatar,
    clearError,
    resetProfile,
  };
});
