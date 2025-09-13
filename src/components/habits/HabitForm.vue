<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold text-gray-900">
        {{ isEditing ? 'Edit Habit' : 'Add New Habit' }}
      </h2>
      <button
        v-if="isEditing"
        @click="$emit('cancel')"
        class="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Title Field -->
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter habit title"
          :disabled="loading"
        />
      </div>

      <!-- Description Field -->
      <div>
        <label
          for="description"
          class="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          v-model="form.description"
          rows="3"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Describe your habit"
          :disabled="loading"
        ></textarea>
      </div>

      <!-- Frequency Field -->
      <div>
        <label
          for="frequency"
          class="block text-sm font-medium text-gray-700 mb-1"
        >
          Frequency *
        </label>
        <select
          id="frequency"
          v-model="form.frequency"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          :disabled="loading"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-3">
        <p class="text-sm text-red-600">{{ error }}</p>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-end space-x-3">
        <button
          v-if="isEditing"
          type="button"
          @click="$emit('cancel')"
          class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          :disabled="loading"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="loading || !form.title.trim()"
        >
          <span v-if="loading" class="flex items-center">
            <svg
              class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
            {{ isEditing ? 'Updating...' : 'Creating...' }}
          </span>
          <span v-else>
            {{ isEditing ? 'Update Habit' : 'Create Habit' }}
          </span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import {
  useHabitsStore,
  type CreateHabitData,
  type UpdateHabitData,
  type Habit,
} from '@/store/habits';

interface Props {
  habit?: Habit | null;
  isEditing?: boolean;
}

interface Emits {
  (e: 'success'): void;
  (e: 'cancel'): void;
}

const props = withDefaults(defineProps<Props>(), {
  habit: null,
  isEditing: false,
});

const emit = defineEmits<Emits>();

const habitsStore = useHabitsStore();

const form = ref<CreateHabitData>({
  title: '',
  description: '',
  frequency: 'daily',
});

const loading = ref(false);
const error = ref<string | null>(null);

// Watch for habit changes when editing
watch(
  () => props.habit,
  newHabit => {
    if (newHabit && props.isEditing) {
      form.value = {
        title: newHabit.title,
        description: newHabit.description,
        frequency: newHabit.frequency,
      };
    }
  },
  { immediate: true }
);

// Reset form when switching from edit to create mode
watch(
  () => props.isEditing,
  isEditing => {
    if (!isEditing) {
      resetForm();
    }
  }
);

const resetForm = () => {
  form.value = {
    title: '',
    description: '',
    frequency: 'daily',
  };
  error.value = null;
};

const handleSubmit = async () => {
  if (!form.value.title.trim()) {
    error.value = 'Title is required';
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    if (props.isEditing && props.habit) {
      const updateData: UpdateHabitData = {
        title: form.value.title,
        description: form.value.description,
        frequency: form.value.frequency,
      };

      const result = await habitsStore.updateHabit(props.habit.id, updateData);
      if (!result.success) {
        error.value = result.error || 'Failed to update habit';
        return;
      }
    } else {
      const result = await habitsStore.createHabit(form.value);
      if (!result.success) {
        error.value = result.error || 'Failed to create habit';
        return;
      }
    }

    resetForm();
    emit('success');
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : 'An unexpected error occurred';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (props.habit && props.isEditing) {
    form.value = {
      title: props.habit.title,
      description: props.habit.description,
      frequency: props.habit.frequency,
    };
  }
});
</script>
