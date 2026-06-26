import js from '@eslint/js';
import angular from 'angular-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const BASE_RULES = {
  ...prettierConfig.rules,
  'prettier/prettier': 'warn',

  'no-useless-catch': 'warn',
  'no-unused-vars': 'off',
  'no-redeclare': 'off',
  'no-console': 'warn',
  'no-alert': 'warn',
  'no-param-reassign': 'error',
  'prefer-destructuring': ['warn', { object: true, array: false }],
  'prefer-template': 'warn',
};

const TS_RULES = {
  '@typescript-eslint/no-empty-function': 'off',
  '@typescript-eslint/no-empty-object-type': 'off',
  '@typescript-eslint/no-unused-vars': 'error',
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/consistent-type-imports': [
    'warn',
    { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
  ],
};

const IMPORT_ORDER_RULE = [
  'warn',
  {
    groups: [
      'builtin',
      'external',
      'internal',
      'parent',
      'sibling',
      'index',
      'object',
      'type',
    ],
    pathGroups: [
      { pattern: '@angular/**', group: 'external', position: 'before' },
      { pattern: 'rxjs', group: 'external', position: 'before' },
      { pattern: 'rxjs/**', group: 'external', position: 'before' },
      { pattern: '@/**', group: 'internal', position: 'before' },
    ],
    'newlines-between': 'always',
    alphabetize: { order: 'asc', caseInsensitive: true },
  },
];

const IMPORT_RULES = {
  'import/order': IMPORT_ORDER_RULE,
  'import/no-duplicates': 'warn',
  'import/no-unused-modules': 'off',
  'import/no-cycle': ['error', { maxDepth: 1 }],
  'import/no-self-import': 'warn',
  'import/no-useless-path-segments': ['warn', { noUselessIndex: true }],
  'import/first': 'warn',
  'import/newline-after-import': 'warn',
  'import/no-absolute-path': 'warn',
  'import/no-relative-packages': 'warn',
};

const SHARED_RULES = { ...BASE_RULES, ...IMPORT_RULES };

export default defineConfig([
  globalIgnores(['.angular/**', '.nx/**', 'coverage/**', 'dist/**']),

  {
    files: ['**/*.ts'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      angular.configs.tsRecommended,
    ],
    plugins: {
      prettier,
      import: importPlugin,
    },
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        project: './tsconfig.app.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    processor: angular.processInlineTemplates,
    rules: {
      ...TS_RULES,
      ...SHARED_RULES,

      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
    },
  },

  {
    files: ['**/*.html'],
    extends: [
      angular.configs.templateRecommended,
      angular.configs.templateAccessibility,
    ],
    rules: {},
  },

  {
    files: ['eslint.config.mjs'],
    extends: [js.configs.recommended],
    plugins: {
      prettier,
      import: importPlugin,
    },
    languageOptions: {
      globals: globals.node,
      sourceType: 'module',
    },
    rules: {
      ...SHARED_RULES,
    },
  },
]);
