module.exports = {
    env: {
      browser: true,
      es2021: true,
    },
    extends: ['airbnb-base', 'prettier'],
    parserOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
    },
    rules: {
      'func-names': 0,
      'no-plusplus': 0,
      'no-restricted-syntax': 0,
      'prefer-destructuring': 0,
      'no-prototype-builtins': 0,
      'no-use-before-define': 0,
      'import/prefer-default-export': 0,
      quotes: ['error', 'single'],
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error', 'info', 'group', 'groupCollapsed', 'groupEnd'],
        },
      ],
      'import/extensions': 0,
      'max-len': [
        'warn',
        {
          code: 100,
          ignoreUrls: true,
          ignoreComments: true,
          ignoreTemplateLiterals: true,
        },
      ],
    },
  };