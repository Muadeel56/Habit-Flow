<template>
  <div
    :class="[
      'relative rounded-2xl transition-all duration-300 cursor-pointer group w-full',
      badgeClasses,
    ]"
    @click="$emit('click', achievement)"
    :title="tooltipText"
  >
    <!-- Badge Container -->
    <div class="p-4 text-center relative overflow-hidden">
      <!-- Background gradient overlay for earned achievements -->
      <div
        v-if="achievement.is_earned"
        class="absolute inset-0 bg-gradient-to-br from-green-400/10 to-emerald-500/10 rounded-2xl"
      ></div>

      <!-- Icon -->
      <div :class="['text-4xl mb-3 relative z-10', iconClasses]">
        {{ achievement.icon }}
      </div>

      <!-- Name -->
      <h3 :class="['font-bold text-sm mb-2 relative z-10', nameClasses]">
        {{ achievement.name }}
      </h3>

      <!-- Description -->
      <p
        :class="[
          'text-xs leading-tight mb-3 relative z-10',
          descriptionClasses,
        ]"
      >
        {{ achievement.description }}
      </p>

      <!-- Progress Bar (for in-progress achievements) -->
      <div
        v-if="showProgress && !achievement.is_earned && !isLocked"
        class="mt-3 relative z-10"
      >
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
          <div
            class="h-2 rounded-full transition-all duration-500 ease-out"
            :class="progressBarClasses"
            :style="{ width: `${Math.min(progressPercentage, 100)}%` }"
          ></div>
        </div>
        <p class="text-xs text-gray-600 dark:text-gray-400">
          {{ currentProgress }}/{{ achievement.requirement_value }}
        </p>
      </div>

      <!-- Points -->
      <div :class="['text-xs mt-2 font-semibold relative z-10', pointsClasses]">
        {{ achievement.points }} pts
      </div>

      <!-- Earned Date (for earned achievements) -->
      <div
        v-if="achievement.is_earned && achievement.earned_at"
        class="text-xs text-green-600 dark:text-green-400 mt-1 font-medium relative z-10"
      >
        Earned {{ formatDate(achievement.earned_at) }}
      </div>
    </div>

    <!-- Earned Badge Overlay -->
    <div
      v-if="achievement.is_earned"
      class="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full p-1.5 shadow-lg z-20"
    >
      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path
          fill-rule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clip-rule="evenodd"
        ></path>
      </svg>
    </div>

    <!-- Lock Overlay (for locked achievements) -->
    <div
      v-if="isLocked"
      class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm rounded-2xl flex items-center justify-center z-20"
    >
      <div class="text-center">
        <div
          class="h-12 w-12 bg-gray-700 rounded-2xl flex items-center justify-center mb-2 mx-auto"
        >
          <svg
            class="w-6 h-6 text-gray-300"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </div>
        <p class="text-xs text-gray-300 font-medium">Locked</p>
      </div>
    </div>

    <!-- Hover effect overlay -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { AchievementWithProgress } from '../../store/achievements';

interface Props {
  achievement: AchievementWithProgress;
  showProgress?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const props = withDefaults(defineProps<Props>(), {
  showProgress: true,
  size: 'medium',
});

defineEmits<{
  click: [achievement: AchievementWithProgress];
}>();

const currentProgress = computed(() => props.achievement.current_progress || 0);
const progressPercentage = computed(
  () => props.achievement.progress_percentage || 0
);

const isLocked = computed(
  () => !props.achievement.is_earned && progressPercentage.value < 10
);

const badgeClasses = computed(() => {
  const baseClasses = [];

  // Size classes - now using consistent sizing
  switch (props.size) {
    case 'small':
      baseClasses.push('max-w-[140px]');
      break;
    case 'large':
      baseClasses.push('max-w-[200px]');
      break;
    default:
      baseClasses.push('max-w-[170px]');
  }

  // State classes with modern styling
  if (props.achievement.is_earned) {
    baseClasses.push(
      'border-2 border-green-300 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl',
      'ring-2 ring-green-200/50 dark:ring-green-800/30',
      'hover:scale-105 hover:border-green-400'
    );
  } else if (progressPercentage.value >= 50) {
    baseClasses.push(
      'border-2 border-yellow-300 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg',
      'ring-1 ring-yellow-200/50 dark:ring-yellow-800/30',
      'hover:scale-105 hover:border-yellow-400'
    );
  } else if (progressPercentage.value > 0) {
    baseClasses.push(
      'border-2 border-blue-300 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md',
      'ring-1 ring-blue-200/50 dark:ring-blue-800/30',
      'hover:scale-105 hover:border-blue-400'
    );
  } else {
    baseClasses.push(
      'border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md',
      'hover:scale-105 hover:border-gray-400 dark:hover:border-gray-500',
      'opacity-80 hover:opacity-100'
    );
  }

  return baseClasses;
});

const iconClasses = computed(() => {
  if (props.achievement.is_earned) {
    return 'filter drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300';
  } else if (isLocked.value) {
    return 'grayscale opacity-50';
  } else {
    return 'opacity-80 group-hover:opacity-100 transition-opacity duration-300';
  }
});

const nameClasses = computed(() => {
  if (props.achievement.is_earned) {
    return 'text-green-800 dark:text-green-200';
  } else if (progressPercentage.value >= 50) {
    return 'text-yellow-800 dark:text-yellow-200';
  } else if (progressPercentage.value > 0) {
    return 'text-blue-800 dark:text-blue-200';
  } else {
    return 'text-gray-700 dark:text-gray-300';
  }
});

const descriptionClasses = computed(() => {
  if (props.achievement.is_earned) {
    return 'text-green-700 dark:text-green-300';
  } else if (progressPercentage.value >= 50) {
    return 'text-yellow-700 dark:text-yellow-300';
  } else if (progressPercentage.value > 0) {
    return 'text-blue-700 dark:text-blue-300';
  } else {
    return 'text-gray-600 dark:text-gray-400';
  }
});

const pointsClasses = computed(() => {
  if (props.achievement.is_earned) {
    return 'text-green-600 dark:text-green-400';
  } else if (progressPercentage.value >= 50) {
    return 'text-yellow-600 dark:text-yellow-400';
  } else if (progressPercentage.value > 0) {
    return 'text-blue-600 dark:text-blue-400';
  } else {
    return 'text-gray-500 dark:text-gray-500';
  }
});

const progressBarClasses = computed(() => {
  if (progressPercentage.value >= 75) {
    return 'bg-gradient-to-r from-green-500 to-emerald-600';
  } else if (progressPercentage.value >= 50) {
    return 'bg-gradient-to-r from-yellow-500 to-orange-500';
  } else {
    return 'bg-gradient-to-r from-blue-500 to-indigo-600';
  }
});

const tooltipText = computed(() => {
  if (props.achievement.is_earned) {
    return `Earned: ${props.achievement.description}`;
  } else if (isLocked.value) {
    return 'Keep working to unlock this achievement!';
  } else {
    return `Progress: ${currentProgress.value}/${props.achievement.requirement_value}`;
  }
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year:
      date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
  });
};
</script>
