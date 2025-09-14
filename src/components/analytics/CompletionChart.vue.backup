<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900">Completion Trends</h3>
      <div class="flex items-center space-x-2">
        <button
          @click="timeRange = 'week'"
          :class="[
            'px-3 py-1 text-sm rounded-md transition-colors',
            timeRange === 'week'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-500 hover:text-gray-700',
          ]"
        >
          Week
        </button>
        <button
          @click="timeRange = 'month'"
          :class="[
            'px-3 py-1 text-sm rounded-md transition-colors',
            timeRange === 'month'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-500 hover:text-gray-700',
          ]"
        >
          Month
        </button>
        <button
          @click="timeRange = 'quarter'"
          :class="[
            'px-3 py-1 text-sm rounded-md transition-colors',
            timeRange === 'quarter'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-500 hover:text-gray-700',
          ]"
        >
          3 Months
        </button>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
      ></div>
    </div>

    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-600">{{ error }}</p>
    </div>

    <div v-else class="relative">
      <canvas ref="chartCanvas" class="w-full" style="height: 300px"></canvas>
    </div>

    <!-- Chart legend and stats -->
    <div v-if="!loading && !error" class="mt-6 pt-4 border-t border-gray-200">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <div class="text-xl font-bold text-blue-600">
            {{ totalCompletions }}
          </div>
          <div class="text-sm text-gray-500">Total Completions</div>
        </div>
        <div>
          <div class="text-xl font-bold text-green-600">{{ averageDaily }}</div>
          <div class="text-sm text-gray-500">Daily Average</div>
        </div>
        <div>
          <div class="text-xl font-bold text-purple-600">{{ bestDay }}</div>
          <div class="text-sm text-gray-500">Best Day</div>
        </div>
        <div>
          <div class="text-xl font-bold text-orange-600">
            {{ completionRate }}%
          </div>
          <div class="text-sm text-gray-500">Completion Rate</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { Chart, registerables } from 'chart.js';
import { useAnalyticsStore } from '../../store/analytics';
import { useHabitsStore } from '../../store/habits';

Chart.register(...registerables);

const analyticsStore = useAnalyticsStore();
const habitsStore = useHabitsStore();

const chartCanvas = ref();
const chart = ref<Chart | null>(null);
const timeRange = ref<'week' | 'month' | 'quarter'>('month');
const loading = ref(false);
const error = ref<string | null>(null);

const chartData = computed(() => {
  const days =
    timeRange.value === 'week' ? 7 : timeRange.value === 'month' ? 30 : 90;

  return analyticsStore.getCompletionChartData(undefined, days);
});

const totalCompletions = computed(() => {
  return chartData.value.data.reduce((sum, count) => sum + count, 0);
});

const averageDaily = computed(() => {
  const total = totalCompletions.value;
  const days = chartData.value.data.length;
  return days > 0 ? Math.round((total / days) * 10) / 10 : 0;
});

const bestDay = computed(() => {
  return Math.max(...chartData.value.data, 0);
});

const completionRate = computed(() => {
  const activeHabits = habitsStore.activeHabits.length;
  const days = chartData.value.data.length;
  const expectedCompletions = activeHabits * days;

  if (expectedCompletions === 0) return 0;
  return Math.round((totalCompletions.value / expectedCompletions) * 100);
});

const createChart = () => {
  if (!chartCanvas.value) return;

  // Destroy existing chart
  if (chart.value) {
    chart.value.destroy();
  }

  const ctx = chartCanvas.value.getContext('2d');
  if (!ctx) return;

  chart.value = new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartData.value.labels,
      datasets: [
        {
          label: 'Daily Completions',
          data: chartData.value.data,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgb(59, 130, 246)',
          pointBorderColor: 'rgb(255, 255, 255)',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index',
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: 'white',
          bodyColor: 'white',
          borderColor: 'rgba(59, 130, 246, 0.8)',
          borderWidth: 1,
          callbacks: {
            title: context => {
              return `${context[0].label}`;
            },
            label: context => {
              const value = context.parsed.y;
              return `${value} completion${value !== 1 ? 's' : ''}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          border: {
            display: false,
          },
          ticks: {
            color: 'rgb(107, 114, 128)',
            font: {
              size: 12,
            },
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(107, 114, 128, 0.1)',
          },
          border: {
            display: false,
          },
          ticks: {
            color: 'rgb(107, 114, 128)',
            font: {
              size: 12,
            },
            stepSize: 1,
          },
        },
      },
    },
  });
};

const loadData = async () => {
  try {
    loading.value = true;
    error.value = null;

    await Promise.all([
      habitsStore.fetchHabits(),
      habitsStore.fetchHabitCompletions(),
    ]);

    await nextTick();
    createChart();
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : 'Failed to load completion data';
  } finally {
    loading.value = false;
  }
};

// Watch for time range changes
watch(timeRange, async () => {
  await nextTick();
  createChart();
});

// Watch for data changes
watch(chartData, async () => {
  await nextTick();
  createChart();
});

onMounted(() => {
  loadData();
});

onUnmounted(() => {
  if (chart.value) {
    chart.value.destroy();
  }
});
</script>
