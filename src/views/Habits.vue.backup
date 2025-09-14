<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Habits</h1>
          <p class="mt-2 text-gray-600">
            Manage your daily habits and track your progress
          </p>
        </div>
        <button
          v-if="!showForm"
          @click="showAddForm"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Habit
        </button>
      </div>
    </div>

    <!-- Habit Form -->
    <div v-if="showForm" class="mb-8">
      <HabitForm
        :habit="editingHabit"
        :is-editing="!!editingHabit"
        @success="handleFormSuccess"
        @cancel="handleFormCancel"
      />
    </div>

    <!-- Filter Controls -->
    <HabitFilters v-if="!showForm" />
    <!-- Habit List -->
    <HabitList @edit="handleEditHabit" />

    <!-- Loading Overlay -->
    <div
      v-if="loading"
      class="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 flex items-center space-x-3">
        <div
          class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"
        ></div>
        <span class="text-gray-700">Loading habits...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useHabitsStore, type Habit } from '@/store/habits';
import HabitForm from '@/components/habits/HabitForm.vue';
import HabitList from '@/components/habits/HabitList.vue';
import HabitFilters from '@/components/habits/HabitFilters.vue';

const habitsStore = useHabitsStore();

const showForm = ref(false);
const editingHabit = ref<Habit | null>(null);
const loading = ref(false);

const showAddForm = () => {
  editingHabit.value = null;
  showForm.value = true;
};

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
