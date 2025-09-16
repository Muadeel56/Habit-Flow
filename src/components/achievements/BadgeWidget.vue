<template>
  <div class="space-y-6">
    <!-- Stats Summary -->
    <div class="grid grid-cols-2 gap-4">
      <div
        class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800"
      >
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600 dark:text-green-400">
            {{ earnedCount }}
          </div>
          <div class="text-xs text-green-700 dark:text-green-300 font-medium">
            Badges Earned
          </div>
        </div>
      </div>
      <div
        class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800"
      >
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {{ totalPoints }}
          </div>
          <div class="text-xs text-blue-700 dark:text-blue-300 font-medium">
            Total Points
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Achievements -->
    <div v-if="recentAchievements.length > 0">
      <h4
        class="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center"
      >
        <div
          class="h-6 w-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mr-2"
        >
          <svg
            class="h-4 w-4 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        </div>
        Recent Badges
      </h4>
      <div class="space-y-3">
        <div
          v-for="achievement in recentAchievements.slice(0, maxDisplay)"
          :key="achievement.achievement_id"
          class="flex items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl hover:shadow-md transition-all duration-200"
        >
          <div
            class="h-10 w-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3 shadow-sm"
          >
            <span class="text-lg">{{ achievement.achievement?.icon }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <div
              class="text-sm font-semibold text-green-800 dark:text-green-200 truncate"
            >
              {{ achievement.achievement?.name }}
            </div>
            <div class="text-xs text-green-600 dark:text-green-400">
              {{ formatDate(achievement.earned_at) }} •
              {{ achievement.achievement?.points }} pts
            </div>
          </div>
          <div
            class="h-6 w-6 bg-green-500 rounded-full flex items-center justify-center"
          >
            <svg
              class="h-3 w-3 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Progress Towards Next Achievement -->
    <div v-else-if="nextAchievement" class="space-y-4">
      <h4
        class="text-sm font-semibold text-gray-900 dark:text-white flex items-center"
      >
        <div
          class="h-6 w-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-2"
        >
          <svg
            class="h-4 w-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        Next Achievement
      </h4>
      <div
        class="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl"
      >
        <div class="flex items-center mb-3">
          <div
            class="h-10 w-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-3 shadow-sm"
          >
            <span class="text-lg opacity-75">{{ nextAchievement.icon }}</span>
          </div>
          <div class="flex-1">
            <div class="text-sm font-semibold text-blue-800 dark:text-blue-200">
              {{ nextAchievement.name }}
            </div>
            <div class="text-xs text-blue-600 dark:text-blue-400">
              {{ nextAchievement.description }}
            </div>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="space-y-2">
          <div
            class="flex justify-between text-xs text-blue-600 dark:text-blue-400 font-medium"
          >
            <span
              >{{ nextAchievement.current_progress || 0 }}/{{
                nextAchievement.requirement_value
              }}</span
            >
            <span
              >{{ Math.round(nextAchievement.progress_percentage || 0) }}%</span
            >
          </div>
          <div class="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
            <div
              class="h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500 ease-out"
              :style="{
                width: `${Math.min(nextAchievement.progress_percentage || 0, 100)}%`,
              }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-8">
      <div
        class="h-16 w-16 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
      >
        <span class="text-2xl">🎯</span>
      </div>
      <div class="text-sm text-gray-600 dark:text-gray-400 font-medium">
        Complete habits to earn your first badge!
      </div>
      <div class="text-xs text-gray-500 dark:text-gray-500 mt-1">
        Keep building those habits!
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-8">
      <div class="flex flex-col items-center space-y-3">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"
        ></div>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Loading achievements...
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useAchievementsStore } from '../../store/achievements';

interface Props {
  maxDisplay?: number;
}

withDefaults(defineProps<Props>(), {
  maxDisplay: 3,
});

const achievementsStore = useAchievementsStore();

const earnedCount = computed(() => achievementsStore.earnedAchievements.length);
const totalPoints = computed(() => achievementsStore.totalPoints);
const recentAchievements = computed(() => achievementsStore.recentAchievements);
const loading = computed(() => achievementsStore.loading);

// Find the next achievable achievement (highest progress percentage that's not earned)
const nextAchievement = computed(() => {
  const unearned = achievementsStore.achievementsWithProgress
    .filter(a => !a.is_earned && (a.progress_percentage || 0) > 0)
    .sort(
      (a, b) => (b.progress_percentage || 0) - (a.progress_percentage || 0)
    );

  return unearned[0] || null;
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return 'Today';
  } else if (diffDays === 2) {
    return 'Yesterday';
  } else if (diffDays <= 7) {
    return `${diffDays - 1} days ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  }
};

onMounted(async () => {
  // Initialize achievements if not already loaded
  if (achievementsStore.achievements.length === 0) {
    await achievementsStore.initializeAchievements();
  }
});
</script>
