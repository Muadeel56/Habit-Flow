<template>
  <div data-cy="habits-page" class="space-y-8">
    <!-- Consistent Page Header -->
    <PageHeader
      title="Habits"
      description="Manage and organize your daily habits"
    >
      <template #actions>
        <button
          @click="showForm = true"
          class="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
          data-cy="add-habit-button"
        >
          <div class="flex items-center space-x-2">
            <svg
              class="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span>Add New Habit</span>
          </div>
        </button>
      </template>
    </PageHeader>

    <!-- Habit Form -->
    <div
      v-if="showForm"
      class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
    >
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            {{ editingHabit ? 'Edit Habit' : 'Create New Habit' }}
          </h2>
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            {{
              editingHabit
                ? 'Update your habit details'
                : 'Set up a new habit to track'
            }}
          </p>
        </div>
        <button
          @click="handleFormCancel"
          class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <svg
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <HabitForm
        :habit="editingHabit"
        :is-editing="!!editingHabit"
        @success="handleFormSuccess"
        @cancel="handleFormCancel"
      />
    </div>

    <!-- Filter Controls -->
    <div
      v-if="!showForm"
      class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
    >
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Filter & Sort
          </h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            Organize your habits
          </p>
        </div>
      </div>
      <HabitFilters />
    </div>

    <!-- Habit List -->
    <div v-if="!showForm" class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Your Habits
          </h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            Manage and track your daily habits
          </p>
        </div>
        <div
          class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400"
        >
          <svg
            class="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{{ habitsStore.habits.length }} habits</span>
        </div>
      </div>

      <HabitList @edit="handleEditHabit" />
    </div>

    <!-- Loading Overlay -->
    <div
      v-if="loading"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl p-8 flex items-center space-x-4 shadow-2xl"
      >
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"
        ></div>
        <div>
          <p class="text-gray-900 dark:text-white font-medium">
            Loading habits...
          </p>
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            Please wait a moment
          </p>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="!loading && !showForm && habitsStore.habits.length === 0"
      class="text-center py-16"
    >
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
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        No habits yet
      </h3>
      <p class="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
        Start building better habits by creating your first one. Small steps
        lead to big changes!
      </p>
      <button
        @click="showForm = true"
        class="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
      >
        Create Your First Habit
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useHabitsStore, type Habit } from '@/store/habits';
import PageHeader from '@/components/layout/PageHeader.vue';
import HabitForm from '@/components/habits/HabitForm.vue';
import HabitList from '@/components/habits/HabitList.vue';
import HabitFilters from '@/components/habits/HabitFilters.vue';

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
