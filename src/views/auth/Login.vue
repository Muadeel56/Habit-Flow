<template>
  <div
    class="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8"
  >
    <!-- Theme Toggle -->
    <div class="absolute top-4 right-4">
      <ThemeToggle />
    </div>

    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-foreground">
          Sign in to your account
        </h2>
        <p class="mt-2 text-center text-sm text-muted-foreground">
          Or
          <router-link
            to="/signup"
            class="font-medium text-primary hover:text-primary/80"
            data-cy="signup-link"
          >
            create a new account
          </router-link>
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">Email address</label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-input placeholder-muted-foreground text-foreground bg-background rounded-t-md focus:outline-none focus:ring-ring focus:border-ring focus:z-10 sm:text-sm"
              :class="{ 'border-destructive': errors.email }"
              placeholder="Email address"
              data-cy="email-input"
            />
            <p
              v-if="errors.email"
              class="mt-1 text-sm text-destructive"
              data-cy="error-message"
            >
              {{ errors.email }}
            </p>
          </div>

          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-input placeholder-muted-foreground text-foreground bg-background rounded-b-md focus:outline-none focus:ring-ring focus:border-ring focus:z-10 sm:text-sm"
              :class="{ 'border-destructive': errors.password }"
              placeholder="Password"
              data-cy="password-input"
            />
            <p
              v-if="errors.password"
              class="mt-1 text-sm text-destructive"
              data-cy="error-message"
            >
              {{ errors.password }}
            </p>
          </div>
        </div>

        <div
          v-if="authStore.error"
          class="rounded-md bg-destructive/10 p-4"
          data-cy="error-message"
        >
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-destructive">
                {{ authStore.error }}
              </h3>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="authStore.loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
            data-cy="login-button"
          >
            <span
              v-if="authStore.loading"
              class="absolute left-0 inset-y-0 flex items-center pl-3"
            >
              <svg
                class="h-5 w-5 text-primary-foreground animate-spin"
                xmlns="http://www.w3.org/2000/svg"
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
            </span>
            {{ authStore.loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import ThemeToggle from '@/components/theme/ThemeToggle.vue';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  email: '',
  password: '',
});

const errors = reactive({
  email: '',
  password: '',
});

const validateForm = () => {
  errors.email = '';
  errors.password = '';

  if (!form.email) {
    errors.email = 'Email is required';
    return false;
  }

  if (!form.email.includes('@')) {
    errors.email = 'Please enter a valid email address';
    return false;
  }

  if (!form.password) {
    errors.password = 'Password is required';
    return false;
  }

  if (form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
    return false;
  }

  return true;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  const result = await authStore.signIn(form.email, form.password);

  if (result.success) {
    router.push('/dashboard');
  }
};
</script>
