<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Profile</h1>
      <p class="mt-2 text-gray-600">
        Manage your account settings and preferences
      </p>
    </div>

    <div class="max-w-2xl">
      <!-- Profile information -->
      <div class="bg-white rounded-lg shadow mb-6">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">Profile Information</h2>
        </div>
        <div class="p-6">
          <div class="flex items-center mb-6">
            <div
              class="h-16 w-16 bg-gray-300 rounded-full flex items-center justify-center"
            >
              <span class="text-gray-600 font-medium text-xl">U</span>
            </div>
            <div class="ml-4">
              <button
                class="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Change Photo
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >First Name</label
              >
              <input
                type="text"
                value="John"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Last Name</label
              >
              <input
                type="text"
                value="Doe"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Email</label
              >
              <input
                type="email"
                value="john.doe@example.com"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Phone</label
              >
              <input
                type="tel"
                value="+1 (555) 123-4567"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div class="mt-6">
            <button
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <!-- Preferences -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">Preferences</h2>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-900">
                  Email Notifications
                </h3>
                <p class="text-sm text-gray-500">
                  Receive email updates about your habits
                </p>
              </div>
              <input
                type="checkbox"
                checked
                class="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-900">
                  Daily Reminders
                </h3>
                <p class="text-sm text-gray-500">
                  Get reminded to complete your habits
                </p>
              </div>
              <input
                type="checkbox"
                checked
                class="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-900">
                  Weekly Reports
                </h3>
                <p class="text-sm text-gray-500">
                  Receive weekly progress summaries
                </p>
              </div>
              <input
                type="checkbox"
                class="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Profile component logic will go here
</script>
