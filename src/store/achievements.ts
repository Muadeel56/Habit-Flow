import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '../lib/supabase';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'streak' | 'completion' | 'consistency' | 'milestone';
  requirement_value: number;
  requirement_type:
    | 'current_streak'
    | 'best_streak'
    | 'total_completions'
    | 'consecutive_days'
    | 'habits_count';
  points: number;
  color: string;
  is_active: boolean;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  habit_id?: string;
  earned_at: string;
  progress_value?: number;
  created_at: string;
  achievement?: Achievement; // Populated when joining with achievements table
}

export interface AchievementWithProgress extends Achievement {
  is_earned: boolean;
  earned_at?: string;
  progress_value?: number;
  habit_id?: string;
  current_progress?: number; // Current progress towards this achievement
  progress_percentage?: number; // Percentage complete (0-100)
}

export const useAchievementsStore = defineStore('achievements', () => {
  const achievements = ref<Achievement[]>([]);
  const userAchievements = ref<UserAchievement[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Computed properties
  const earnedAchievements = computed(() =>
    userAchievements.value.filter(ua => ua.achievement)
  );

  const totalPoints = computed(() =>
    earnedAchievements.value.reduce(
      (total, ua) => total + (ua.achievement?.points || 0),
      0
    )
  );

  const achievementsByType = computed(() => {
    const grouped: Record<string, AchievementWithProgress[]> = {};
    achievementsWithProgress.value.forEach(achievement => {
      if (!grouped[achievement.type]) {
        grouped[achievement.type] = [];
      }
      grouped[achievement.type].push(achievement);
    });
    return grouped;
  });

  const recentAchievements = computed(() =>
    earnedAchievements.value
      .sort(
        (a, b) =>
          new Date(b.earned_at).getTime() - new Date(a.earned_at).getTime()
      )
      .slice(0, 5)
  );

  // Get achievements with progress information
  const achievementsWithProgress = computed((): AchievementWithProgress[] => {
    return achievements.value.map(achievement => {
      const userAchievement = userAchievements.value.find(
        ua => ua.achievement_id === achievement.id
      );

      return {
        ...achievement,
        is_earned: !!userAchievement,
        earned_at: userAchievement?.earned_at,
        progress_value: userAchievement?.progress_value,
        habit_id: userAchievement?.habit_id,
        current_progress: 0, // This will be calculated based on current user stats
        progress_percentage: 0, // This will be calculated based on current user stats
      };
    });
  });

  // Fetch all available achievements
  const fetchAchievements = async () => {
    try {
      loading.value = true;
      error.value = null;

      const { data, error: fetchError } = await supabase
        .from('achievements')
        .select('*')
        .eq('is_active', true)
        .order('requirement_value', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      achievements.value = data || [];
      return { success: true, data };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch achievements';
      error.value = errorMessage;
      return { success: false, error: errorMessage };
    } finally {
      loading.value = false;
    }
  };

  // Fetch user's earned achievements
  const fetchUserAchievements = async () => {
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
        .from('user_achievements')
        .select(
          `
          *,
          achievement:achievements (*)
        `
        )
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      userAchievements.value = data || [];
      return { success: true, data };
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to fetch user achievements';
      error.value = errorMessage;
      return { success: false, error: errorMessage };
    } finally {
      loading.value = false;
    }
  };

  // Calculate current progress towards achievements
  const calculateAchievementProgress = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Get user stats for progress calculation
      const [completionsResult, habitsResult, streaksResult] =
        await Promise.all([
          supabase
            .from('habit_completions')
            .select('id')
            .eq('user_id', user.id),
          supabase
            .from('habits')
            .select('id')
            .eq('user_id', user.id)
            .eq('is_active', true),
          supabase
            .from('habit_streaks')
            .select('current_streak, best_streak')
            .eq('user_id', user.id),
        ]);

      const totalCompletions = completionsResult.data?.length || 0;
      const activeHabitsCount = habitsResult.data?.length || 0;
      const maxCurrentStreak = Math.max(
        ...(streaksResult.data?.map(s => s.current_streak) || [0])
      );
      const maxBestStreak = Math.max(
        ...(streaksResult.data?.map(s => s.best_streak) || [0])
      );

      // Update achievements with current progress
      achievements.value = achievements.value.map(achievement => {
        let currentProgress = 0;
        switch (achievement.requirement_type) {
          case 'total_completions':
            currentProgress = totalCompletions;
            break;
          case 'habits_count':
            currentProgress = activeHabitsCount;
            break;
          case 'current_streak':
            currentProgress = maxCurrentStreak;
            break;
          case 'best_streak':
            currentProgress = maxBestStreak;
            break;
        }

        const progressPercentage = Math.min(
          (currentProgress / achievement.requirement_value) * 100,
          100
        );

        return {
          ...achievement,
          current_progress: currentProgress,
          progress_percentage: progressPercentage,
        } as Achievement;
      });
    } catch (err) {
      console.error('Failed to calculate achievement progress:', err);
    }
  };

  // Check for new achievements (manual trigger)
  const checkForNewAchievements = async () => {
    try {
      // Refresh user achievements to see if any new ones were earned
      await fetchUserAchievements();
      await calculateAchievementProgress();

      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to check for new achievements';
      error.value = errorMessage;
      return { success: false, error: errorMessage };
    }
  };

  // Get achievements for a specific habit (for habit-specific achievements)
  const getHabitAchievements = (habitId: string) => {
    return userAchievements.value.filter(ua => ua.habit_id === habitId);
  };

  // Get achievements by type
  const getAchievementsByType = (type: Achievement['type']) => {
    return achievementsWithProgress.value.filter(a => a.type === type);
  };

  // Initialize achievements data
  const initializeAchievements = async () => {
    await Promise.all([fetchAchievements(), fetchUserAchievements()]);
    await calculateAchievementProgress();
  };

  // Clear error
  const clearError = () => {
    error.value = null;
  };

  return {
    // State
    achievements,
    userAchievements,
    loading,
    error,

    // Computed
    earnedAchievements,
    totalPoints,
    achievementsByType,
    recentAchievements,
    achievementsWithProgress,

    // Actions
    fetchAchievements,
    fetchUserAchievements,
    calculateAchievementProgress,
    checkForNewAchievements,
    getHabitAchievements,
    getAchievementsByType,
    initializeAchievements,
    clearError,
  };
});
