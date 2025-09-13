<template>
  <div
    :class="[
      'relative rounded-lg border-2 transition-all duration-200 cursor-pointer',
      badgeClasses,
    ]"
    @click="$emit('click', achievement)"
    :title="tooltipText"
  >
    <!-- Badge Container -->
    <div class="p-4 text-center">
      <!-- Icon -->
      <div :class="['text-4xl mb-2', iconClasses]">
        {{ achievement.icon }}
      </div>

      <!-- Name -->
      <h3 :class="['font-semibold text-sm mb-1', nameClasses]">
        {{ achievement.name }}
      </h3>

      <!-- Description -->
      <p :class="['text-xs leading-tight', descriptionClasses]">
        {{ achievement.description }}
      </p>

      <!-- Progress Bar (for in-progress achievements) -->
      <div v-if="showProgress && !achievement.is_earned" class="mt-3">
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="h-2 rounded-full transition-all duration-300"
            :class="progressBarClasses"
            :style="{ width: `${Math.min(progressPercentage, 100)}%` }"
          ></div>
        </div>
        <p class="text-xs text-gray-500 mt-1">
          {{ currentProgress }}/{{ achievement.requirement_value }}
        </p>
      </div>

      <!-- Points -->
      <div :class="['text-xs mt-2 font-medium', pointsClasses]">
        {{ achievement.points }} pts
      </div>

      <!-- Earned Date (for earned achievements) -->
      <div
        v-if="achievement.is_earned && achievement.earned_at"
        class="text-xs text-green-600 mt-1"
      >
        Earned {{ formatDate(achievement.earned_at) }}
      </div>
    </div>

    <!-- Earned Badge Overlay -->
    <div
      v-if="achievement.is_earned"
      class="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1"
    >
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
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
      class="absolute inset-0 bg-gray-900 bg-opacity-50 rounded-lg flex items-center justify-center"
    >
      <svg
        class="w-8 h-8 text-gray-300"
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

  // Size classes
  switch (props.size) {
    case 'small':
      baseClasses.push('min-w-[120px]');
      break;
    case 'large':
      baseClasses.push('min-w-[180px]');
      break;
    default:
      baseClasses.push('min-w-[150px]');
  }

  // State classes
  if (props.achievement.is_earned) {
    baseClasses.push(
      'border-green-300 bg-green-50 hover:bg-green-100 shadow-lg',
      'ring-2 ring-green-200'
    );
  } else if (progressPercentage.value >= 50) {
    baseClasses.push(
      'border-yellow-300 bg-yellow-50 hover:bg-yellow-100 shadow-md',
      'ring-1 ring-yellow-200'
    );
  } else if (progressPercentage.value > 0) {
    baseClasses.push(
      'border-blue-300 bg-blue-50 hover:bg-blue-100 shadow-sm',
      'ring-1 ring-blue-200'
    );
  } else {
    baseClasses.push(
      'border-gray-300 bg-gray-50 hover:bg-gray-100',
      'opacity-75'
    );
  }

  return baseClasses;
});

const iconClasses = computed(() => {
  if (props.achievement.is_earned) {
    return 'filter drop-shadow-md';
  } else if (isLocked.value) {
    return 'grayscale opacity-50';
  } else {
    return 'opacity-80';
  }
});

const nameClasses = computed(() => {
  if (props.achievement.is_earned) {
    return 'text-green-800';
  } else if (progressPercentage.value >= 50) {
    return 'text-yellow-800';
  } else if (progressPercentage.value > 0) {
    return 'text-blue-800';
  } else {
    return 'text-gray-600';
  }
});

const descriptionClasses = computed(() => {
  if (props.achievement.is_earned) {
    return 'text-green-700';
  } else if (progressPercentage.value >= 50) {
    return 'text-yellow-700';
  } else if (progressPercentage.value > 0) {
    return 'text-blue-700';
  } else {
    return 'text-gray-500';
  }
});

const pointsClasses = computed(() => {
  if (props.achievement.is_earned) {
    return 'text-green-600';
  } else if (progressPercentage.value >= 50) {
    return 'text-yellow-600';
  } else if (progressPercentage.value > 0) {
    return 'text-blue-600';
  } else {
    return 'text-gray-500';
  }
});

const progressBarClasses = computed(() => {
  if (progressPercentage.value >= 75) {
    return 'bg-green-500';
  } else if (progressPercentage.value >= 50) {
    return 'bg-yellow-500';
  } else {
    return 'bg-blue-500';
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
