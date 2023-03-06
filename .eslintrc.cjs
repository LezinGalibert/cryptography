module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  ignorePatterns: ['*.js', '*.config.ts'],
  parserOptions: {
    tsconfigRootDir: '.',
    project: 'tsconfig.json',
  },
};
