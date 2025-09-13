import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useHabitsStore, type HabitStreak, type Habit } from './habits';

export interface WeeklyCompletion {
  week: string;
  completions: number;
  total: number;
  percentage: number;
}

export interface MonthlyCompletion {
  month: string;
  completions: number;
  total: number;
  percentage: number;
}

export interface HabitAnalytics {
  habit: Habit;
  streak: HabitStreak | null;
  weeklyCompletions: WeeklyCompletion[];
  monthlyCompletions: MonthlyCompletion[];
  totalCompletions: number;
  completionRate: number;
}

export interface DashboardStats {
  totalActiveHabits: number;
  totalCompletionsToday: number;
  averageStreak: number;
  bestStreak: number;
  weeklyCompletionRate: number;
  monthlyCompletionRate: number;
  totalCompletions: number;
}

export const useAnalyticsStore = defineStore('analytics', () => {
  const habitsStore = useHabitsStore();
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Get date range for the last N days
  const getDateRange = (days: number): string[] => {
    const dates: string[] = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }

    return dates;
  };

  // Get week range for the last N weeks
  const getWeekRange = (weeks: number): string[] => {
    const weekLabels: string[] = [];
    const today = new Date();

    for (let i = weeks - 1; i >= 0; i--) {
      const weekStart = new Date(today);
      weekStart.setDate(weekStart.getDate() - (weekStart.getDay() + i * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const month = weekStart.toLocaleDateString('en-US', { month: 'short' });
      const startDay = weekStart.getDate();
      const endDay = weekEnd.getDate();

      weekLabels.push(`${month} ${startDay}-${endDay}`);
    }

    return weekLabels;
  };

  // Get month range for the last N months
  const getMonthRange = (months: number): string[] => {
    const monthLabels: string[] = [];
    const today = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      monthLabels.push(
        date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      );
    }

    return monthLabels;
  };

  // Calculate weekly completions for a specific habit
  const calculateWeeklyCompletions = (
    habitId: string,
    weeks: number = 8
  ): WeeklyCompletion[] => {
    const completions = habitsStore.habitCompletions.filter(
      c => c.habit_id === habitId
    );
    const weekLabels = getWeekRange(weeks);
    const weeklyData: WeeklyCompletion[] = [];

    const today = new Date();

    for (let i = weeks - 1; i >= 0; i--) {
      const weekStart = new Date(today);
      weekStart.setDate(weekStart.getDate() - (weekStart.getDay() + i * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const weekCompletions = completions.filter(c => {
        const completionDate = new Date(c.completed_date);
        return completionDate >= weekStart && completionDate <= weekEnd;
      });

      const habit = habitsStore.habits.find(h => h.id === habitId);
      const expectedCompletions =
        habit?.frequency === 'daily'
          ? 7
          : habit?.frequency === 'weekly'
            ? 1
            : 0;

      weeklyData.push({
        week: weekLabels[weeks - 1 - i],
        completions: weekCompletions.length,
        total: expectedCompletions,
        percentage:
          expectedCompletions > 0
            ? (weekCompletions.length / expectedCompletions) * 100
            : 0,
      });
    }

    return weeklyData;
  };

  // Calculate monthly completions for a specific habit
  const calculateMonthlyCompletions = (
    habitId: string,
    months: number = 6
  ): MonthlyCompletion[] => {
    const completions = habitsStore.habitCompletions.filter(
      c => c.habit_id === habitId
    );
    const monthLabels = getMonthRange(months);
    const monthlyData: MonthlyCompletion[] = [];

    const today = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const monthStart = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthEnd = new Date(
        today.getFullYear(),
        today.getMonth() - i + 1,
        0
      );

      const monthCompletions = completions.filter(c => {
        const completionDate = new Date(c.completed_date);
        return completionDate >= monthStart && completionDate <= monthEnd;
      });

      const habit = habitsStore.habits.find(h => h.id === habitId);
      const daysInMonth = monthEnd.getDate();
      const expectedCompletions =
        habit?.frequency === 'daily'
          ? daysInMonth
          : habit?.frequency === 'weekly'
            ? Math.ceil(daysInMonth / 7)
            : habit?.frequency === 'monthly'
              ? 1
              : 0;

      monthlyData.push({
        month: monthLabels[months - 1 - i],
        completions: monthCompletions.length,
        total: expectedCompletions,
        percentage:
          expectedCompletions > 0
            ? (monthCompletions.length / expectedCompletions) * 100
            : 0,
      });
    }

    return monthlyData;
  };

  // Get analytics for a specific habit
  const getHabitAnalytics = (habitId: string): HabitAnalytics | null => {
    const habit = habitsStore.habits.find(h => h.id === habitId);
    if (!habit) return null;

    const streak = habitsStore.habitStreaks.find(s => s.habit_id === habitId);
    const weeklyCompletions = calculateWeeklyCompletions(habitId);
    const monthlyCompletions = calculateMonthlyCompletions(habitId);

    const totalCompletions = habitsStore.habitCompletions.filter(
      c => c.habit_id === habitId
    ).length;

    // Calculate overall completion rate
    const habitCreatedDate = new Date(habit.created_at);
    const daysSinceCreation = Math.ceil(
      (Date.now() - habitCreatedDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const expectedCompletions =
      habit.frequency === 'daily'
        ? daysSinceCreation
        : habit.frequency === 'weekly'
          ? Math.ceil(daysSinceCreation / 7)
          : habit.frequency === 'monthly'
            ? Math.ceil(daysSinceCreation / 30)
            : 0;

    const completionRate =
      expectedCompletions > 0
        ? (totalCompletions / expectedCompletions) * 100
        : 0;

    return {
      habit,
      streak: streak || null,
      weeklyCompletions,
      monthlyCompletions,
      totalCompletions,
      completionRate,
    };
  };

  // Get dashboard statistics
  const getDashboardStats = computed((): DashboardStats => {
    const activeHabits = habitsStore.activeHabits;
    const today = new Date().toISOString().split('T')[0];

    // Total active habits
    const totalActiveHabits = activeHabits.length;

    // Completions today
    const totalCompletionsToday = habitsStore.habitCompletions.filter(
      c => c.completed_date === today
    ).length;

    // Average streak
    const streaks = habitsStore.habitStreaks;
    const averageStreak =
      streaks.length > 0
        ? streaks.reduce((sum, s) => sum + s.current_streak, 0) / streaks.length
        : 0;

    // Best streak
    const bestStreak =
      streaks.length > 0 ? Math.max(...streaks.map(s => s.best_streak)) : 0;

    // Weekly completion rate
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const weeklyCompletions = habitsStore.habitCompletions.filter(c => {
      const completionDate = new Date(c.completed_date);
      return completionDate >= weekStart && completionDate <= weekEnd;
    }).length;

    const weeklyExpected = activeHabits.reduce((sum, habit) => {
      return (
        sum +
        (habit.frequency === 'daily' ? 7 : habit.frequency === 'weekly' ? 1 : 0)
      );
    }, 0);

    const weeklyCompletionRate =
      weeklyExpected > 0 ? (weeklyCompletions / weeklyExpected) * 100 : 0;

    // Monthly completion rate
    const monthStart = new Date();
    monthStart.setDate(1);
    const monthEnd = new Date(
      monthStart.getFullYear(),
      monthStart.getMonth() + 1,
      0
    );

    const monthlyCompletions = habitsStore.habitCompletions.filter(c => {
      const completionDate = new Date(c.completed_date);
      return completionDate >= monthStart && completionDate <= monthEnd;
    }).length;

    const daysInMonth = monthEnd.getDate();
    const monthlyExpected = activeHabits.reduce((sum, habit) => {
      return (
        sum +
        (habit.frequency === 'daily'
          ? daysInMonth
          : habit.frequency === 'weekly'
            ? Math.ceil(daysInMonth / 7)
            : habit.frequency === 'monthly'
              ? 1
              : 0)
      );
    }, 0);

    const monthlyCompletionRate =
      monthlyExpected > 0 ? (monthlyCompletions / monthlyExpected) * 100 : 0;

    // Total completions
    const totalCompletions = habitsStore.habitCompletions.length;

    return {
      totalActiveHabits,
      totalCompletionsToday,
      averageStreak,
      bestStreak,
      weeklyCompletionRate,
      monthlyCompletionRate,
      totalCompletions,
    };
  });

  // Get completion data for charts
  const getCompletionChartData = (habitId?: string, days: number = 30) => {
    const dates = getDateRange(days);
    const completions = habitId
      ? habitsStore.habitCompletions.filter(c => c.habit_id === habitId)
      : habitsStore.habitCompletions;

    const chartData = dates.map(date => {
      const dayCompletions = completions.filter(
        c => c.completed_date === date
      ).length;
      return {
        date,
        completions: dayCompletions,
      };
    });

    return {
      labels: dates.map(date => {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
      }),
      data: chartData.map(d => d.completions),
    };
  };

  // Get streak data for charts
  const getStreakChartData = () => {
    const habitsWithStreaks = habitsStore.habitsWithStreaks;

    return {
      labels: habitsWithStreaks.map(h => h.title),
      currentStreaks: habitsWithStreaks.map(h => h.streak?.current_streak || 0),
      bestStreaks: habitsWithStreaks.map(h => h.streak?.best_streak || 0),
    };
  };

  // Initialize analytics data
  const initializeAnalytics = async () => {
    try {
      loading.value = true;
      error.value = null;

      await habitsStore.initializeData();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to initialize analytics';
      error.value = errorMessage;
    } finally {
      loading.value = false;
    }
  };

  // Clear error
  const clearError = () => {
    error.value = null;
  };

  return {
    // State
    loading,
    error,

    // Computed
    getDashboardStats,

    // Actions
    getHabitAnalytics,
    getCompletionChartData,
    getStreakChartData,
    calculateWeeklyCompletions,
    calculateMonthlyCompletions,
    initializeAnalytics,
    clearError,
  };
});
