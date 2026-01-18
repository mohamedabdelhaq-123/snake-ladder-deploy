// eslint.config.js
module.exports = [
  {
    files: ['**/*.js'],
    ignores: ['node_modules/**', 'dist/**', 'build/**'],

    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        fetch: 'readonly',
          fetch: 'readonly',
  setTimeout: 'readonly',
  setInterval: 'readonly',
  clearTimeout: 'readonly',
  clearInterval: 'readonly'
},
      },
    },

    rules: {
      // Prevent bugs
      'no-debugger': 'error',
      'no-duplicate-case': 'error',
      'no-extra-semi': 'error',
      'no-unreachable': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-undef': 'error',

      // Code quality
      'eqeqeq': ['error', 'always'],
      'no-eval': 'error',
      'no-var': 'error',
      'curly': ['error', 'all'],

      // Formatting
      'indent': ['error', 2],
      'quotes': ['error', 'single', { avoidEscape: true }],
      'semi': ['error', 'always'],
      'no-trailing-spaces': 'error',
      'keyword-spacing': 'error',
    },
  },
]