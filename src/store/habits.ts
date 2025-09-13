import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '../lib/supabase';
import { useAchievementsStore } from './achievements';

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

export interface HabitCompletion {
  id: string;
  habit_id: string;
  user_id: string;
  completed_date: string;
  completed_at: string;
  notes?: string;
  created_at: string;
}

export interface HabitStreak {
  id: string;
  habit_id: string;
  user_id: string;
  current_streak: number;
  best_streak: number;
  last_completed_date?: string;
  updated_at: string;
}

export interface HabitWithStreak extends Habit {
  streak?: HabitStreak;
  is_completed_today?: boolean;
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

// Filter and Sort interfaces
export type HabitFilterStatus =
  | 'all'
  | 'active'
  | 'inactive'
  | 'completed_today'
  | 'not_completed_today';
export type HabitFilterFrequency = 'all' | 'daily' | 'weekly' | 'monthly';
export type HabitSortBy =
  | 'name'
  | 'frequency'
  | 'status'
  | 'current_streak'
  | 'best_streak'
  | 'created_at';
export type HabitSortOrder = 'asc' | 'desc';

export interface HabitFilters {
  status: HabitFilterStatus;
  frequency: HabitFilterFrequency;
  search: string;
}

export interface HabitSort {
  by: HabitSortBy;
  order: HabitSortOrder;
}

export const useHabitsStore = defineStore('habits', () => {
  const habits = ref<Habit[]>([]);
  const habitCompletions = ref<HabitCompletion[]>([]);
  const habitStreaks = ref<HabitStreak[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Filter and Sort state
  const filters = ref<HabitFilters>({
    status: 'all',
    frequency: 'all',
    search: '',
  });

  const sort = ref<HabitSort>({
    by: 'created_at',
    order: 'desc',
  });

  const activeHabits = computed(() =>
    habits.value.filter(habit => habit.is_active)
  );

  const inactiveHabits = computed(() =>
    habits.value.filter(habit => !habit.is_active)
  );

  // Get habits with streak information and today's completion status
  const habitsWithStreaks = computed((): HabitWithStreak[] => {
    const today = new Date().toISOString().split('T')[0];

    return habits.value.map(habit => {
      const streak = habitStreaks.value.find(s => s.habit_id === habit.id);
      const isCompletedToday = habitCompletions.value.some(
        completion =>
          completion.habit_id === habit.id &&
          completion.completed_date === today
      );

      return {
        ...habit,
        streak,
        is_completed_today: isCompletedToday,
      };
    });
  });

  // Filtered and sorted habits
  const filteredAndSortedHabits = computed((): HabitWithStreak[] => {
    let result = [...habitsWithStreaks.value];

    // Apply filters
    // Status filter
    switch (filters.value.status) {
      case 'active':
        result = result.filter(habit => habit.is_active);
        break;
      case 'inactive':
        result = result.filter(habit => !habit.is_active);
        break;
      case 'completed_today':
        result = result.filter(habit => habit.is_completed_today);
        break;
      case 'not_completed_today':
        result = result.filter(
          habit => !habit.is_completed_today && habit.is_active
        );
        break;
    }

    // Frequency filter
    if (filters.value.frequency !== 'all') {
      result = result.filter(
        habit => habit.frequency === filters.value.frequency
      );
    }

    // Search filter
    if (filters.value.search.trim()) {
      const searchTerm = filters.value.search.toLowerCase().trim();
      result = result.filter(
        habit =>
          habit.title.toLowerCase().includes(searchTerm) ||
          habit.description.toLowerCase().includes(searchTerm)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;

      switch (sort.value.by) {
        case 'name':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'frequency': {
          const frequencyOrder = { daily: 1, weekly: 2, monthly: 3 };
          comparison =
            frequencyOrder[a.frequency] - frequencyOrder[b.frequency];
          break;
        }
        case 'status':
          if (a.is_active && !b.is_active) comparison = -1;
          else if (!a.is_active && b.is_active) comparison = 1;
          else comparison = 0;
          break;
        case 'current_streak':
          comparison =
            (a.streak?.current_streak || 0) - (b.streak?.current_streak || 0);
          break;
        case 'best_streak':
          comparison =
            (a.streak?.best_streak || 0) - (b.streak?.best_streak || 0);
          break;
        case 'created_at':
        default:
          comparison =
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
      }

      return sort.value.order === 'asc' ? comparison : -comparison;
    });

    return result;
  });

  // Filter and Sort actions
  const updateFilters = (newFilters: Partial<HabitFilters>) => {
    filters.value = { ...filters.value, ...newFilters };
  };

  const updateSort = (newSort: Partial<HabitSort>) => {
    sort.value = { ...sort.value, ...newSort };
  };

  const resetFilters = () => {
    filters.value = {
      status: 'all',
      frequency: 'all',
      search: '',
    };
  };

  const resetSort = () => {
    sort.value = {
      by: 'created_at',
      order: 'desc',
    };
  };

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

  // Fetch habit completions for a specific date range
  const fetchHabitCompletions = async (
    startDate?: string,
    endDate?: string
  ) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      let query = supabase
        .from('habit_completions')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_date', { ascending: false });

      if (startDate) {
        query = query.gte('completed_date', startDate);
      }
      if (endDate) {
        query = query.lte('completed_date', endDate);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      habitCompletions.value = data || [];
      return { success: true, data };
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to fetch habit completions';
      error.value = errorMessage;
      return { success: false, error: errorMessage };
    }
  };

  // Fetch habit streaks for the current user
  const fetchHabitStreaks = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error: fetchError } = await supabase
        .from('habit_streaks')
        .select('*')
        .eq('user_id', user.id);

      if (fetchError) {
        throw fetchError;
      }

      habitStreaks.value = data || [];
      return { success: true, data };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch habit streaks';
      error.value = errorMessage;
      return { success: false, error: errorMessage };
    }
  };

  // Mark a habit as completed for today
  const markHabitCompleted = async (habitId: string, notes?: string) => {
    try {
      loading.value = true;
      error.value = null;

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const today = new Date().toISOString().split('T')[0];

      // Check if already completed today
      const existingCompletion = habitCompletions.value.find(
        completion =>
          completion.habit_id === habitId && completion.completed_date === today
      );

      if (existingCompletion) {
        return { success: false, error: 'Habit already completed today' };
      }

      const { data, error: insertError } = await supabase
        .from('habit_completions')
        .insert({
          habit_id: habitId,
          user_id: user.id,
          completed_date: today,
          notes: notes || null,
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // Add to local state
      habitCompletions.value.unshift(data);

      // Refresh streaks to get updated values
      await fetchHabitStreaks();

      // Check for new achievements
      const achievementsStore = useAchievementsStore();
      await achievementsStore.checkForNewAchievements();

      return { success: true, data };
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to mark habit as completed';
      error.value = errorMessage;
      return { success: false, error: errorMessage };
    } finally {
      loading.value = false;
    }
  };

  // Unmark a habit as completed for today
  const unmarkHabitCompleted = async (habitId: string) => {
    try {
      loading.value = true;
      error.value = null;

      const today = new Date().toISOString().split('T')[0];

      const { error: deleteError } = await supabase
        .from('habit_completions')
        .delete()
        .eq('habit_id', habitId)
        .eq('completed_date', today);

      if (deleteError) {
        throw deleteError;
      }

      // Remove from local state
      habitCompletions.value = habitCompletions.value.filter(
        completion =>
          !(
            completion.habit_id === habitId &&
            completion.completed_date === today
          )
      );

      // Refresh streaks to get updated values
      await fetchHabitStreaks();

      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to unmark habit as completed';
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

  // Initialize all data
  const initializeData = async () => {
    await Promise.all([
      fetchHabits(),
      fetchHabitCompletions(),
      fetchHabitStreaks(),
    ]);
  };

  // Clear error
  const clearError = () => {
    error.value = null;
  };

  return {
    // State
    habits,
    habitCompletions,
    habitStreaks,
    loading,
    error,
    filters,
    sort,

    // Computed
    activeHabits,
    inactiveHabits,
    habitsWithStreaks,
    filteredAndSortedHabits,

    // Actions
    fetchHabits,
    fetchHabitCompletions,
    fetchHabitStreaks,
    markHabitCompleted,
    unmarkHabitCompleted,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleHabitStatus,
    initializeData,
    clearError,

    // Filter and Sort actions
    updateFilters,
    updateSort,
    resetFilters,
    resetSort,
  };
});
