import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useHabitsStore } from '../habits';

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      single: vi.fn(),
    })),
  },
}));

describe('Habits Store', () => {
  let store: ReturnType<typeof useHabitsStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useHabitsStore();
  });

  it('initializes with empty state', () => {
    expect(store.habits).toEqual([]);
    expect(store.loading).toBe(false);
    expect(store.error).toBe(null);
  });

  it('has store methods', () => {
    expect(typeof store.createHabit).toBe('function');
    expect(typeof store.updateHabit).toBe('function');
    expect(typeof store.deleteHabit).toBe('function');
  });
});
