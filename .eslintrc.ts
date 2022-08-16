module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'no-unused-vars': ['error', { vars: 'all', args: 'after-used', ignoreRestSiblings: false }],
    'max-len': [
      'error',
      {
        code: 100,
        tabWidth: 2,
        // Ignore imports, urls (passed as href param), and strings on their own line
        ignorePattern: "^\\s*(import|href|'.*',?$).*",
      },
    ],
    indent: ['error', 2],
    semi: 1,
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'only-multiline',
      },
    ],
    'key-spacing': ['error', { beforeColon: false }],
    'space-before-function-paren': ['error', 'never'],
    'space-infix-ops': 'error',
    'keyword-spacing': ['error', { before: true }],
    'comma-spacing': ['error', { before: false, after: true }],
    'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
    'object-curly-spacing': ['error', 'always'],
  },
};
