<template>
  <div class="bg-card rounded-lg shadow border border-border p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-card-foreground">
        {{ isEditing ? 'Edit Habit' : 'Create New Habit' }}
      </h2>
      <button
        @click="$emit('close')"
        class="text-muted-foreground hover:text-foreground transition-colors"
      >
        <XMarkIcon class="h-5 w-5" />
      </button>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label
          for="title"
          class="block text-sm font-medium text-foreground mb-1"
        >
          Habit Title *
        </label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          required
          placeholder="e.g., Drink 8 glasses of water"
          class="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
          :class="{ 'border-destructive': errors.title }"
        />
        <p v-if="errors.title" class="mt-1 text-sm text-destructive">
          {{ errors.title }}
        </p>
      </div>

      <div>
        <label
          for="description"
          class="block text-sm font-medium text-foreground mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          v-model="form.description"
          rows="3"
          placeholder="Describe your habit and why it's important to you"
          class="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring resize-none"
        ></textarea>
      </div>

      <div>
        <label
          for="frequency"
          class="block text-sm font-medium text-foreground mb-1"
        >
          Frequency *
        </label>
        <select
          id="frequency"
          v-model="form.frequency"
          required
          class="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
          :class="{ 'border-destructive': errors.frequency }"
        >
          <option value="">Select frequency</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        <p v-if="errors.frequency" class="mt-1 text-sm text-destructive">
          {{ errors.frequency }}
        </p>
      </div>

      <!-- Error Display -->
      <div
        v-if="error"
        class="bg-destructive/10 border border-destructive/20 rounded-md p-3"
      >
        <p class="text-sm text-destructive">{{ error }}</p>
      </div>

      <!-- Form Actions -->
      <div class="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          @click="$emit('close')"
          class="px-4 py-2 text-muted-foreground bg-muted rounded-md hover:bg-muted/80 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="loading"
          class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{
            loading ? 'Saving...' : isEditing ? 'Update Habit' : 'Create Habit'
          }}
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
