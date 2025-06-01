import js from '@eslint/js';
import globals from 'globals';
import sonarjs from 'eslint-plugin-sonarjs';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      sonarjs,
    },
rules: {
  // Accepts options object
  'sonarjs/no-duplicate-string': ['warn', { threshold: 3 }],

  // Only number or string severity allowed (0/off, 1/warn, 2/error or 'off', 'warn', 'error')
  'sonarjs/cognitive-complexity': ['warn', 15],

  semi: ['error', 'always'],
  quotes: ['error', 'single'],
}

  },
];
