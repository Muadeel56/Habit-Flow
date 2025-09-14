<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900 flex items-center">
        <svg
          class="w-5 h-5 text-yellow-500 mr-2"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          ></path>
        </svg>
        Achievements
      </h3>
      <router-link
        to="/achievements"
        class="text-sm text-blue-600 hover:text-blue-800 font-medium"
      >
        View All
      </router-link>
    </div>

    <!-- Stats Summary -->
    <div class="grid grid-cols-2 gap-4 mb-4">
      <div class="text-center">
        <div class="text-2xl font-bold text-green-600">{{ earnedCount }}</div>
        <div class="text-xs text-gray-500">Badges Earned</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-blue-600">{{ totalPoints }}</div>
        <div class="text-xs text-gray-500">Total Points</div>
      </div>
    </div>

    <!-- Recent Achievements -->
    <div v-if="recentAchievements.length > 0">
      <h4 class="text-sm font-medium text-gray-700 mb-3">Recent Badges</h4>
      <div class="space-y-2">
        <div
          v-for="achievement in recentAchievements.slice(0, maxDisplay)"
          :key="achievement.achievement_id"
          class="flex items-center p-2 bg-green-50 border border-green-200 rounded-md"
        >
          <div class="text-lg mr-3">{{ achievement.achievement?.icon }}</div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium text-green-800 truncate">
              {{ achievement.achievement?.name }}
            </div>
            <div class="text-xs text-green-600">
              {{ formatDate(achievement.earned_at) }} •
              {{ achievement.achievement?.points }} pts
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Progress Towards Next Achievement -->
    <div v-else-if="nextAchievement" class="mt-4">
      <h4 class="text-sm font-medium text-gray-700 mb-3">Next Achievement</h4>
      <div class="p-3 bg-blue-50 border border-blue-200 rounded-md">
        <div class="flex items-center mb-2">
          <div class="text-lg mr-3 opacity-75">{{ nextAchievement.icon }}</div>
          <div class="flex-1">
            <div class="text-sm font-medium text-blue-800">
              {{ nextAchievement.name }}
            </div>
            <div class="text-xs text-blue-600">
              {{ nextAchievement.description }}
            </div>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="mt-2">
          <div class="flex justify-between text-xs text-blue-600 mb-1">
            <span
              >{{ nextAchievement.current_progress || 0 }}/{{
                nextAchievement.requirement_value
              }}</span
            >
            <span
              >{{ Math.round(nextAchievement.progress_percentage || 0) }}%</span
            >
          </div>
          <div class="w-full bg-blue-200 rounded-full h-2">
            <div
              class="h-2 bg-blue-500 rounded-full transition-all duration-300"
              :style="{
                width: `${Math.min(nextAchievement.progress_percentage || 0, 100)}%`,
              }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-6">
      <div class="text-4xl mb-2">🎯</div>
      <div class="text-sm text-gray-500">
        Complete habits to earn your first badge!
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-4">
      <svg
        class="animate-spin h-6 w-6 text-blue-600"
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
