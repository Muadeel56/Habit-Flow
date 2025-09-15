<template>
  <div data-cy="habits-page">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex justify-between items-center">
        <div data-cy="habits-page">
          <h1 class="text-3xl font-bold text-foreground">Habits</h1>
          <p class="mt-2 text-muted-foreground">
            Manage your daily habits and track your progress
          </p>
        </div>
        <button
          @click="showForm = true"
          class="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          data-cy="add-habit-button"
        >
          Add Habit
        </button>
      </div>
    </div>

    <!-- Habit Form -->
    <div v-if="showForm" class="mb-8">
      <Suspense>
        <template #default>
          <HabitForm
            :habit="editingHabit"
            :is-editing="!!editingHabit"
            @success="handleFormSuccess"
            @cancel="handleFormCancel"
          />
        </template>
        <template #fallback>
          <div class="bg-card rounded-lg p-6 animate-pulse">
            <div class="h-4 bg-muted rounded w-1/4 mb-4"></div>
            <div class="h-10 bg-muted rounded mb-4"></div>
            <div class="h-10 bg-muted rounded mb-4"></div>
            <div class="flex gap-2">
              <div class="h-10 bg-muted rounded w-20"></div>
              <div class="h-10 bg-muted rounded w-20"></div>
            </div>
          </div>
        </template>
      </Suspense>
    </div>

    <!-- Filter Controls -->
    <div v-if="!showForm" class="mb-6">
      <Suspense>
        <template #default>
          <HabitFilters />
        </template>
        <template #fallback>
          <div class="flex gap-4">
            <div class="h-10 bg-muted rounded w-32 animate-pulse"></div>
            <div class="h-10 bg-muted rounded w-32 animate-pulse"></div>
            <div class="h-10 bg-muted rounded w-48 animate-pulse"></div>
          </div>
        </template>
      </Suspense>
    </div>

    <!-- Habit List -->
    <Suspense>
      <template #default>
        <HabitList @edit="handleEditHabit" />
      </template>
      <template #fallback>
        <div class="space-y-4">
          <div
            v-for="i in 3"
            :key="i"
            class="bg-card rounded-lg p-6 animate-pulse"
          >
            <div class="h-4 bg-muted rounded w-1/3 mb-2"></div>
            <div class="h-3 bg-muted rounded w-2/3 mb-4"></div>
            <div class="flex justify-between items-center">
              <div class="h-6 bg-muted rounded w-16"></div>
              <div class="flex gap-2">
                <div class="h-8 bg-muted rounded w-16"></div>
                <div class="h-8 bg-muted rounded w-16"></div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Suspense>

    <!-- Loading Overlay -->
    <div
      v-if="loading"
      class="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50"
    >
      <div class="bg-card rounded-lg p-6 flex items-center space-x-3">
        <div
          class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"
        ></div>
        <span class="text-card-foreground">Loading habits...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue';
import { useHabitsStore, type Habit } from '@/store/habits';

// Lazy load components
const HabitForm = defineAsyncComponent(
  () => import('@/components/habits/HabitForm.vue')
);
const HabitList = defineAsyncComponent(
  () => import('@/components/habits/HabitList.vue')
);
const HabitFilters = defineAsyncComponent(
  () => import('@/components/habits/HabitFilters.vue')
);

const habitsStore = useHabitsStore();

const showForm = ref(false);
const editingHabit = ref<Habit | null>(null);
const loading = ref(false);

const handleEditHabit = (habit: Habit) => {
  editingHabit.value = habit;
  showForm.value = true;
};

const handleFormSuccess = () => {
  showForm.value = false;
  editingHabit.value = null;
};

const handleFormCancel = () => {
  showForm.value = false;
  editingHabit.value = null;
};

const loadHabits = async () => {
  loading.value = true;
  try {
    await habitsStore.fetchHabits();
  } catch (error) {
    console.error('Failed to load habits:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadHabits();
});
</script>
