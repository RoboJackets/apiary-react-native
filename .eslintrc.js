module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 2022,
    sourceType: 'module',
    project: ['./tsconfig.json'],
  },
  plugins: ['@typescript-eslint', 'react', 'react-native', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-native/all',
    'plugin:prettier/recommended', // Prettier integration
  ],
  env: {
    es2022: true,
    node: true,
    browser: true,
    'react-native/react-native': true,
  },
  settings: {
    react: { version: 'detect' },
  },
  rules: {
    // TypeScript rules
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    // React rules
    'react/prop-types': 'off', // TS handles props types

    // React Native rules
    'react-native/no-inline-styles': 'warn',
    'react-native/split-platform-components': 'warn',
    'react-native/no-color-literals': 'off',

    // Prettier formatting rules
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'all',
        printWidth: 100,
        tabWidth: 2,
        semi: true,
      },
    ],
  },
};