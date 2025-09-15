import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import Login from '../auth/Login.vue';

// Mock the store
vi.mock('@/store/auth', () => ({
  useAuthStore: vi.fn(() => ({
    signIn: vi.fn().mockResolvedValue({ success: true }),
    loading: false,
    error: null,
  })),
}));

describe('Login', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    setActivePinia(createPinia());

    wrapper = mount(Login, {
      global: {
        plugins: [createPinia()],
        stubs: {
          ThemeToggle: true,
          RouterLink: true,
        },
      },
    });
  });

  it('renders login form', () => {
    expect(wrapper.find('h2').text()).toBe('Sign in to your account');
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
  });

  it('has form inputs', () => {
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
  });
});
