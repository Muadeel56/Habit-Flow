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
];
