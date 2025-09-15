<template>
  <div class="bg-card rounded-lg shadow p-6 mb-6" data-cy="habit-filters">
    <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
      <!-- Search -->
      <div class="flex-1 min-w-0">
        <label
          for="search"
          class="block text-sm font-medium text-card-foreground mb-1"
        >
          Search Habits
        </label>
        <div class="relative">
          <input
            id="search"
            type="text"
            :value="filters.search"
            @input="updateSearch"
            placeholder="Search by name or description..."
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-card placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <svg
              class="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- Status Filter -->
      <div class="w-full lg:w-48">
        <label
          for="status-filter"
          class="block text-sm font-medium text-card-foreground mb-1"
        >
          Status
        </label>
        <select
          id="status-filter"
          :value="filters.status"
          @change="updateStatus"
          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all" data-cy="filter-all">All Habits</option>
          <option value="active" data-cy="filter-active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="completed_today" data-cy="filter-completed">
            Completed Today
          </option>
          <option value="not_completed_today">Not Done Today</option>
        </select>
      </div>

      <!-- Frequency Filter -->
      <div class="w-full lg:w-48">
        <label
          for="frequency-filter"
          class="block text-sm font-medium text-card-foreground mb-1"
        >
          Frequency
        </label>
        <select
          id="frequency-filter"
          :value="filters.frequency"
          @change="updateFrequency"
          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Frequencies</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <!-- Sort Controls -->
      <div class="w-full lg:w-48">
        <label
          for="sort-by"
          class="block text-sm font-medium text-card-foreground mb-1"
        >
          Sort By
        </label>
        <select
          id="sort-by"
          :value="sort.by"
          @change="updateSortBy"
          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="created_at">Created Date</option>
          <option value="name">Name</option>
          <option value="frequency">Frequency</option>
          <option value="status">Status</option>
          <option value="current_streak">Current Streak</option>
          <option value="best_streak">Best Streak</option>
        </select>
      </div>

      <!-- Sort Order -->
      <div class="w-full lg:w-32">
        <label
          for="sort-order"
          class="block text-sm font-medium text-card-foreground mb-1"
        >
          Order
        </label>
        <select
          id="sort-order"
          :value="sort.order"
          @change="updateSortOrder"
          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="asc">A-Z / Low-High</option>
          <option value="desc">Z-A / High-Low</option>
        </select>
      </div>

      <!-- Reset Button -->
      <div class="w-full lg:w-auto">
        <label
          class="block text-sm font-medium text-card-foreground mb-1 lg:invisible"
        >
          Reset
        </label>
        <button
          @click="resetAll"
          class="w-full lg:w-auto px-4 py-2 text-sm font-medium text-muted-foreground bg-muted border border-border rounded-md hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-colors"
        >
          Reset
        </button>
      </div>
    </div>

    <!-- Active Filters Summary -->
    <div v-if="hasActiveFilters" class="mt-4 pt-4 border-t border-border">
      <div class="flex flex-wrap gap-2 items-center">
        <span class="text-sm text-muted-foreground">Active filters:</span>

        <span
          v-if="filters.search"
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
        >
          Search: "{{ filters.search }}"
          <button
            @click="clearSearch"
            class="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:text-blue-600 hover:bg-blue-200"
          >
            <svg
              class="w-3 h-3"
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
        </span>

        <span
          v-if="filters.status !== 'all'"
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
        >
          Status: {{ formatStatusLabel(filters.status) }}
          <button
            @click="clearStatus"
            class="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-green-400 hover:text-green-600 hover:bg-green-200"
          >
            <svg
              class="w-3 h-3"
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
        </span>

        <span
          v-if="filters.frequency !== 'all'"
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
        >
          Frequency: {{ formatFrequencyLabel(filters.frequency) }}
          <button
            @click="clearFrequency"
            class="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-purple-400 hover:text-purple-600 hover:bg-purple-200"
          >
            <svg
              class="w-3 h-3"
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
        </span>

        <span
          v-if="sort.by !== 'created_at' || sort.order !== 'desc'"
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
        >
          Sort: {{ formatSortLabel() }}
          <button
            @click="resetSort"
            class="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-orange-400 hover:text-orange-600 hover:bg-orange-200"
          >
            <svg
              class="w-3 h-3"
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
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  useHabitsStore,
  type HabitFilterStatus,
  type HabitFilterFrequency,
  type HabitSortBy,
  type HabitSortOrder,
} from '@/store/habits';

const habitsStore = useHabitsStore();

const filters = computed(() => habitsStore.filters);
const sort = computed(() => habitsStore.sort);

const hasActiveFilters = computed(() => {
  return (
    filters.value.search.trim() !== '' ||
    filters.value.status !== 'all' ||
    filters.value.frequency !== 'all' ||
    sort.value.by !== 'created_at' ||
    sort.value.order !== 'desc'
  );
});

// Event handlers
const updateSearch = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target) return;
  habitsStore.updateFilters({ search: target.value });
};

const updateStatus = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  if (!target) return;
  habitsStore.updateFilters({ status: target.value as HabitFilterStatus });
};

const updateFrequency = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  if (!target) return;
  habitsStore.updateFilters({
    frequency: target.value as HabitFilterFrequency,
  });
};

const updateSortBy = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  if (!target) return;
  habitsStore.updateSort({ by: target.value as HabitSortBy });
};

const updateSortOrder = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  if (!target) return;
  habitsStore.updateSort({ order: target.value as HabitSortOrder });
};

const resetAll = () => {
  habitsStore.resetFilters();
  habitsStore.resetSort();
};

const clearSearch = () => {
  habitsStore.updateFilters({ search: '' });
};

const clearStatus = () => {
  habitsStore.updateFilters({ status: 'all' });
};

const clearFrequency = () => {
  habitsStore.updateFilters({ frequency: 'all' });
};

const resetSort = () => {
  habitsStore.resetSort();
};

// Formatters
const formatStatusLabel = (status: HabitFilterStatus): string => {
  const labels = {
    all: 'All',
    active: 'Active',
    inactive: 'Inactive',
    completed_today: 'Completed Today',
    not_completed_today: 'Not Done Today',
  };
  return labels[status];
};

const formatFrequencyLabel = (frequency: HabitFilterFrequency): string => {
  const labels = {
    all: 'All',
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
  };
  return labels[frequency];
};

const formatSortLabel = (): string => {
  const sortLabels = {
    created_at: 'Created Date',
    name: 'Name',
    frequency: 'Frequency',
    status: 'Status',
    current_streak: 'Current Streak',
    best_streak: 'Best Streak',
  };

  const orderLabel = sort.value.order === 'asc' ? '↑' : '↓';
  return `${sortLabels[sort.value.by]} ${orderLabel}`;
};
</script>
