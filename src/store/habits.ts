import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '../lib/supabase';

export interface Habit {
  id: string;
  user_id: string;
  title: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateHabitData {
  title: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
}

export interface UpdateHabitData {
  title?: string;
  description?: string;
  frequency?: 'daily' | 'weekly' | 'monthly';
  is_active?: boolean;
}

export const useHabitsStore = defineStore('habits', () => {
  const habits = ref<Habit[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const activeHabits = computed(() =>
    habits.value.filter(habit => habit.is_active)
  );

  const inactiveHabits = computed(() =>
    habits.value.filter(habit => !habit.is_active)
  );

  // Fetch all habits for the current user
  const fetchHabits = async () => {
    try {
      loading.value = true;
      error.value = null;

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error: fetchError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      habits.value = data || [];
      return { success: true, data };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch habits';
      error.value = errorMessage;
      return { success: false, error: errorMessage };
    } finally {
      loading.value = false;
    }
  };

  // Create a new habit
  const createHabit = async (habitData: CreateHabitData) => {
    try {
      loading.value = true;
      error.value = null;

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error: createError } = await supabase
        .from('habits')
        .insert({
          user_id: user.id,
          title: habitData.title,
          description: habitData.description,
          frequency: habitData.frequency,
          is_active: true,
        })
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      habits.value.unshift(data);
      return { success: true, data };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create habit';
      error.value = errorMessage;
      return { success: false, error: errorMessage };
    } finally {
      loading.value = false;
    }
  };

  // Update an existing habit
  const updateHabit = async (habitId: string, updates: UpdateHabitData) => {
    try {
      loading.value = true;
      error.value = null;

      const { data, error: updateError } = await supabase
        .from('habits')
        .update(updates)
        .eq('id', habitId)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      const index = habits.value.findIndex(habit => habit.id === habitId);
      if (index !== -1) {
        habits.value[index] = data;
      }

      return { success: true, data };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update habit';
      error.value = errorMessage;
      return { success: false, error: errorMessage };
    } finally {
      loading.value = false;
    }
  };

  // Delete a habit
  const deleteHabit = async (habitId: string) => {
    try {
      loading.value = true;
      error.value = null;

      const { error: deleteError } = await supabase
        .from('habits')
        .delete()
        .eq('id', habitId);

      if (deleteError) {
        throw deleteError;
      }

      habits.value = habits.value.filter(habit => habit.id !== habitId);
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete habit';
      error.value = errorMessage;
      return { success: false, error: errorMessage };
    } finally {
      loading.value = false;
    }
  };

  // Toggle habit active status
  const toggleHabitStatus = async (habitId: string) => {
    const habit = habits.value.find(h => h.id === habitId);
    if (!habit) {
      return { success: false, error: 'Habit not found' };
    }

    return await updateHabit(habitId, { is_active: !habit.is_active });
  };

  // Clear error
  const clearError = () => {
    error.value = null;
  };

  return {
    habits,
    loading,
    error,
    activeHabits,
    inactiveHabits,
    fetchHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleHabitStatus,
    clearError,
  };
});
