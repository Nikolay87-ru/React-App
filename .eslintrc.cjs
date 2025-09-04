module.exports = {
  env: { browser: true, es2021: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  parser: '@typescript-eslint/parser',
  rules: {
    'react/react-in-jsx-scope': 'off',
    'prettier/prettier': ['error', { endOfLine: 'auto' }]
  }
}