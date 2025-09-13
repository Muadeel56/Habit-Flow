import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';

export default [
  {
    files: ['**/*.{js,ts,vue}'],
    ignores: ['dist/', 'node_modules/', '*.config.js'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        HTMLElement: 'readonly',
        Event: 'readonly',
        Node: 'readonly',
        document: 'readonly',
        alert: 'readonly',
        window: 'readonly',
        console: 'readonly',
        HTMLInputElement: 'readonly',
        HTMLSelectElement: 'readonly',
        // Browser APIs
        navigator: 'readonly',
        localStorage: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        // Service Worker APIs
        self: 'readonly',
        caches: 'readonly',
        clients: 'readonly',
        fetch: 'readonly',
      },
      parserOptions: {
        parser: tseslint.parser,
      },
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  // Service Worker specific configuration
  {
    files: ['public/sw.js'],
    languageOptions: {
      globals: {
        self: 'readonly',
        caches: 'readonly',
        clients: 'readonly',
        fetch: 'readonly',
        addEventListener: 'readonly',
        skipWaiting: 'readonly',
        claim: 'readonly',
        showNotification: 'readonly',
        postMessage: 'readonly',
        matchAll: 'readonly',
        openWindow: 'readonly',
        focus: 'readonly',
        close: 'readonly',
        registration: 'readonly',
      },
    },
  },
];
