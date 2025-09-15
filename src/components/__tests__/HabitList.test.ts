import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import HabitList from '../habits/HabitList.vue';

// Mock the store
vi.mock('@/store/habits', () => ({
  useHabitsStore: vi.fn(() => ({
    habits: [],
    loading: false,
    error: null,
    initializeData: vi.fn(),
    deleteHabit: vi.fn().mockResolvedValue({ success: true }),
    clearError: vi.fn(),
  })),
}));

describe('HabitList', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    setActivePinia(createPinia());

    wrapper = mount(HabitList, {
      global: {
        plugins: [createPinia()],
        stubs: {
          XMarkIcon: true,
          CheckIcon: true,
          PlusIcon: true,
        },
      },
    });
  });

  it('renders empty state when no habits', () => {
    expect(wrapper.find('.text-center').text()).toContain('No habits yet');
    expect(wrapper.find('h3').text()).toBe('No habits yet');
  });

  it('has proper component structure', () => {
    expect(wrapper.find('div').exists()).toBe(true);
  });
});
