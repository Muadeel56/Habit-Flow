import { createPinia } from 'pinia';

// Create and export the Pinia instance
export const pinia = createPinia();

// Export all stores from this file
export * from './demo';
export * from './auth';
export * from './profile';
export * from './habits';
export * from './analytics';
export * from './achievements';
