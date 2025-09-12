<script setup lang="ts">
import { useDemoStore } from '../store'

defineProps<{ msg: string }>()

// Use the Pinia store
const demoStore = useDemoStore()
</script>

<template>
  <h1>{{ msg }}</h1>

  <div className="flex flex-col items-center justify-center bg-blue-600 p-4 rounded-lg text-white">
    <h2 class="text-xl font-bold mb-4">Pinia Store Demo</h2>
    
    <!-- Counter Section -->
    <div class="mb-4">
      <p class="text-lg">Count: {{ demoStore.count }}</p>
      <p class="text-sm">Double Count: {{ demoStore.doubleCount }}</p>
      <div class="mt-2 space-x-2">
        <button 
          type="button" 
          @click="demoStore.increment"
          class="bg-green-500 hover:bg-green-600 px-3 py-1 rounded"
        >
          Increment
        </button>
        <button 
          type="button" 
          @click="demoStore.decrement"
          class="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
        >
          Decrement
        </button>
      </div>
    </div>

    <!-- Message Section -->
    <div class="mb-4">
      <p class="text-lg">Message: {{ demoStore.message }}</p>
      <button 
        type="button" 
        @click="demoStore.updateMessage('Updated from Pinia!')"
        class="bg-purple-500 hover:bg-purple-600 px-3 py-1 rounded mt-2"
      >
        Update Message
      </button>
    </div>

    <!-- User Section -->
    <div class="mb-4">
      <p class="text-lg">{{ demoStore.greeting }}</p>
      <p class="text-sm">Email: {{ demoStore.user.email }}</p>
      <button 
        type="button" 
        @click="demoStore.updateUser({ name: 'Jane Doe', email: 'jane@example.com' })"
        class="bg-orange-500 hover:bg-orange-600 px-3 py-1 rounded mt-2"
      >
        Update User
      </button>
    </div>
  </div>

  <p>
    Edit
    <code>components/HelloWorld.vue</code> to test HMR
  </p>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Learn more about IDE Support for Vue in the
    <a
      href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support"
      target="_blank"
      >Vue Docs Scaling up Guide</a
    >.
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
