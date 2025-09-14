import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export type Theme = 'light' | 'dark';

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Theme>('light');
  const isDark = computed(() => theme.value === 'dark');

  // Check if we're in browser environment
  const isBrowser = typeof window !== 'undefined';

  // Initialize theme from localStorage or system preference
  const initTheme = () => {
    if (!isBrowser) {
      return; // Skip initialization on server side
    }

    try {
      const savedTheme = localStorage.getItem('habit-flow-theme') as Theme;
      const systemPrefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;

      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        theme.value = savedTheme;
      } else {
        theme.value = systemPrefersDark ? 'dark' : 'light';
      }

      // Apply theme immediately
      applyTheme();
    } catch (error) {
      console.warn('Failed to initialize theme:', error);
      theme.value = 'light';
      applyTheme();
    }
  };

  // Toggle between light and dark themes
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
    if (isBrowser) {
      try {
        localStorage.setItem('habit-flow-theme', theme.value);
      } catch (error) {
        console.warn('Failed to save theme to localStorage:', error);
      }
    }
    applyTheme();
  };

  // Set specific theme
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme;
    if (isBrowser) {
      try {
        localStorage.setItem('habit-flow-theme', theme.value);
      } catch (error) {
        console.warn('Failed to save theme to localStorage:', error);
      }
    }
    applyTheme();
  };

  // Apply theme to document using data-theme attribute
  const applyTheme = () => {
    if (!isBrowser) {
      return; // Skip DOM manipulation on server side
    }

    try {
      const html = document.documentElement;
      html.setAttribute('data-theme', theme.value);

      // Force a repaint to ensure CSS variables are applied
      html.style.colorScheme = theme.value;

      // Ensure body background is also updated immediately
      document.body.style.backgroundColor = `var(--color-background)`;
      document.body.style.color = `var(--color-foreground)`;
    } catch (error) {
      console.warn('Failed to apply theme:', error);
    }
  };

  return {
    theme,
    isDark,
    initTheme,
    toggleTheme,
    setTheme,
    applyTheme,
  };
});
