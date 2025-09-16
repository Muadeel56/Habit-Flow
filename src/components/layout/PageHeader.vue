<template>
  <div class="mb-8">
    <!-- Page Title Section -->
    <div class="mb-6">
      <h1
        class="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2"
      >
        {{ title }}
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-400">
        {{ description }}
      </p>
    </div>

    <!-- Action Bar (if actions are provided) -->
    <div
      v-if="$slots.actions"
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div class="flex items-center space-x-4">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  description: string;
}

defineProps<Props>();
</script>
