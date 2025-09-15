import { config } from '@vue/test-utils';
import { vi } from 'vitest';

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
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

// Mock router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  useRoute: () => ({
    params: {},
    query: {},
  }),
  createRouter: vi.fn(),
  createWebHistory: vi.fn(),
}));

// Mock Heroicons
vi.mock('@heroicons/vue', () => ({
  XMarkIcon: { name: 'XMarkIcon', template: '<div>X</div>' },
  PlusIcon: { name: 'PlusIcon', template: '<div>+</div>' },
  CheckIcon: { name: 'CheckIcon', template: '<div>✓</div>' },
  BellIcon: { name: 'BellIcon', template: '<div>🔔</div>' },
  BellSlashIcon: { name: 'BellSlashIcon', template: '<div>🔕</div>' },
  ClockIcon: { name: 'ClockIcon', template: '<div>🕐</div>' },
  ExclamationTriangleIcon: {
    name: 'ExclamationTriangleIcon',
    template: '<div>⚠️</div>',
  },
}));

// Global test configuration
config.global.mocks = {
  $t: (key: string) => key,
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock Notification API
Object.defineProperty(window, 'Notification', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    close: vi.fn(),
  })),
});
