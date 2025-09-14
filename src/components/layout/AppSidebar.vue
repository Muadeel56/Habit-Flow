<template>
  <div>
    <!-- Mobile sidebar overlay -->
    <div
      v-if="isOpen"
      class="fixed inset-0 z-40 lg:hidden"
      @click="$emit('close')"
    >
      <div class="fixed inset-0 bg-black bg-opacity-75"></div>
    </div>

    <!-- Sidebar -->
    <div
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 bg-card shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
        isOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <div class="flex flex-col h-full">
        <!-- Sidebar header -->
        <div
          class="flex items-center justify-between h-16 px-6 border-b border-border"
        >
          <div class="flex items-center">
            <div
              class="h-8 w-8 bg-primary rounded-lg flex items-center justify-center"
            >
              <span class="text-primary-foreground font-bold text-sm">HF</span>
            </div>
            <h2 class="ml-3 text-lg font-semibold text-foreground">
              Habit Flow
            </h2>
          </div>
          <button
            @click="$emit('close')"
            class="lg:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
            aria-label="Close sidebar"
          >
            <svg
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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

        <!-- Navigation -->
        <nav class="flex-1 px-4 py-6 space-y-2">
          <router-link
            to="/dashboard"
            class="flex items-center px-4 py-3 text-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors group"
            active-class="bg-accent text-accent-foreground border-r-2 border-primary"
            @click="$emit('close')"
          >
            <svg
              class="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"
              />
            </svg>
            Dashboard
          </router-link>

          <router-link
            to="/habits"
            class="flex items-center px-4 py-3 text-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors group"
            active-class="bg-accent text-accent-foreground border-r-2 border-primary"
            @click="$emit('close')"
          >
            <svg
              class="w-5 h-5 mr-3"
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
            Habits
          </router-link>

          <router-link
            to="/achievements"
            class="flex items-center px-4 py-3 text-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors group"
            active-class="bg-accent text-accent-foreground border-r-2 border-primary"
            @click="$emit('close')"
          >
            <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>
            Achievements
          </router-link>

          <router-link
            to="/profile"
            class="flex items-center px-4 py-3 text-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors group"
            active-class="bg-accent text-accent-foreground border-r-2 border-primary"
            @click="$emit('close')"
          >
            <svg
              class="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Profile
          </router-link>
        </nav>

        <!-- Sidebar footer -->
        <div class="p-4 border-t border-border">
          <div class="flex items-center">
            <div
              class="h-8 w-8 bg-muted rounded-full flex items-center justify-center"
            >
              <span class="text-muted-foreground font-medium text-sm">U</span>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-foreground">User Name</p>
              <p class="text-xs text-muted-foreground">user@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean;
}>();

defineEmits<{
  close: [];
}>();
</script>
