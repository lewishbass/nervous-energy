module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    // Allow @ts-ignore comments
    '@typescript-eslint/ban-ts-comment': 'off',
    
    // Alternatively, you can configure it to allow specific directives:
    // '@typescript-eslint/ban-ts-comment': [
    //   'error',
    //   {
    //     'ts-ignore': false,
    //     'ts-expect-error': false,
    //   },
    // ],
  },
};
