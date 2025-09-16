<template>
  <div class="achievements-display">
    <!-- Header with Stats -->
    <div
      class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8"
    >
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0"
      >
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            Achievements
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mt-1">
            Track your progress and celebrate milestones
          </p>
        </div>
        <button
          @click="refreshAchievements"
          :disabled="loading"
          class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <svg
            v-if="loading"
            class="animate-spin w-4 h-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {{ loading ? 'Refreshing...' : 'Refresh' }}
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6"
        >
          <div class="flex items-center">
            <div
              class="h-12 w-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg"
            >
              <svg
                class="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-green-700 dark:text-green-300">
                Earned Badges
              </p>
              <p class="text-2xl font-bold text-green-800 dark:text-green-200">
                {{ earnedCount }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6"
        >
          <div class="flex items-center">
            <div
              class="h-12 w-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg"
            >
              <svg
                class="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-blue-700 dark:text-blue-300">
                Total Points
              </p>
              <p class="text-2xl font-bold text-blue-800 dark:text-blue-200">
                {{ totalPoints }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6 sm:col-span-2 lg:col-span-1"
        >
          <div class="flex items-center">
            <div
              class="h-12 w-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg"
            >
              <svg
                class="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p
                class="text-sm font-medium text-purple-700 dark:text-purple-300"
              >
                Progress
              </p>
              <p
                class="text-2xl font-bold text-purple-800 dark:text-purple-200"
              >
                {{ completionPercentage }}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="mb-8">
      <div
        class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-1"
      >
        <nav class="flex flex-wrap gap-1" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'flex-1 sm:flex-none whitespace-nowrap py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200',
              activeTab === tab.id
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700',
            ]"
          >
            <span class="flex items-center justify-center space-x-2">
              <span>{{ tab.name }}</span>
              <span
                :class="[
                  'py-0.5 px-2 rounded-full text-xs font-medium',
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300',
                ]"
              >
                {{ tab.count }}
              </span>
            </span>
          </button>
        </nav>
      </div>
    </div>

    <!-- Achievements Grid -->
    <div class="space-y-8">
      <!-- Recent Achievements (only shown in 'all' tab) -->
      <div
        v-if="activeTab === 'all' && recentAchievements.length > 0"
        class="mb-8"
      >
        <div class="flex items-center mb-6">
          <div
            class="h-8 w-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mr-3"
          >
            <svg
              class="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              ></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">
            Recent Achievements
          </h3>
        </div>
        <div
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4"
        >
          <AchievementBadge
            v-for="achievement in recentAchievements.slice(0, 8)"
            :key="achievement.achievement_id"
            :achievement="{ ...achievement.achievement!, is_earned: false }"
            size="small"
            @click="showAchievementDetail"
          />
        </div>
      </div>

      <!-- Achievement Categories -->
      <div
        v-for="(categoryAchievements, categoryName) in displayedAchievements"
        :key="categoryName"
        class="space-y-6"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div
              class="h-10 w-10 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center mr-4"
            >
              <span class="text-2xl">{{ getCategoryIcon(categoryName) }}</span>
            </div>
            <div>
              <h3
                class="text-xl font-bold text-gray-900 dark:text-white capitalize"
              >
                {{ getCategoryDisplayName(categoryName) }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ categoryAchievements.filter(a => a.is_earned).length }} of
                {{ categoryAchievements.length }} completed
              </p>
            </div>
          </div>
        </div>

        <!-- Fixed Grid Layout with Proper Spacing -->
        <div
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4"
        >
          <div
            v-for="achievement in categoryAchievements"
            :key="achievement.id"
            class="flex justify-center"
          >
            <AchievementBadge
              :achievement="achievement"
              @click="showAchievementDetail"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredAchievements.length === 0" class="text-center py-16">
      <div
        class="mx-auto h-24 w-24 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl flex items-center justify-center mb-6"
      >
        <svg
          class="h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        No achievements found
      </h3>
      <p class="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
        {{
          activeTab === 'earned'
            ? 'Complete habits to earn your first achievement!'
            : 'Keep working towards your goals!'
        }}
      </p>
    </div>

    <!-- Error State -->
    <div
      v-if="error"
      class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6"
    >
      <div class="flex">
        <div class="flex-shrink-0">
          <svg
            class="h-6 w-6 text-red-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="ml-4 flex-1">
          <h3 class="text-lg font-semibold text-red-800 dark:text-red-200">
            Error loading achievements
          </h3>
          <div class="mt-2 text-red-700 dark:text-red-300">
            <p>{{ error }}</p>
          </div>
          <div class="mt-4">
            <button
              @click="refreshAchievements"
              class="bg-red-100 dark:bg-red-900/30 px-4 py-2 rounded-lg text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-900/50 text-sm font-medium transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAchievementsStore } from '../../store/achievements';
import AchievementBadge from './AchievementBadge.vue';
import type { AchievementWithProgress } from '../../store/achievements';

const achievementsStore = useAchievementsStore();

const activeTab = ref<string>('all');

const tabs = computed(() => [
  {
    id: 'all',
    name: 'All',
    count: achievementsStore.achievementsWithProgress.length,
  },
  {
    id: 'earned',
    name: 'Earned',
    count: achievementsStore.earnedAchievements.length,
  },
  {
    id: 'streak',
    name: 'Streaks',
    count: achievementsStore.getAchievementsByType('streak').length,
  },
  {
    id: 'milestone',
    name: 'Milestones',
    count: achievementsStore.getAchievementsByType('milestone').length,
  },
]);

const filteredAchievements = computed(() => {
  switch (activeTab.value) {
    case 'earned':
      return achievementsStore.achievementsWithProgress.filter(
        a => a.is_earned
      );
    case 'streak':
      return achievementsStore.getAchievementsByType('streak');
    case 'milestone':
      return achievementsStore.getAchievementsByType('milestone');
    default:
      return achievementsStore.achievementsWithProgress;
  }
});

const displayedAchievements = computed(() => {
  if (activeTab.value === 'all') {
    return achievementsStore.achievementsByType;
  } else {
    const grouped: Record<string, AchievementWithProgress[]> = {};
    filteredAchievements.value.forEach(achievement => {
      if (!grouped[achievement.type]) {
        grouped[achievement.type] = [];
      }
      grouped[achievement.type].push(achievement);
    });
    return grouped;
  }
});

const earnedCount = computed(() => achievementsStore.earnedAchievements.length);
const totalPoints = computed(() => achievementsStore.totalPoints);
const completionPercentage = computed(() => {
  const total = achievementsStore.achievements.length;
  const earned = achievementsStore.earnedAchievements.length;
  return total > 0 ? Math.round((earned / total) * 100) : 0;
});

const recentAchievements = computed(() => achievementsStore.recentAchievements);
const loading = computed(() => achievementsStore.loading);
const error = computed(() => achievementsStore.error);

const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    streak: '🔥',
    milestone: '🏆',
    completion: '✅',
    consistency: '⭐',
  };
  return icons[category] || '🎯';
};

const getCategoryDisplayName = (category: string) => {
  const names: Record<string, string> = {
    streak: 'Streak Achievements',
    milestone: 'Milestone Achievements',
    completion: 'Completion Achievements',
    consistency: 'Consistency Achievements',
  };
  return names[category] || category;
};

const showAchievementDetail = (achievement: AchievementWithProgress) => {
  // TODO: Implement achievement detail modal or tooltip
  console.log('Show achievement detail:', achievement);
};

const refreshAchievements = async () => {
  await achievementsStore.checkForNewAchievements();
};

onMounted(async () => {
  await achievementsStore.initializeAchievements();
});
</script>
