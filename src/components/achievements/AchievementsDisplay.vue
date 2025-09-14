<template>
  <div class="achievements-display">
    <!-- Header with Stats -->
    <div class="bg-card rounded-lg shadow-sm border border-border p-6 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-bold text-card-foreground">Achievements</h2>
        <button
          @click="refreshAchievements"
          :disabled="loading"
          class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors"
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
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
          <div class="flex items-center">
            <div class="text-green-600 mr-3">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
            <div>
              <p class="text-sm text-green-700">Earned Badges</p>
              <p class="text-2xl font-bold text-green-800">{{ earnedCount }}</p>
            </div>
          </div>
        </div>

        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex items-center">
            <div class="text-blue-600 mr-3">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
            <div>
              <p class="text-sm text-blue-700">Total Points</p>
              <p class="text-2xl font-bold text-blue-800">{{ totalPoints }}</p>
            </div>
          </div>
        </div>

        <div class="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <div class="flex items-center">
            <div class="text-primary mr-3">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <p class="text-sm text-primary">Progress</p>
              <p class="text-2xl font-bold text-primary">
                {{ completionPercentage }}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="mb-6">
      <nav class="flex space-x-8" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors',
            activeTab === tab.id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
          ]"
        >
          {{ tab.name }}
          <span
            :class="[
              'ml-2 py-0.5 px-2 rounded-full text-xs',
              activeTab === tab.id
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-600',
            ]"
          >
            {{ tab.count }}
          </span>
        </button>
      </nav>
    </div>

    <!-- Achievements Grid -->
    <div class="space-y-8">
      <!-- Recent Achievements (only shown in 'all' tab) -->
      <div
        v-if="activeTab === 'all' && recentAchievements.length > 0"
        class="mb-8"
      >
        <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg
            class="w-5 h-5 text-yellow-500 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            ></path>
          </svg>
          Recent Achievements
        </h3>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
        >
          <AchievementBadge
            v-for="achievement in recentAchievements.slice(0, 5)"
            :key="achievement.achievement_id"
            :achievement="achievement.achievement!"
            size="small"
            @click="showAchievementDetail"
          />
        </div>
      </div>

      <!-- Achievement Categories -->
      <div
        v-for="(categoryAchievements, categoryName) in displayedAchievements"
        :key="categoryName"
      >
        <h3
          class="text-lg font-semibold text-gray-900 mb-4 capitalize flex items-center"
        >
          <span class="mr-2">{{ getCategoryIcon(categoryName) }}</span>
          {{ getCategoryDisplayName(categoryName) }}
          <span class="ml-2 text-sm text-gray-500">
            ({{ categoryAchievements.filter(a => a.is_earned).length }}/{{
              categoryAchievements.length
            }})
          </span>
        </h3>

        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
        >
          <AchievementBadge
            v-for="achievement in categoryAchievements"
            :key="achievement.id"
            :achievement="achievement"
            @click="showAchievementDetail"
          />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredAchievements.length === 0" class="text-center py-12">
      <svg
        class="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">
        No achievements found
      </h3>
      <p class="mt-1 text-sm text-gray-500">
        {{
          activeTab === 'earned'
            ? 'Complete habits to earn your first achievement!'
            : 'Keep working towards your goals!'
        }}
      </p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg
            class="h-5 w-5 text-red-400"
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
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">
            Error loading achievements
          </h3>
          <div class="mt-2 text-sm text-red-700">
            <p>{{ error }}</p>
          </div>
          <div class="mt-4">
            <button
              @click="refreshAchievements"
              class="bg-red-100 px-2 py-1.5 rounded-md text-red-800 hover:bg-red-200 text-sm font-medium"
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
